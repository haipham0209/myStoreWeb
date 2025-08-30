package com.example.demo;

import com.example.demo.dto.ErrorResponseDto;
import com.example.demo.exception.DeletedUserException;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.PendingUserException;
import com.example.demo.exception.ResourceNotFoundException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// ========== 404 NOT FOUND ==========
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponseDto> handleResourceNotFound(ResourceNotFoundException ex) {
		return error(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	// ========== 409 CONFLICT ==========
	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<ErrorResponseDto> handleDuplicateResource(DuplicateResourceException ex) {
		return error(HttpStatus.CONFLICT, ex.getMessage());
	}

	// ========== 400 BAD REQUEST ==========
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponseDto> handleValidation(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage)
				.reduce((a, b) -> a + "; " + b).orElse("Validation error");

		return error(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponseDto> handleIllegalArgument(IllegalArgumentException ex) {
		return error(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	// ========== 401 UNAUTHORIZED & 403 FORBIDDEN ==========
	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ErrorResponseDto> handleBadCredentials(BadCredentialsException ex) {
		return error(HttpStatus.UNAUTHORIZED, "Invalid email or password");
	}

	@ExceptionHandler(InternalAuthenticationServiceException.class)
	public ResponseEntity<ErrorResponseDto> handleInternalAuth(InternalAuthenticationServiceException ex) {
		Throwable cause = ex.getCause();

		if (cause instanceof DeletedUserException)
			return error(HttpStatus.FORBIDDEN, "Account is deleted");
		if (cause instanceof PendingUserException)
			return error(HttpStatus.FORBIDDEN, "Account is pending approval");
		if (cause instanceof DisabledException)
			return error(HttpStatus.FORBIDDEN, "Account is disabled");

		return error(HttpStatus.UNAUTHORIZED, "Authentication failed");
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErrorResponseDto> handleDatabaseConflict(DataIntegrityViolationException ex) {
		String msg = ex.getMessage();

		if (msg.contains("users.email"))
			return error(HttpStatus.CONFLICT, "Email already exists");
		if (msg.contains("users.user_name"))
			return error(HttpStatus.CONFLICT, "Username already exists");

		return error(HttpStatus.CONFLICT, "Duplicate entry　Excep");
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ErrorResponseDto> handleIllegalState(IllegalStateException ex) {
		return error(HttpStatus.UNAUTHORIZED, ex.getMessage());
	}

	// ========== 500 INTERNAL SERVER ERROR ==========
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ErrorResponseDto> handleRuntime(RuntimeException ex) {
		ex.printStackTrace();
		return error(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error");
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponseDto> handleException(Exception ex) {
		ex.printStackTrace();
		return error(HttpStatus.INTERNAL_SERVER_ERROR, "Unknown system error");
	}

	// ======= COMMON METHOD FOR ERROR =========
	private ResponseEntity<ErrorResponseDto> error(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(new ErrorResponseDto(message, status.value()));
	}
}
