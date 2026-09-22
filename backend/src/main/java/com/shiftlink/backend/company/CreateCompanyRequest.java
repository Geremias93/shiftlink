package com.shiftlink.backend.company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateCompanyRequest(

    @NotBlank
    @Size(max = 120)
    String name,

    @NotBlank
    @Size(max = 120)
    @Pattern(
        regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        message = "slug must contain only lowercase letters, numbers and hyphens"
    )
    String slug

) {
}
