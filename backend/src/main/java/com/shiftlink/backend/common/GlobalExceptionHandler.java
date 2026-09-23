package com.shiftlink.backend.common;

import java.time.OffsetDateTime;

import com.shiftlink.backend.company.DuplicateCompanySlugException;
import com.shiftlink.backend.auth.DuplicateEmailException;
import com.shiftlink.backend.auth.InvalidCredentialsException;
import com.shiftlink.backend.membership.CompanyAccessDeniedException;
import com.shiftlink.backend.location.LocationNotFoundException;
import com.shiftlink.backend.shift.InvalidShiftTimeException;
import com.shiftlink.backend.shift.ShiftNotFoundException;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateCompanySlugException.class)
    public ResponseEntity<ApiError> handleDuplicateCompanySlug(
            DuplicateCompanySlugException exception,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.CONFLICT;

        ApiError error = new ApiError(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            exception.getMessage(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(status)
            .body(error);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ApiError> handleDuplicateEmail(
            DuplicateEmailException exception,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.CONFLICT;

        ApiError error = new ApiError(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            exception.getMessage(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(status)
            .body(error);
    }


    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiError> handleInvalidCredentials(
            InvalidCredentialsException exception,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.UNAUTHORIZED;

        ApiError error = new ApiError(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            exception.getMessage(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(status)
            .body(error);
    }


    @ExceptionHandler(CompanyAccessDeniedException.class)
    public ResponseEntity<ApiError> handleCompanyAccessDenied(
            CompanyAccessDeniedException exception,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.FORBIDDEN;

        ApiError error = new ApiError(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            exception.getMessage(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(status)
            .body(error);
    }


    @ExceptionHandler(LocationNotFoundException.class)
    public ResponseEntity<ApiError> handleLocationNotFound(
            LocationNotFoundException exception,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;

        ApiError error = new ApiError(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            exception.getMessage(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(status)
            .body(error);
    }


    @ExceptionHandler(InvalidShiftTimeException.class)
    public ResponseEntity<ApiError> handleInvalidShiftTime(
            InvalidShiftTimeException exception,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiError error = new ApiError(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            exception.getMessage(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(status)
            .body(error);
    }


    @ExceptionHandler(ShiftNotFoundException.class)
    public ResponseEntity<ApiError> handleShiftNotFound(
            ShiftNotFoundException exception,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;

        ApiError error = new ApiError(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            exception.getMessage(),
            request.getRequestURI()
        );

        return ResponseEntity
            .status(status)
            .body(error);
    }

}
