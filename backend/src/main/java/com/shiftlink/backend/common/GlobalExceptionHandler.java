package com.shiftlink.backend.common;

import com.shiftlink.backend.shift.InvalidShiftStateException;

import java.time.OffsetDateTime;

import com.shiftlink.backend.company.DuplicateCompanySlugException;
import com.shiftlink.backend.auth.DuplicateEmailException;
import com.shiftlink.backend.auth.InvalidCredentialsException;
import com.shiftlink.backend.auth.DemoSessionLimitException;
import com.shiftlink.backend.membership.CompanyAccessDeniedException;
import com.shiftlink.backend.membership.MembershipUserNotFoundException;
import com.shiftlink.backend.membership.MembershipAlreadyActiveException;
import com.shiftlink.backend.membership.MembershipAlreadyInactiveException;
import com.shiftlink.backend.membership.InvalidMembershipRoleException;
import com.shiftlink.backend.membership.MembershipNotFoundException;
import com.shiftlink.backend.location.LocationNotFoundException;
import com.shiftlink.backend.shift.InvalidShiftTimeException;
import com.shiftlink.backend.shift.ShiftNotFoundException;
import com.shiftlink.backend.handover.DuplicateHandoverException;
import com.shiftlink.backend.handover.HandoverNotFoundException;
import com.shiftlink.backend.handover.InvalidHandoverStateException;
import com.shiftlink.backend.handover.HandoverShiftAssignmentRequiredException;
import com.shiftlink.backend.handover.HandoverSelfAcknowledgementException;
import com.shiftlink.backend.handoveritem.HandoverItemNotFoundException;
import com.shiftlink.backend.handoveritem.InvalidHandoverItemStateException;
import com.shiftlink.backend.shiftassignment.ShiftAssignmentMembershipNotFoundException;
import com.shiftlink.backend.shiftassignment.InactiveShiftAssignmentMembershipException;
import com.shiftlink.backend.shiftassignment.DuplicateShiftAssignmentException;
import com.shiftlink.backend.shiftassignment.ShiftAssignmentNotFoundException;

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


    @ExceptionHandler(DuplicateHandoverException.class)
    public ResponseEntity<ApiError> handleDuplicateHandover(
            DuplicateHandoverException exception,
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


    @ExceptionHandler(HandoverNotFoundException.class)
    public ResponseEntity<ApiError> handleHandoverNotFound(
            HandoverNotFoundException exception,
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


    @ExceptionHandler(InvalidHandoverStateException.class)
    public ResponseEntity<ApiError> handleInvalidHandoverState(
            InvalidHandoverStateException exception,
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



    @ExceptionHandler(HandoverItemNotFoundException.class)
    public ResponseEntity<ApiError> handleHandoverItemNotFound(
            HandoverItemNotFoundException exception,
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



    @ExceptionHandler(InvalidHandoverItemStateException.class)
    public ResponseEntity<ApiError> handleInvalidHandoverItemState(
            InvalidHandoverItemStateException exception,
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



    @ExceptionHandler(MembershipUserNotFoundException.class)
    public ResponseEntity<ApiError> handleMembershipUserNotFound(
            MembershipUserNotFoundException exception,
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


    @ExceptionHandler(MembershipAlreadyActiveException.class)
    public ResponseEntity<ApiError> handleMembershipAlreadyActive(
            MembershipAlreadyActiveException exception,
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


    @ExceptionHandler(InvalidMembershipRoleException.class)
    public ResponseEntity<ApiError> handleInvalidMembershipRole(
            InvalidMembershipRoleException exception,
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



    @ExceptionHandler(MembershipNotFoundException.class)
    public ResponseEntity<ApiError> handleMembershipNotFound(
            MembershipNotFoundException exception,
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



    @ExceptionHandler(MembershipAlreadyInactiveException.class)
    public ResponseEntity<ApiError> handleMembershipAlreadyInactive(
            MembershipAlreadyInactiveException exception,
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



    @ExceptionHandler(ShiftAssignmentMembershipNotFoundException.class)
    public ResponseEntity<ApiError> handleShiftAssignmentMembershipNotFound(
            ShiftAssignmentMembershipNotFoundException exception,
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


    @ExceptionHandler(InactiveShiftAssignmentMembershipException.class)
    public ResponseEntity<ApiError> handleInactiveShiftAssignmentMembership(
            InactiveShiftAssignmentMembershipException exception,
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


    @ExceptionHandler(DuplicateShiftAssignmentException.class)
    public ResponseEntity<ApiError> handleDuplicateShiftAssignment(
            DuplicateShiftAssignmentException exception,
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



    @ExceptionHandler(ShiftAssignmentNotFoundException.class)
    public ResponseEntity<ApiError> handleShiftAssignmentNotFound(
            ShiftAssignmentNotFoundException exception,
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



    @ExceptionHandler(HandoverShiftAssignmentRequiredException.class)
    public ResponseEntity<ApiError> handleHandoverShiftAssignmentRequired(
            HandoverShiftAssignmentRequiredException exception,
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



    @ExceptionHandler(HandoverSelfAcknowledgementException.class)
    public ResponseEntity<ApiError> handleHandoverSelfAcknowledgement(
            HandoverSelfAcknowledgementException exception,
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



    @ExceptionHandler(InvalidShiftStateException.class)
    public ResponseEntity<ApiError> handleInvalidShiftState(
            InvalidShiftStateException exception,
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


    @ExceptionHandler(DemoSessionLimitException.class)
    public ResponseEntity<ApiError> handleDemoSessionLimit(
            DemoSessionLimitException exception,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.TOO_MANY_REQUESTS;

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
