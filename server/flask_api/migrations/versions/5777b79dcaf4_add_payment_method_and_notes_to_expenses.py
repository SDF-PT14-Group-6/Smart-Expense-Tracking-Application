"""Add payment method and notes to expenses

Revision ID: 5777b79dcaf4
Revises: d88f7ccfb9ee
Create Date: 2026-10-30 20:38:21.637749

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5777b79dcaf4'
down_revision = 'd88f7ccfb9ee'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('expenses', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                'payment_method',
                sa.String(length=50),
                nullable=False,
                server_default='Cash',
            )
        )
        batch_op.add_column(
            sa.Column(
                'notes',
                sa.Text(),
                nullable=True,
            )
        )


def downgrade():
    with op.batch_alter_table('expenses', schema=None) as batch_op:
        batch_op.drop_column('notes')
        batch_op.drop_column('payment_method')