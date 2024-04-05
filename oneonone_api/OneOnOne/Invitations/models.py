from django.db import models
from django.contrib.auth.models import User


class Invitation(models.Model):
    calendar = models.ForeignKey(
        "Calendars.Calendar", related_name="invitations", on_delete=models.CASCADE
    )
    invitee = models.ForeignKey(
        User, related_name="invitations", on_delete=models.CASCADE
    )
    inviter = models.ForeignKey(
        User, related_name="sent_invitations", on_delete=models.CASCADE
    )
    status = models.CharField(
        max_length=30,
        choices=[
            ("pending", "Pending"),
            ("accepted", "Accepted"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
