from rest_framework import generics
from .models import Calendar
from .serializers import (
    CalendarSerializer,
    CalendarCreateSerializer,
    CalendarEditSerializer,
)
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema_view, extend_schema
from drf_spectacular.utils import OpenApiResponse
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from TimeSlots.models import TimeSlot


@extend_schema_view(
    list=extend_schema(
        description="List all calendars",
        responses={200: OpenApiResponse(response=CalendarSerializer(many=True))},
    ),
    create=extend_schema(
        description="Create a new calendar",
        request=CalendarCreateSerializer,
        responses={201: OpenApiResponse(response=CalendarSerializer)},
    ),
)
class CalendarListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CalendarCreateSerializer
        return CalendarSerializer

    def get_queryset(self):
        user = self.request.user

        return Calendar.objects.filter(
            Q(creator=user) | Q(participants__user=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


@extend_schema_view(
    retrieve=extend_schema(
        description="Retrieve a calendar",
        responses={200: OpenApiResponse(response=CalendarSerializer)},
    ),
    update=extend_schema(
        description="Update a calendar",
        request=CalendarEditSerializer,
        responses={204: OpenApiResponse(response=CalendarEditSerializer)},
    ),
    destroy=extend_schema(
        description="Delete a calendar",
        responses={204: OpenApiResponse(response=CalendarSerializer)},
    ),
)
@extend_schema(
    methods=["patch"],
    exclude=True,
)
class CalendarRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()

    def get_serializer_class(self):
        if self.request.method == "PUT":
            return CalendarEditSerializer
        return CalendarSerializer

    def update(self, request, *args, **kwargs):
        calendar = self.get_object()
        if calendar.creator != request.user:
            raise PermissionDenied("You do not have permission to edit this calendar.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        calendar = self.get_object()
        user = request.user
        is_creator = calendar.creator == user
        is_participant = calendar.participants.filter(user=user).exists()

        if is_creator:
            return super().destroy(request, *args, **kwargs)
        elif is_participant:
            # Remove user from participants
            calendar.participants.filter(user=user).delete()
            # Delete all timeslots owned by this user in this calendar
            TimeSlot.objects.filter(day__calendar=calendar, owner=user).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                "You do not have permission to delete this calendar."
            )
