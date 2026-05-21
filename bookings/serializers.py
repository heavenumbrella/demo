from rest_framework import serializers
from .models import Booking
from django.utils import timezone

class BookingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_name', 'room_type', 'room_type_display',
            'start_time', 'payment_method', 'payment_method_display',
            'status', 'status_display', 'created_at'
        ]
        read_only_fields = ['user', 'status', 'created_at']

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['room_type', 'start_time', 'payment_method']
    
    def validate_start_time(self, value):
        if value < timezone.now():
            raise serializers.ValidationError('Нельзя забронировать на прошедшее время')
        return value

class BookingStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['status']
    
    def validate_status(self, value):
        if value not in ['waiting', 'approved', 'completed']:
            raise serializers.ValidationError('Неверный статус')
        return value