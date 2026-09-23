package com.shiftlink.backend.location;

import java.time.OffsetDateTime;
import java.util.UUID;

public record LocationResponse(
    UUID id,
    UUID companyId,
    String name,
    String address,
    boolean active,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {

    public static LocationResponse from(Location location) {
        return new LocationResponse(
            location.getId(),
            location.getCompany().getId(),
            location.getName(),
            location.getAddress(),
            location.isActive(),
            location.getCreatedAt(),
            location.getUpdatedAt()
        );
    }
}
