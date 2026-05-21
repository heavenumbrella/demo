from django.contrib import admin
from django.utils.html import format_html
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user_info', 'room_type_display', 'start_time_formatted',
        'payment_method_display', 'status_badge', 'status', 'created_at_formatted'
    ]
    list_filter = ['status', 'room_type', 'payment_method', 'created_at']
    search_fields = ['user__username', 'user__full_name', 'user__email']
    ordering = ['-created_at']
    list_editable = ['status']  # Теперь status есть в list_display
    list_per_page = 20
    
    fieldsets = (
        ('Информация о пользователе', {
            'fields': ('user',)
        }),
        ('Информация о бронировании', {
            'fields': ('room_type', 'start_time', 'payment_method')
        }),
        ('Статус', {
            'fields': ('status',)
        }),
        ('Даты', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at']
    
    def user_info(self, obj):
        return f"{obj.user.full_name} ({obj.user.username})"
    user_info.short_description = 'Пользователь'
    user_info.admin_order_field = 'user__full_name'
    
    def room_type_display(self, obj):
        return obj.get_room_type_display()
    room_type_display.short_description = 'Тип помещения'
    room_type_display.admin_order_field = 'room_type'
    
    def start_time_formatted(self, obj):
        return obj.start_time.strftime('%d.%m.%Y %H:%M')
    start_time_formatted.short_description = 'Дата и время'
    start_time_formatted.admin_order_field = 'start_time'
    
    def payment_method_display(self, obj):
        return obj.get_payment_method_display()
    payment_method_display.short_description = 'Способ оплаты'
    
    def status_badge(self, obj):
        colors = {
            'waiting': 'orange',
            'approved': 'green',
            'completed': 'blue'
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">● {}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Статус'
    status_badge.admin_order_field = 'status'
    
    def created_at_formatted(self, obj):
        return obj.created_at.strftime('%d.%m.%Y %H:%M')
    created_at_formatted.short_description = 'Дата создания'
    created_at_formatted.admin_order_field = 'created_at'
    
    # Скрываем поле status из list_display, показываем только status_badge
    def get_list_display(self, request):
        list_display = super().get_list_display(request)
        # Для обычных админов показываем status_badge и status для редактирования
        if request.user.is_superuser:
            return list_display
        # Для остальных убираем возможность редактирования в списке
        return [
            'id', 'user_info', 'room_type_display', 'start_time_formatted',
            'payment_method_display', 'status_badge', 'created_at_formatted'
        ]
    
    def get_list_editable(self, request):
        # Только суперпользователи могут редактировать статус в списке
        if request.user.is_superuser:
            return ['status']
        return []