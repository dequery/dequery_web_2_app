"""
Custom Extended User model as recomended by the Django Docs

https://docs.djangoproject.com/en/3.2/topics/auth/customizing/#a-full-example
"""
from cryptoaddress import EthereumAddress
from django.db import models
from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser)
from django.core.exceptions import ValidationError


from backend.transactions.constants import SPENDING_CATEGORIES


class UserManager(BaseUserManager):
    def create_user(self, display_name, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            display_name=display_name,
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, display_name, password=None):
        user = self.create_user(
            display_name,
            email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


def validate_eth_address(value):
    if value == '':
        return value

    try:
        EthereumAddress(value)
    except:
        raise ValidationError('A valid eth address was not provided')
    return value


class User(AbstractBaseUser):
    created = models.DateTimeField(auto_now_add=True)
    display_name = models.CharField(max_length=20, unique=True)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    web_link = models.URLField(blank=True, default='', max_length=400)
    eth_address = models.CharField(blank=True, default='', max_length=64, validators=[validate_eth_address])

    objects = UserManager()

    USERNAME_FIELD = 'display_name'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.display_name

    @property
    def deq_balance(self):
        balance = 0
        for deq_transaction in self.deq_transactions.all():
            if deq_transaction.category in SPENDING_CATEGORIES:
                balance -= deq_transaction.amount
            else:
                balance += deq_transaction.amount
        return balance

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    def reset_password(self, new_password):
        self.set_password(new_password)
        self.save()
        return self


class AlphaRequestManager(models.Manager):
    pass


class AlphaRequest(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    text = models.CharField(max_length=640)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )

    objects = AlphaRequestManager()


class SignupCodeManager(models.Manager):
    pass


class SignupCode(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    code = models.CharField(max_length=16, db_index=True, unique=True)
    use_count = models.IntegerField(default=1)
    used = models.IntegerField(default=0)
    endowment = models.DecimalField(default=0.000000000000000000, max_digits=29, decimal_places=18)

    objects = SignupCodeManager


class ResetPasswordCodeManager(models.Manager):
    pass


class ResetPasswordCode(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    code = models.CharField(max_length=12, db_index=True, unique=True)
    expiration_datetime = models.DateTimeField()
    user = models.ForeignKey(User, related_name='reset_password_codes', on_delete=models.CASCADE)
    used = models.BooleanField(default=False)

    objects = ResetPasswordCodeManager()
