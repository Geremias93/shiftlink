package com.shiftlink.backend.handover;

import java.time.OffsetDateTime;
import java.util.UUID;

public record HandoverResponse(
    UUID id,
    UUID shiftId,
    UUID createdByUserId,
    String notes,
    HandoverStatus status,
    OffsetDateTime submittedAt,
    OffsetDateTime acknowledgedAt,
    UUID acknowledgedByUserId,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {

    public static HandoverResponse from(Handover handover) {

        UUID acknowledgedByUserId =
            handover.getAcknowledgedBy() == null
                ? null
                : handover.getAcknowledgedBy().getId();

        return new HandoverResponse(
            handover.getId(),
            handover.getShift().getId(),
            handover.getCreatedBy().getId(),
            handover.getNotes(),
            handover.getStatus(),
            handover.getSubmittedAt(),
            handover.getAcknowledgedAt(),
            acknowledgedByUserId,
            handover.getCreatedAt(),
            handover.getUpdatedAt()
        );
    }
}
