package com.shiftlink.backend.location;

public class DuplicateLocationNameException extends RuntimeException {

    public DuplicateLocationNameException(String name) {
        super("A location with name '" + name + "' already exists in this company");
    }
}
