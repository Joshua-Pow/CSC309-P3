from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Contact
from .serializers import ContactSerializer
from django.db.models import Q

# to test i made a set of postman queries, and i exported it into postman.json
# in this folder - just upload it to postman for skeletons of the tests,
# with your own data


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    # add a user while logged in
    # excludes blocked contacts (from either side) and contacts that already exist
    @action(detail=False, methods=["post"], url_path="add")
    def add(self, request):
        """
        Add a new contact to the user's contact list.
        The user to be added is specified by their username.
        The user cannot add themselves.
        If the contact already exists, the request will be rejected.
        If the contact is blocked, the request will be rejected.
        If the user is not found, the request will be rejected.
        If the user is found, the request will be accepted and the contact will be added to the user's contact list with a status of pending.
        """
        userA = request.user
        userB_username = request.data.get("username", None)
        if not userB_username:
            return Response(
                {"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        userB = get_object_or_404(User, username=userB_username)
        if userA == userB:
            return Response(
                {"error": "You cannot add yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        contact_exists = Contact.objects.filter(
            Q(userA=userA, userB=userB) | Q(userA=userB, userB=userA)
        ).first()
        if contact_exists:
            if contact_exists.status == 4:
                return Response(
                    {"error": "This contact is blocked and cannot be added."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            else:
                return Response(
                    {"error": "This contact already exists."},
                    status=status.HTTP_409_CONFLICT,
                )
        else:
            contact = Contact(userA=userA, userB=userB, status=2)
            contact.save()
            serializer = self.get_serializer(contact)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    # get nicely formatted query of all of the logged in users friends
    @action(detail=False, methods=["get"], url_path="friends")
    def friends(self, request):
        """
        Get a list of all friends of the current user.
        """
        user = request.user
        contacts = Contact.objects.filter(Q(userA=user) | Q(userB=user), status=1)
        # clean up data to easier to work with in frontend
        friend_ids = set()
        for contact in contacts:
            if contact.userA == user:
                friend_ids.add(contact.userB_id)
            elif contact.userB == user:
                friend_ids.add(contact.userA_id)
        friends = User.objects.filter(id__in=friend_ids)
        friends_cleaned = [
            {
                "id": friend.id,
                "username": friend.username,
                "email": friend.email,
                "firstName": friend.first_name,
                "lastName": friend.last_name,
            }
            for friend in friends
        ]
        return Response(friends_cleaned)

    # get nicely formatted query of all of the logged in users incoming pending friend requests
    @action(detail=False, methods=["get"], url_path="incoming")
    def incoming(self, request):
        """
        Get a list of all incoming pending friend requests for the current user.
        """
        user = request.user
        contacts = Contact.objects.filter(userB=user, status=2)
        # clean up data to easier to work with in frontend
        incoming_ids = [contact.userA_id for contact in contacts]
        incoming_users = User.objects.filter(id__in=incoming_ids)
        incoming_cleaned = [
            {"id": user.id, "username": user.username} for user in incoming_users
        ]
        return Response(incoming_cleaned)

    # get nicely formatted query of all of the logged in users outgoing pending friend requests
    @action(detail=False, methods=["get"], url_path="outgoing")
    def outgoing(self, request):
        """
        Get a list of all outgoing pending friend requests for the current user.
        """
        user = request.user
        contacts = Contact.objects.filter(userA=user, status=2)

        # clean up data to easier to work with in frontend
        incoming_ids = [contact.userB_id for contact in contacts]
        incoming_users = User.objects.filter(id__in=incoming_ids)
        incoming_cleaned = [
            {"id": user.id, "username": user.username} for user in incoming_users
        ]
        return Response(incoming_cleaned)

    # accept logged in users incoming friend request for a specific user
    # has a check to make sure there is a request from that user
    @action(detail=False, methods=["post"], url_path="accept")
    def accept(self, request):
        """
        Accept an incoming pending friend request from another user.
        """
        userB_username = request.data.get("username", None)
        if not userB_username:
            return Response(
                {"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        userBlookup = get_object_or_404(User, username=userB_username)
        contact = Contact.objects.filter(
            userA=userBlookup, userB=request.user, status=2
        ).first()  # will only be one but errors if not a check to make sure its 1
        if not contact:
            return Response(
                {"error": "No pending request from this user."},
                status=status.HTTP_404_NOT_FOUND,
            )
        contact.status = 1
        contact.save()
        return Response({"message": "Friend request accepted."})

    # reject logged in users incoming friend request for a specific user
    # has a check to make sure there is a request from that user
    @action(detail=False, methods=["post"], url_path="reject")
    def reject(self, request):
        """
        Reject an incoming pending friend request from another user.
        """
        userB_username = request.data.get("username", None)
        if not userB_username:
            return Response(
                {"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        userBlookup = get_object_or_404(User, username=userB_username)
        contact = Contact.objects.filter(
            userA=userBlookup, userB=request.user, status=2
        ).first()  # will only be one but errors if not a check to make sure its 1
        if not contact:
            return Response(
                {"error": "No pending request from this user."},
                status=status.HTTP_404_NOT_FOUND,
            )
        contact.status = 3
        contact.save()
        return Response({"message": "Friend request rejected."})

    # logged in user blocks any user
    # if they have no relationship it makes a new one that is blocked
    @action(detail=False, methods=["post"], url_path="block")
    def block(self, request):
        """
        Current user blocks another user.
        """
        userB_username = request.data.get("username", None)
        if not userB_username:
            return Response(
                {"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        userBlookup = get_object_or_404(User, username=userB_username)
        contact = Contact.objects.filter(
            (
                Q(userA=userBlookup, userB=request.user)
                | Q(userA=request.user, userB=userBlookup)
            )
        ).first()  # will only be one but errors if not a check to make sure its 1
        if (
            not contact
        ):  # no relationship - make new one thats blocked (searching + blocking)
            contact = Contact(userA=request.user, userB=userBlookup, status=4)
        else:  # friends or pending or rejected -> blocked
            contact.status = 4
        contact.save()
        return Response({"message": "User blocked successfully."})

    # logged in user unblocks a blocked user, deleting their relationship
    @action(detail=False, methods=["post"], url_path="unblock")
    def unblock(self, request):
        """
        Current user unblocks an existing blocked user.
        """
        userB_username = request.data.get("username", None)
        if not userB_username:
            return Response(
                {"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        userBlookup = get_object_or_404(User, username=userB_username)
        contact = Contact.objects.filter(
            (
                Q(userA=userBlookup, userB=request.user)
                | Q(userA=request.user, userB=userBlookup)
            )
        ).first()  # will only be one but errors if not a check to make sure its 1
        if not contact:
            return Response(
                {"error": "User is not blocked."}, status=status.HTTP_400_BAD_REQUEST
            )
        elif contact.status == 4:
            contact.delete()
            return Response({"message": "User unblocked successfully."})

    # logged in user unadds a non-blocked user, deleting their relationship
    @action(detail=False, methods=["post"], url_path="unadd")
    def unadd(self, request):
        """
        Current user unadds an existing blocked user.
        """
        userB_username = request.data.get("username", None)
        if not userB_username:
            return Response(
                {"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        userBlookup = get_object_or_404(User, username=userB_username)
        contact = Contact.objects.filter(
            (
                Q(userA=userBlookup, userB=request.user)
                | Q(userA=request.user, userB=userBlookup)
            )
        ).first()  # will only be one but errors if not a check to make sure its 1
        if not contact:
            return Response(
                {"error": "No existing relationship with user."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif contact.status == 1 or contact.status == 2 or contact.status == 3:
            contact.delete()
            return Response({"message": "User unadded successfully."})

    # quality of life get request to make getting all the available users easier
    # will be used to help autofill search bars etc. for when adding new friends
    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        """
        Get list of all people other than the current user.
        """
        users = User.objects.exclude(id=request.user.id)
        users_cleaned = [{"id": user.id, "username": user.username} for user in users]
        return Response(users_cleaned)
