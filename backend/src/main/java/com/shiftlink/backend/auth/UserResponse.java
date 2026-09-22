package com.shiftlink.backend.auth;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.shiftlink.backend.user.UserAccount;

public record UserResponse(
    UUID id,
    String email,
    String firstName,
    String lastName,
    boolean active,
    OffsetDateTime createdAt
) {

    public static UserResponse from(UserAccount user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.isActive(),
            user.getCreatedAt()
        );
    }
}
