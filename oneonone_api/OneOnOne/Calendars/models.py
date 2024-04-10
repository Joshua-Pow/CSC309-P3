from django.db import models
from django.contrib.auth.models import User


class Calendar(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(
        User, related_name="created_calendars", on_delete=models.CASCADE
    )
    is_finalized = models.BooleanField(default=False)
    final_date = models.DateField(
        null=True, blank=True
    )  # The final date for the calendar
    final_timeslot_start = models.TimeField(
        null=True,
        blank=True,
    )  # Reference to a Timeslot model
    final_timeslot_end = models.TimeField(
        null=True,
        blank=True,
    )  # Reference to a Timeslot model

    class Meta:
        ordering = ["-updated_at"]


class Day(models.Model):
    calendar = models.ForeignKey(
        Calendar, related_name="days", on_delete=models.CASCADE
    )
    date = models.DateField()
    ranking = models.IntegerField()

    class Meta:
        ordering = ["date"]
        unique_together = (
            "calendar",
            "ranking",
        )  # Enforcing unique ranking within a calendar


class Participant(models.Model):
    user = models.ForeignKey(
        User, related_name="calendar_participations", on_delete=models.CASCADE
    )
    calendar = models.ForeignKey(
        Calendar, related_name="participants", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ("user", "calendar")
