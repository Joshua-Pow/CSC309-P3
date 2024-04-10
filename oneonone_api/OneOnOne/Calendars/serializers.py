from rest_framework import serializers
from .models import Calendar, Day, Participant
from TimeSlots.serializers import TimeSlotSerializer
from django.db.models import Max


class FinalizeCalendarSerializer(serializers.ModelSerializer):
    final_date = serializers.DateField()
    final_timeslot_start = serializers.TimeField(format="%H:%M")
    final_timeslot_end = serializers.TimeField(format="%H:%M")

    class Meta:
        model = Calendar
        fields = ["final_date", "final_timeslot_start", "final_timeslot_end"]

    def update(self, instance, validated_data):
        instance.final_date = validated_data.get("final_date")
        instance.final_timeslot_start = validated_data.get("final_timeslot_start")
        instance.final_timeslot_end = validated_data.get("final_timeslot_end")
        instance.is_finalized = True
        instance.save()
        return instance


class ParticipantSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = Participant
        fields = ["id", "username", "email"]

    def get_username(self, obj):
        return obj.user.username


class DaySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    timeslots = TimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Day
        fields = ["id", "date", "ranking", "timeslots"]


class CalendarSerializer(serializers.ModelSerializer):
    days = DaySerializer(many=True)
    creator_username = serializers.SerializerMethodField()
    participants = ParticipantSerializer(many=True, required=False, allow_null=True)
    final_timeslot_start = serializers.SerializerMethodField()
    final_timeslot_end = serializers.SerializerMethodField()

    def get_creator_username(self, obj) -> str:
        return obj.creator.username

    def get_final_timeslot_start(self, obj) -> str:
        return (
            obj.final_timeslot_start.strftime("%H:%M")
            if obj.final_timeslot_start
            else None
        )

    def get_final_timeslot_end(self, obj) -> str:
        return (
            obj.final_timeslot_end.strftime("%H:%M") if obj.final_timeslot_end else None
        )

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
            "is_finalized",
            "final_date",
            "final_timeslot_start",
            "final_timeslot_end",
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
            # Collect IDs of days that are meant to be updated
            update_day_ids = [
                day_data.get("id") for day_data in days_data if day_data.get("id")
            ]

            # Delete days that are not in the update payload
            instance.days.exclude(id__in=update_day_ids).delete()

            # Temporarily set rankings to a safe value
            max_ranking = (
                Day.objects.filter(calendar=instance).aggregate(Max("ranking"))[
                    "ranking__max"
                ]
                or 0
            )

            temp_ranking_start = max_ranking + 1
            for i, day_data in enumerate(days_data):
                day_id = day_data.get("id", None)
                temp_ranking = temp_ranking_start + i
                if day_id:
                    # Temporarily update existing day with a safe ranking, ensuring 'ranking' is not duplicated
                    Day.objects.filter(id=day_id, calendar=instance).update(
                        ranking=temp_ranking, date=day_data["date"]
                    )
                else:
                    # Create new day since it doesnt have an ID
                    Day.objects.create(
                        calendar=instance,
                        ranking=day_data["ranking"],
                        date=day_data["date"],
                    )

            # Now, update to the intended rankings
            for i, day_data in enumerate(days_data):
                day_id = day_data.get("id", None)
                if day_id:
                    # Ensure 'ranking' is not duplicated when updating
                    Day.objects.filter(id=day_id, calendar=instance).update(
                        ranking=day_data["ranking"]
                    )

        return super().update(instance, validated_data)
