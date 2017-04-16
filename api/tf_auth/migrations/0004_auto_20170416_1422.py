# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2017-04-16 14:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tf_auth', '0003_populate_email_preferences'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tfuser',
            name='email',
            field=models.EmailField(blank=True, error_messages={'unique': 'User with this %(field_label)s already exists.'}, max_length=254, null=True, unique=True, verbose_name='email address'),
        ),
    ]
