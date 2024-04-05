from rest_framework import generics
from .models import Invitation
from .serializers import (
    InvitationCreateSerializer,
    InvitationEditSerializer,
    InvitationSerializer,
)
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from Calendars.models import Calendar
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
    extend_schema_view,
)
from Calendars.models import Participant


@extend_schema_view(
    get=extend_schema(
        description="Retrieve all invitations for a calendar",
        request=None,
        responses={200: OpenApiResponse(response=InvitationSerializer(many=True))},
    ),
)
class InvitationListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvitationSerializer
    queryset = Invitation.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return InvitationCreateSerializer
        return InvitationSerializer

    def get_queryset(self):
        calendar_id = self.kwargs.get("calendar_id")
        calendar = get_object_or_404(Calendar, id=calendar_id)
        if calendar.creator != self.request.user:
            raise PermissionDenied(
                "You do not have permission to view these invitations."
            )
        return Invitation.objects.filter(calendar=calendar)

    def perform_create(self, serializer):
        calendar_id = self.kwargs.get("calendar_id")
        calendar = get_object_or_404(Calendar, id=calendar_id)

        serializer.save(
            calendar=calendar,
            inviter=self.request.user,
            invitee_username=self.request.data["invitee_username"],
            status="pending",
        )

    @extend_schema(
        description="Create an invitation",
        request=InvitationCreateSerializer,
        responses={201: OpenApiResponse(response=InvitationSerializer)},
    )
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


@extend_schema_view(
    get=extend_schema(
        description="Retrieve an invitation",
        request=InvitationSerializer,
        responses={200: OpenApiResponse(response=InvitationSerializer)},
    ),
    delete=extend_schema(
        description="Delete an invitation",
        request=InvitationSerializer,
        responses={204: OpenApiResponse(response=InvitationSerializer)},
    ),
    put=extend_schema(
        description="Update an invitation",
        request=InvitationEditSerializer,
        responses={204: OpenApiResponse(response=InvitationEditSerializer)},
    ),
)
@extend_schema(
    methods=["patch"],
    exclude=True,
)
class InvitationChangeStatusAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvitationSerializer

    def get_serializer_class(self):
        if self.request.method == "PUT":
            return InvitationEditSerializer
        return InvitationSerializer

    def get_queryset(self):
        user = self.request.user

        queryset = Invitation.objects.filter(Q(invitee=user) | Q(inviter=user))
        return queryset

    def perform_update(self, serializer):
        invitation = self.get_object()

        if invitation.invitee != self.request.user:
            raise PermissionDenied(
                "You do not have permission to change the status of this invitation."
            )
        if invitation.status in ["accepted", "rejected"]:
            raise PermissionDenied("This invitation has already been responded to.")
        else:
            if serializer.validated_data["status"] == "accepted":
                invitation.status = "accepted"
                serializer.save()

                # Add invitee as a participant to the calendar
                Participant.objects.create(
                    user=self.request.user, calendar=invitation.calendar
                )
            else:
                invitation.status = "rejected"
                serializer.save()
        return invitation

    def destroy(self, request, *args, **kwargs):
        invitation = self.get_object()

        if invitation.inviter != request.user:
            raise PermissionDenied(
                "You do not have permission to delete this invitation."
            )

        return super().destroy(request, *args, **kwargs)
