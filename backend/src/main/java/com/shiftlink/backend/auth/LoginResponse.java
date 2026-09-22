package com.shiftlink.backend.auth;

public record LoginResponse(
    String accessToken,
    String tokenType,
    long expiresIn,
    UserResponse user
) {
}
