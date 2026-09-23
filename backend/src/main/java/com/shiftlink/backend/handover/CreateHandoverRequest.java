package com.shiftlink.backend.handover;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateHandoverRequest(

    @NotNull
    UUID targetShiftId,

    @Size(
        max = 10000,
        message = "Notes must not exceed 10000 characters"
    )
    String notes

) {
}
