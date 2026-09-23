package com.shiftlink.backend.handover;

public class HandoverNotFoundException extends RuntimeException {

    public HandoverNotFoundException() {
        super("Handover not found");
    }
}
