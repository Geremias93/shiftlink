package com.shiftlink.backend.handoveritem;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateHandoverItemRequest(

    @NotNull(message = "Type is required")
    HandoverItemType type,

    @NotBlank(message = "Title is required")
    @Size(max = 160, message = "Title must not exceed 160 characters")
    String title,

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    String description,

    HandoverItemPriority priority

) {
}
