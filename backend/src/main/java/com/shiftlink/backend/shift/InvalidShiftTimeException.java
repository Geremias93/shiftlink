package com.shiftlink.backend.shift;

public class InvalidShiftTimeException extends RuntimeException {

    public InvalidShiftTimeException() {
        super("Shift end time must be after start time");
    }
}
