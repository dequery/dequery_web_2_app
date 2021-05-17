"""
Custom Extended User model as recomended by the Django Docs

https://docs.djangoproject.com/en/3.2/topics/auth/customizing/#a-full-example
"""
from django.db import models
from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser)


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
    deq_balance = models.IntegerField(default=0)

    objects = UserManager()

    USERNAME_FIELD = 'display_name'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.display_name

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
