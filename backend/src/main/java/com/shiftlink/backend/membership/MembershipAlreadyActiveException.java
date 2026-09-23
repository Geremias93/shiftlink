package com.shiftlink.backend.membership;

public class MembershipAlreadyActiveException extends RuntimeException {

    public MembershipAlreadyActiveException() {
        super("El usuario ya pertenece a esta empresa");
    }
}
