from drf_spectacular.utils import extend_schema_view, OpenApiResponse, extend_schema
from rest_framework import permissions
from .serializers import TimeSlotSerializer
from .models import TimeSlot
from rest_framework import generics
from Calendars.models import Day, Participant
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from .serializers import TimeSlotListSerializer


@extend_schema_view(
    create=extend_schema(
        description="Create a new time slot",
        responses={201: OpenApiResponse(response=TimeSlotListSerializer)},
    ),
    list=extend_schema(
        description="List all timeslots",
        request=None,
        responses={200: OpenApiResponse(response=TimeSlotSerializer(many=True))},
    ),
)
class TimeSlotListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = TimeSlot.objects.all()
    pagination_class = None

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TimeSlotListSerializer
        else:
            return TimeSlotSerializer

    def perform_create(self, serializer):
        day_id = self.kwargs.get("day_id")
        day = get_object_or_404(Day, id=day_id)

        # Check if the user is a participant of the calendar
        user = self.request.user
        is_participant = Participant.objects.filter(
            calendar=day.calendar, user=user
        ).exists()
        if not is_participant:
            raise PermissionDenied(
                "You must be a participant of the calendar to create a time slot."
            )

        serializer.save(day=day, owner=user)


@extend_schema_view(
    get=extend_schema(
        description="Retrieve a time slot",
        request=None,
        responses={200: OpenApiResponse(response=TimeSlotSerializer)},
    ),
    patch=extend_schema(
        description="Update a time slot",
        request=TimeSlotSerializer,
        responses={200: OpenApiResponse(response=TimeSlotSerializer)},
    ),
    delete=extend_schema(
        description="Delete a time slot",
        request=None,
        responses={204: OpenApiResponse(response=TimeSlotSerializer)},
    ),
)
@extend_schema(
    methods=["patch"],
    exclude=True,
)
class TimeSlotRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TimeSlotSerializer
    queryset = TimeSlot.objects.all()

    def get_queryset(self):
        """
        This view should return a list of all the time slots
        for the currently authenticated user.
        """
        user = self.request.user
        return TimeSlot.objects.filter(owner=user)

    def perform_update(self, serializer):
        """
        Check if the user is the owner of the time slot before updating.
        """
        timeslot = self.get_object()
        if timeslot.owner != self.request.user:
            raise PermissionDenied("You do not have permission to edit this time slot.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Check if the user is the owner of the time slot before deleting.
        """
        if instance.owner != self.request.user:
            raise PermissionDenied(
                "You do not have permission to delete this time slot."
            )
        instance.delete()
