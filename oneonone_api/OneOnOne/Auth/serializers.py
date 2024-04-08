from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user details to the response
        data["firstName"] = self.user.first_name
        data["lastName"] = self.user.last_name
        data["email"] = self.user.email

        return data


class UserSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(write_only=True, required=True)
    lastName = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["username", "firstName", "lastName", "email", "password", "password2"]
        extra_kwargs = {
            "password": {"write_only": True},
            "password2": {"write_only": True},
        }

    def validate(self, data):
        # Check that the two password entries match
        if data["password"] != data["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        # Validate the password and catch the exception
        validate_password(data["password"])

        return data

    def create(self, validated_data):
        # Correctly remove the password2 field from the validated data
        validated_data.pop("password2", None)
        first_name = validated_data.pop("firstName", None)  # Pop firstName
        last_name = validated_data.pop("lastName", None)  # Pop lastName
        # Create a new user instance
        user = User.objects.create_user(
            username=validated_data["username"],
            first_name=first_name,
            last_name=last_name,
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user
