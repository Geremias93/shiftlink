package com.shiftlink.backend.shift;

public class InvalidShiftStateException extends RuntimeException {

    public InvalidShiftStateException(String message) {
        super(message);
    }
}
