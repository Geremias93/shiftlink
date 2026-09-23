package com.shiftlink.backend.handover;

import jakarta.validation.constraints.Size;

public record CreateHandoverRequest(

    @Size(
        max = 10000,
        message = "Notes must not exceed 10000 characters"
    )
    String notes

) {
}
