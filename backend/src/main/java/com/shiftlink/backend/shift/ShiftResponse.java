package com.shiftlink.backend.shift;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ShiftResponse(
    UUID id,
    UUID locationId,
    String name,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    ShiftStatus status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {

    public static ShiftResponse from(Shift shift) {
        return new ShiftResponse(
            shift.getId(),
            shift.getLocation().getId(),
            shift.getName(),
            shift.getStartsAt(),
            shift.getEndsAt(),
            shift.getStatus(),
            shift.getCreatedAt(),
            shift.getUpdatedAt()
        );
    }
}
