from django.urls import path
from .views import (
    CalendarListCreateAPIView,
    CalendarRetrieveUpdateDestroyAPIView,
)
from Invitations.views import InvitationListCreateAPIView, InvitationChangeStatusAPIView, InvitationListAPIView
from TimeSlots.views import (
    TimeSlotListCreateAPIView,
    TimeSlotRetrieveUpdateDestroyAPIView,
)

urlpatterns = [
    path("", CalendarListCreateAPIView.as_view(), name="calendars_list_create"),
    path(
        "<int:pk>/",
        CalendarRetrieveUpdateDestroyAPIView.as_view(),
        name="calendars_retrieve_update_delete",
    ),
    path(
        "<int:calendar_id>/day/<int:day_id>/timeslot/",
        TimeSlotListCreateAPIView.as_view(),
        name="timeslot_list_create",
    ),
    path(
        "<int:calendar_id>/day/<int:day_id>/timeslot/<int:pk>/",
        TimeSlotRetrieveUpdateDestroyAPIView.as_view(),
        name="timeslot_detail",
    ),
    path(
        "invitations/",
        InvitationListAPIView.as_view(),
        name="invitations_list",
    ),
    path(
        "<int:calendar_id>/invitations/",
        InvitationListCreateAPIView.as_view(),
        name="invitations_list_create",
    ),
    path(
        "<int:calendar_id>/invitations/<int:pk>/",
        InvitationChangeStatusAPIView.as_view(),
        name="invitations_update_delete",
    ),
]
