# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-10-07 21:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('players', '0006_player_languages'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='bio',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]