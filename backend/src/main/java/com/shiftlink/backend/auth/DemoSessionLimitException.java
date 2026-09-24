package com.shiftlink.backend.auth;

public class DemoSessionLimitException extends RuntimeException {

    public DemoSessionLimitException() {
        super(
            "La demo está recibiendo demasiadas solicitudes. "
                + "Inténtalo de nuevo dentro de unos minutos."
        );
    }
}
