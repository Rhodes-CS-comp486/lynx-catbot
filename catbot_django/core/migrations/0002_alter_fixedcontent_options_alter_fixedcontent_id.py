# Generated by Django 4.2.19 on 2025-03-04 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='fixedcontent',
            options={'verbose_name': 'Major Requirements'},
        ),
        migrations.AlterField(
            model_name='fixedcontent',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
