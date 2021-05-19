from model_utils import Choices


TRANSACTION_CATEGORY_CHOICES = Choices(
    ('from_answer', 'FROM_ANSWER', 'From upvoted answer'),
    ('from_prompt_added_bounty', 'FROM_PROMPT_ADDED_BOUNTY', 'From added bounty'),
    ('from_source', 'FROM_SOURCE', 'From source database'),  # money printer go BRRR
    ('to_prompt_bounty', 'TO_PROMPT_BOUNTY', 'To create a prompt bounty'),
)

SPENDING_CATEGORIES = [
    TRANSACTION_CATEGORY_CHOICES.TO_PROMPT_BOUNTY
]

RECEIVING_CATEGORIES = [
    TRANSACTION_CATEGORY_CHOICES.FROM_ANSWER,
    TRANSACTION_CATEGORY_CHOICES.FROM_PROMPT_ADDED_BOUNTY,
    TRANSACTION_CATEGORY_CHOICES.FROM_SOURCE,
]
