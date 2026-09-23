package com.shiftlink.backend.shift;

public class ShiftNotFoundException extends RuntimeException {

    public ShiftNotFoundException() {
        super("Shift not found");
    }
}
