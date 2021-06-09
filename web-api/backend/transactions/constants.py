from django.db.models.fields import CharField
from model_utils import Choices


ETH_GAS_FEE = 0.000000023

DEQ_TO_ETH_CONVERSION_RATIO = 0.0001
ETH_TO_DEQ_CONVERSION_RATIO = 10000

TRANSACTION_CATEGORY_CHOICES = Choices(
    ('from_answer', 'FROM_ANSWER', 'From upvoted answer'),
    ('from_askers_cut', 'FROM_ASKERS_CUT', 'From askers cut'),
    ('from_source', 'FROM_SOURCE', 'From source database'),  # money printer go BRRR
    ('from_expired_prompt', 'FROM_EXPIRED_PROMPT', 'Prompt expired with no answers'),
    ('increase_prompt_bounty', 'INCREASE_PROMPT_BOUNTY', 'Increase a prompt bounty'),
    ('to_eth', 'TO_ETH', 'DEQ cashed out to ETH'),
    ('to_usd', 'TO_USD', 'DEQ cashed out to USD'),
    ('to_prompt_bounty', 'TO_PROMPT_BOUNTY', 'To create a prompt bounty'),
)

VALID_API_CATEGORIES = [
    TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY,
    TRANSACTION_CATEGORY_CHOICES.TO_ETH,
]

SPENDING_CATEGORIES = [
    TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY,
    TRANSACTION_CATEGORY_CHOICES.TO_PROMPT_BOUNTY,
    TRANSACTION_CATEGORY_CHOICES.TO_ETH,
    TRANSACTION_CATEGORY_CHOICES.TO_USD,
]

RECEIVING_CATEGORIES = [
    TRANSACTION_CATEGORY_CHOICES.FROM_ANSWER,
    TRANSACTION_CATEGORY_CHOICES.FROM_ASKERS_CUT,
    TRANSACTION_CATEGORY_CHOICES.FROM_SOURCE,
    TRANSACTION_CATEGORY_CHOICES.FROM_EXPIRED_PROMPT,
]

TRANSACTION_STATUS_CHOICES = Choices(
    ('new', 'NEW', 'Initially created'),
    ('proccessing', 'PROCCESSING', 'In process'),
    ('rejected', 'REJECTED', 'Rejected'),
    ('fulfilled', 'FULFILLED', 'Fulfilled')
)
