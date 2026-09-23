package com.shiftlink.backend.shiftassignment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftAssignmentRepository
        extends JpaRepository<ShiftAssignment, UUID> {

    @EntityGraph(attributePaths = {
        "membership",
        "membership.user",
        "assignedBy"
    })
    List<ShiftAssignment> findByShift_IdOrderByCreatedAtAsc(
        UUID shiftId
    );

    @EntityGraph(attributePaths = {
        "membership",
        "membership.user",
        "assignedBy"
    })
    Optional<ShiftAssignment> findByIdAndShift_Id(
        UUID assignmentId,
        UUID shiftId
    );

    boolean existsByShift_IdAndMembership_Id(
        UUID shiftId,
        UUID membershipId
    );
}
