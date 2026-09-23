package com.shiftlink.backend.membership;

import jakarta.validation.constraints.NotNull;

public record UpdateMembershipRoleRequest(

    @NotNull
    MembershipRole role

) {
}
