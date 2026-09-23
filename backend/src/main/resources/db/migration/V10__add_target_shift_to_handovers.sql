ALTER TABLE handovers
ADD COLUMN target_shift_id UUID;

ALTER TABLE handovers
ADD CONSTRAINT fk_handovers_target_shift
    FOREIGN KEY (target_shift_id)
    REFERENCES shifts(id)
    ON DELETE SET NULL;

ALTER TABLE handovers
ADD CONSTRAINT chk_handovers_different_shifts
    CHECK (
        target_shift_id IS NULL
        OR target_shift_id <> shift_id
    );

CREATE INDEX idx_handovers_target_shift_id
    ON handovers(target_shift_id);
