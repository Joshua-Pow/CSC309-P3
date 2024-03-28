from django.db import models
from django.contrib.auth.models import User

class Contact(models.Model):
    #could add more later, this seems sufficient for now
    STATUS_CHOICES = [(1, 'Friends'),(2, 'Pending'),(3, 'Rejected'),(4, 'Blocked'),] 
    userA = models.ForeignKey(User, related_name='userA_contacts', on_delete=models.CASCADE)
    userB = models.ForeignKey(User, related_name='userB_contacts', on_delete=models.CASCADE)
    status = models.IntegerField(choices=STATUS_CHOICES)
    class Meta:
        unique_together = ('userA', 'userB') #cannot have 2 pairs of same people with A/B swapped
