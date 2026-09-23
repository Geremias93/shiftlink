package com.shiftlink.backend.shiftassignment;

public class ShiftAssignmentNotFoundException extends RuntimeException {

    public ShiftAssignmentNotFoundException() {
        super("No se ha encontrado la asignación en este turno");
    }
}
