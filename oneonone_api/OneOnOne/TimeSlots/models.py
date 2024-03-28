from django.db import models
from Calendars.models import Day
from django.contrib.auth.models import User


class TimeSlot(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    owner = models.ForeignKey(
        User, related_name="created_timeslot", on_delete=models.CASCADE
    )
    day = models.ForeignKey(Day, related_name="timeslots", on_delete=models.CASCADE)
