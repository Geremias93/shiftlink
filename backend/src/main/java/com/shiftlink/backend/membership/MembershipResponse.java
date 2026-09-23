package com.shiftlink.backend.membership;

import java.util.UUID;

import com.shiftlink.backend.user.UserAccount;

public record MembershipResponse(
    UUID membershipId,
    UUID userId,
    String firstName,
    String lastName,
    String email,
    MembershipRole role,
    boolean active
) {

    public static MembershipResponse from(
            Membership membership) {

        UserAccount user = membership.getUser();

        return new MembershipResponse(
            membership.getId(),
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            membership.getRole(),
            membership.isActive()
        );
    }
}
