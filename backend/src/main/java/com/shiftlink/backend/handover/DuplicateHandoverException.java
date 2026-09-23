package com.shiftlink.backend.handover;

public class DuplicateHandoverException extends RuntimeException {

    public DuplicateHandoverException() {
        super("This shift already has a handover");
    }
}
