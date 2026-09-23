package com.shiftlink.backend.shiftassignment;

public class DuplicateShiftAssignmentException extends RuntimeException {

    public DuplicateShiftAssignmentException() {
        super("El miembro ya está asignado a este turno");
    }
}
