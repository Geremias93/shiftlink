package com.shiftlink.backend.shiftassignment;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.shiftlink.backend.membership.Membership;
import com.shiftlink.backend.membership.MembershipRole;
import com.shiftlink.backend.user.UserAccount;

public record ShiftAssignmentResponse(
    UUID assignmentId,
    UUID shiftId,
    UUID membershipId,
    UUID userId,
    String firstName,
    String lastName,
    String email,
    MembershipRole role,
    UUID assignedByUserId,
    String assignedByFirstName,
    String assignedByLastName,
    OffsetDateTime createdAt
) {

    public static ShiftAssignmentResponse from(
            ShiftAssignment assignment) {

        Membership membership = assignment.getMembership();
        UserAccount user = membership.getUser();
        UserAccount assignedBy = assignment.getAssignedBy();

        return new ShiftAssignmentResponse(
            assignment.getId(),
            assignment.getShift().getId(),
            membership.getId(),
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            membership.getRole(),
            assignedBy.getId(),
            assignedBy.getFirstName(),
            assignedBy.getLastName(),
            assignment.getCreatedAt()
        );
    }
}
