package com.shiftlink.backend.membership;

public class MembershipUserNotFoundException extends RuntimeException {

    public MembershipUserNotFoundException(String email) {
        super("No existe ningún usuario registrado con el email: " + email);
    }
}
