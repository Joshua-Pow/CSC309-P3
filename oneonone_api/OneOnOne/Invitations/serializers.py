from rest_framework import serializers
from .models import Invitation
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied
from drf_spectacular.utils import (
    extend_schema_field,
)
from Calendars.models import Participant
from Contacts.models import Contact
from django.db.models import Q


class InvitationCreateSerializer(serializers.ModelSerializer):
    invitee_username = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = Invitation
        fields = [
            "id",
            "invitee_username",
        ]

    def create(self, validated_data):
        invitee_username = validated_data.pop("invitee_username")
        invitee = get_object_or_404(User, username=invitee_username)
        calendar = validated_data["calendar"]

        # Check if the current user is the creator of the calendar
        if validated_data["inviter"] != calendar.creator:
            raise PermissionDenied("Only the calendar creator can send invitations.")
        # Check if the invitee is the same as the inviter
        if calendar.creator == invitee:
            raise PermissionDenied("You cannot send an invitation to yourself.")
        # Check if the invitee is a friend of the inviter
        if not Contact.objects.filter(
            Q(userA=calendar.creator, userB=invitee)
            | Q(userA=invitee, userB=calendar.creator)
        ).exists():
            raise PermissionDenied("You can only send invitations to friends.")

        # Check if an invitation already exists with statuses 'pending' or if the user is already a participant of the calendar
        calendar_id = (
            self.context["request"].parser_context["kwargs"].get("calendar_id")
        )
        if Invitation.objects.filter(
            invitee=invitee, calendar_id=calendar_id, status__in=["pending"]
        ).exists():
            raise serializers.ValidationError(
                "An invitation has already been sent to that user."
            )
        if Participant.objects.filter(user=invitee, calendar=calendar).exists():
            raise serializers.ValidationError(
                "This user is already a participant of this calendar."
            )

        invitation = Invitation.objects.create(**validated_data, invitee=invitee)
        return invitation


class InvitationEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ["id", "status"]


class InvitationSerializer(serializers.ModelSerializer):
    invitee_username = serializers.SerializerMethodField()
    inviter = serializers.HiddenField(default=serializers.CurrentUserDefault())
    inviter_username = serializers.SerializerMethodField()
    calendar_id = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.ChoiceField(
        choices=["pending", "accepted", "rejected"], required=False, default="pending"
    )

    @extend_schema_field(serializers.CharField(read_only=True))
    def get_inviter_username(self, obj):
        return obj.inviter.username

    @extend_schema_field(serializers.CharField(read_only=True))
    def get_invitee_username(self, obj):
        return obj.invitee.username

    def validate_status(self, value):
        if value not in ["pending", "accepted", "rejected"]:
            raise serializers.ValidationError("Invalid status")
        return value

    def validate_invitee_username(self, value):
        # Find the User instance based on the username provided
        try:
            user = User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist")

        return user

    # def update(self, instance, validated_data):
    #     print(validated_data)
    #     instance.status = validated_data.get("status", instance.status)
    #     instance.save()
    #     return instance

    class Meta:
        model = Invitation
        fields = [
            "id",
            "calendar_id",
            "invitee_username",
            "inviter_username",
            "inviter",
            "status",
            "updated_at",
        ]
