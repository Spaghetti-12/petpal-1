# Generated by Django 4.2.7 on 2023-11-18 21:35

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageAlbum',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('breed', models.CharField(max_length=200)),
                ('age', models.IntegerField()),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=200)),
                ('size', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('status', models.PositiveSmallIntegerField(choices=[(1, 'Available'), (2, 'Adopted'), (3, 'Pending'), (4, 'Withdrawn')])),
                ('location', models.CharField(max_length=200)),
                ('publication_date', models.DateField(default=django.utils.timezone.now)),
                ('shelter_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.shelterprofile')),
            ],
        ),
        migrations.CreateModel(
            name='ImageModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='')),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='listings.imagealbum')),
            ],
        ),
        migrations.AddField(
            model_name='imagealbum',
            name='listing',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='pictures', to='listings.listing'),
        ),
    ]
