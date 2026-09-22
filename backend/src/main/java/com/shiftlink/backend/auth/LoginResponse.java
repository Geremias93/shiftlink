package com.shiftlink.backend.auth;

public record LoginResponse(
    boolean authenticated,
    UserResponse user
) {
}
