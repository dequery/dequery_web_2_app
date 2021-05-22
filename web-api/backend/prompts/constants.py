from model_utils import Choices


PROMPT_STATUS_CHOICES = Choices(
    ('active', 'ACTIVE', 'Active for answers'),
    ('closing', 'CLOSING', 'Prompt is closed for answers and caclulating distribution'),
    ('closed', 'CLOSED', 'Prompt is closed and bounties are distributed'),
)
