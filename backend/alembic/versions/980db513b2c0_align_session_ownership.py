"""align session ownership

Revision ID: 980db513b2c0
Revises: 159050797955
Create Date: 2026-09-07 03:03:21.439568

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "980db513b2c0"
down_revision: Union[str, Sequence[str], None] = "159050797955"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # There are currently no session records,
    # so user_id can safely be added as a required column.
    with op.batch_alter_table("sessions") as batch_op:
        batch_op.add_column(
            sa.Column(
                "user_id",
                sa.Integer(),
                nullable=False,
            )
        )

        batch_op.create_index(
            "ix_sessions_user_id",
            ["user_id"],
            unique=False,
        )

        batch_op.create_foreign_key(
            "fk_sessions_user_id_users",
            "users",
            ["user_id"],
            ["id"],
        )


def downgrade() -> None:
    """Downgrade schema."""

    with op.batch_alter_table("sessions") as batch_op:
        batch_op.drop_constraint(
            "fk_sessions_user_id_users",
            type_="foreignkey",
        )

        batch_op.drop_index(
            "ix_sessions_user_id",
        )

        batch_op.drop_column(
            "user_id",
        )