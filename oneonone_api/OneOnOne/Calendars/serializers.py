from rest_framework import serializers
from .models import Calendar, Day, Participant
from TimeSlots.serializers import TimeSlotSerializer
from django.contrib.auth.models import User


class ParticipantSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Participant
        fields = ["id", "username"]

    def get_username(self, obj):
        return obj.user.username


class DaySerializer(serializers.ModelSerializer):
    timeslots = TimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Day
        fields = ["id", "date", "ranking", "timeslots"]


class CalendarSerializer(serializers.ModelSerializer):
    days = DaySerializer(many=True)
    creator_username = serializers.SerializerMethodField()
    participants = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False, allow_null=True
    )

    def get_creator_username(self, obj) -> str:
        return obj.creator.username

    def create(self, validated_data):
        days_data = validated_data.pop("days")
        validated_data.pop("participants", None)
        calendar = Calendar.objects.create(**validated_data)
        for day_data in days_data:
            Day.objects.create(calendar=calendar, **day_data)
        return calendar

    def validate_days(self, value):
        if not value:
            raise serializers.ValidationError(
                "Days field must include at least one day with date and ranking."
            )
        for day in value:
            if "date" not in day or "ranking" not in day:
                raise serializers.ValidationError(
                    "Each day must include both 'date' and 'ranking' keys."
                )
        return value

    def update(self, instance, validated_data):
        days_data = validated_data.pop("days", None)
        if days_data is not None:
            instance.days.all().delete()  # Remove existing days
            for day_data in days_data:
                Day.objects.create(calendar=instance, **day_data)
        return super().update(instance, validated_data)

    class Meta:
        model = Calendar
        fields = [
            "id",
            "creator_username",
            "title",
            "description",
            "days",
            "participants",
        ]


class CalendarCreateSerializer(serializers.ModelSerializer):
    days = DaySerializer(many=True)

    class Meta:
        model = Calendar
        fields = [
            "id",
            "title",
            "description",
            "days",
        ]

    def create(self, validated_data):
        days_data = validated_data.pop("days")
        calendar = Calendar.objects.create(**validated_data)
        for day_data in days_data:
            Day.objects.create(calendar=calendar, **day_data)
        return calendar


class CalendarEditSerializer(serializers.ModelSerializer):
    days = DaySerializer(many=True)

    class Meta:
        model = Calendar
        fields = [
            "id",
            "title",
            "description",
            "days",
        ]

    def update(self, instance, validated_data):
        days_data = validated_data.pop("days", None)
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.save()

        if days_data is not None:
            instance.days.all().delete()  # Remove existing days
            for day_data in days_data:
                Day.objects.create(calendar=instance, **day_data)
        return super().update(instance, validated_data)
