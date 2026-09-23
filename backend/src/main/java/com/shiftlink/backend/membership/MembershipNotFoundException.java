package com.shiftlink.backend.membership;

public class MembershipNotFoundException extends RuntimeException {

    public MembershipNotFoundException() {
        super("No se ha encontrado la membresía en esta empresa");
    }
}
