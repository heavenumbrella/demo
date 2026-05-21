from django.db import models
from django.conf import settings

class Booking(models.Model):
    ROOM_TYPES = [
        ('auditorium', 'Аудитория'),
        ('coworking', 'Коворкинг'),
        ('cinema', 'Кинозал'),
    ]
    
    PAYMENT_METHODS = [
        ('cash', 'Наличные'),
        ('card', 'Банковская карта'),
        ('cashless', 'Безналичный расчёт'),
    ]
    
    STATUS_CHOICES = [
        ('waiting', 'Ожидание'),
        ('approved', 'Одобрена'),
        ('completed', 'Завершена'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        verbose_name='Пользователь'
    )
    room_type = models.CharField(
        'Тип помещения',
        max_length=20,
        choices=ROOM_TYPES
    )
    start_time = models.DateTimeField('Дата и время начала')
    payment_method = models.CharField(
        'Способ оплаты',
        max_length=20,
        choices=PAYMENT_METHODS
    )
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=STATUS_CHOICES,
        default='waiting'
    )
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    
    def __str__(self):
        return f"Заявка #{self.id} - {self.user.full_name} ({self.get_room_type_display()})"
    
    class Meta:
        verbose_name = 'Заявка на бронирование'
        verbose_name_plural = 'Заявки на бронирование'
        ordering = ['-created_at']