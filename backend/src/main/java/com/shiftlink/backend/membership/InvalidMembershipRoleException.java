package com.shiftlink.backend.membership;

public class InvalidMembershipRoleException extends RuntimeException {

    public InvalidMembershipRoleException(String message) {
        super(message);
    }
}
