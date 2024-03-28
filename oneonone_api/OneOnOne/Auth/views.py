from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.decorators import permission_classes
from drf_spectacular.utils import OpenApiResponse


@extend_schema_view(
    post=extend_schema(
        description="Register a new user",
        request=UserSerializer,
        responses={201: OpenApiResponse(description="User created successfully")},
    ),
)
@permission_classes([permissions.AllowAny])
class RegisterUserAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
