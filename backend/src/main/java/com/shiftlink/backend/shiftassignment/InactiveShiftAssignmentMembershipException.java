package com.shiftlink.backend.shiftassignment;

public class InactiveShiftAssignmentMembershipException extends RuntimeException {

    public InactiveShiftAssignmentMembershipException() {
        super("No se puede asignar al turno un miembro inactivo");
    }
}
