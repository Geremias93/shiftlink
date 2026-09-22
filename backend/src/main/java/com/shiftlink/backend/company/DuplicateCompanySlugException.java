package com.shiftlink.backend.company;

public class DuplicateCompanySlugException extends RuntimeException {

    public DuplicateCompanySlugException(String slug) {
        super("A company with slug '" + slug + "' already exists");
    }
}
