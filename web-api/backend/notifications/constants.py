from model_utils import Choices


NOTIFICATION_CATEGORY_CHOICES = Choices(
    ('answer_created', 'ANSWER_CREATED', 'Answer Created'),
    ('out_of_band', 'OUT_OF_BAND', 'Out of band'),
    ('reset_password', 'RESET_PASSWORD', 'Reset password'),
)


NOTIFICATION_DELIVERY_METHODS = Choices(
    ('email', 'EMAIL', 'Email'),
)


NOTIFICATION_STATUS_CHOICES = Choices(
    ('new', 'NEW', 'Initially created'),
    ('proccessing', 'PROCESSING', 'In process'),
    ('failed', 'FAILED', 'Failed'),
    ('sent', 'SENT', 'Sent'),
)
