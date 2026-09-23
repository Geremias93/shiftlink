package com.shiftlink.backend.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateLocationRequest(

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must not exceed 120 characters")
    String name,

    @Size(max = 255, message = "Address must not exceed 255 characters")
    String address

) {
}
