package com.shiftlink.backend.handover;

public class HandoverShiftAssignmentRequiredException
        extends RuntimeException {

    public HandoverShiftAssignmentRequiredException(
            String message) {

        super(message);
    }
}
