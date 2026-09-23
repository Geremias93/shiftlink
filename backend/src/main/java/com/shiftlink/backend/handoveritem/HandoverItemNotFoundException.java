package com.shiftlink.backend.handoveritem;

public class HandoverItemNotFoundException extends RuntimeException {

    public HandoverItemNotFoundException() {
        super("Handover item not found");
    }
}
