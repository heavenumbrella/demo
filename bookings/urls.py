from django.urls import path
from . import views

urlpatterns = [
    path('bookings/', views.BookingListView.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<int:pk>/status/', views.BookingStatusUpdateView.as_view(), name='booking-status-update'),
]