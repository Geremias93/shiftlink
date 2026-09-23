package com.shiftlink.backend.shift;

import java.time.OffsetDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateShiftRequest(

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must not exceed 120 characters")
    String name,

    @NotNull(message = "Start time is required")
    OffsetDateTime startsAt,

    @NotNull(message = "End time is required")
    OffsetDateTime endsAt

) {
}
