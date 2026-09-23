package com.shiftlink.backend.handover;

public class HandoverSelfAcknowledgementException
        extends RuntimeException {

    public HandoverSelfAcknowledgementException() {
        super("No puedes confirmar un relevo creado por ti mismo");
    }
}
