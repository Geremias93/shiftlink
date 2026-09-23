package com.shiftlink.backend.shiftassignment;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record AddShiftAssignmentRequest(

    @NotNull
    UUID membershipId

) {
}
