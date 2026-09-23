package com.shiftlink.backend.handover;

public class InvalidHandoverStateException extends RuntimeException {

    public InvalidHandoverStateException(String message) {
        super(message);
    }
}
