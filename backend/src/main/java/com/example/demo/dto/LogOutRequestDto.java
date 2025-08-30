package com.example.demo.dto;
public class LogOutRequestDto {

    private String refreshToken;
    // Constructor, getter, setter
    public LogOutRequestDto() {
    }
	public String getRefreshToken() {
		return refreshToken;
	}
	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}
}

