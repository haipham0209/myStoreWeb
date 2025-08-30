package com.example.demo.exception;

import org.springframework.security.authentication.DisabledException;

public class PendingUserException extends DisabledException {
    public PendingUserException(String msg) {
        super(msg);
    }
}
