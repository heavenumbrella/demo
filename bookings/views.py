from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.utils import timezone
from .models import Booking
from .serializers import (
    BookingSerializer, 
    BookingCreateSerializer, 
    BookingStatusSerializer
)

class BookingListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.is_superuser:
            return Booking.objects.all()

        return Booking.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookingCreateSerializer
        return BookingSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            booking = serializer.instance
            full_serializer = BookingSerializer(booking)
            return Response(
                full_serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookingDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

class BookingStatusUpdateView(generics.UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingStatusSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        

        full_serializer = BookingSerializer(instance)
        return Response(full_serializer.data)