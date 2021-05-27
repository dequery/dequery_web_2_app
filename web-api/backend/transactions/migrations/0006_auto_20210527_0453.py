# Generated by Django 3.1 on 2021-05-27 04:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0005_auto_20210526_0255'),
    ]

    operations = [
        migrations.AddField(
            model_name='deqtransaction',
            name='extra_info',
            field=models.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name='deqtransaction',
            name='category',
            field=models.CharField(choices=[('from_answer', 'From upvoted answer'), ('from_prompt_added_bounty', 'From added bounty'), ('from_source', 'From source database'), ('from_expired_prompt', 'Prompt expired with no answers'), ('to_eth', 'DEQ cashed out to ETH'), ('to_usd', 'DEQ cashed out to USD'), ('to_prompt_bounty', 'To create a prompt bounty')], max_length=64),
        ),
    ]