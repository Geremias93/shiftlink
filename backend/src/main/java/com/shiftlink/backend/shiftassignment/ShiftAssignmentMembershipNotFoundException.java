package com.shiftlink.backend.shiftassignment;

public class ShiftAssignmentMembershipNotFoundException extends RuntimeException {

    public ShiftAssignmentMembershipNotFoundException() {
        super("El miembro no pertenece a esta empresa");
    }
}
