# Generated by Django 3.1 on 2021-05-19 01:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('answers', '0003_remove_answer_votes'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('prompts', '0004_prompt_added_bounty'),
    ]

    operations = [
        migrations.CreateModel(
            name='VoteBalance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('prompt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vote_balances', to='prompts.prompt')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vote_balances', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='VoteCast',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('answer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='answers.answer')),
                ('vote_balance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='spent_votes', to='votes.votebalance')),
            ],
        ),
    ]