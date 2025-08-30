package com.example.demo.exception;

import org.springframework.security.authentication.DisabledException;

public class DeletedUserException extends DisabledException {
    public DeletedUserException(String msg) {
        super(msg);
    }
}

