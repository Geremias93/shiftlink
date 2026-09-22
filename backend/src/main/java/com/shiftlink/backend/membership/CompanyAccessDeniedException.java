package com.shiftlink.backend.membership;

public class CompanyAccessDeniedException extends RuntimeException {

    public CompanyAccessDeniedException() {
        super("You do not have permission to access this company");
    }
}
