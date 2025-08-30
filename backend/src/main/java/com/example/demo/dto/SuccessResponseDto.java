package com.example.demo.dto;


public class SuccessResponseDto {
    private String message;
    private int status;

    public SuccessResponseDto(String message, int status) {
        this.message = message;
        this.status = status;
    }

    // Getter
    public String getMessage() { return message; }
    public int getStatus() { return status; }
}
