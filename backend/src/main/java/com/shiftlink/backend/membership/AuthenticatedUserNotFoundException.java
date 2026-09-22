package com.shiftlink.backend.membership;

public class AuthenticatedUserNotFoundException extends RuntimeException {

    public AuthenticatedUserNotFoundException() {
        super("Authenticated user no longer exists");
    }
}
