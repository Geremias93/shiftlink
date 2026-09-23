package com.shiftlink.backend.membership;

public class MembershipAlreadyInactiveException extends RuntimeException {

    public MembershipAlreadyInactiveException() {
        super("El miembro ya está desactivado");
    }
}
