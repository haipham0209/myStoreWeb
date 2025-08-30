package com.example.demo.dto;
public class RefreshAccessTokenRequestDto {

    private String refreshToken;
    // Constructor, getter, setter
    public RefreshAccessTokenRequestDto() {
    }
	public String getRefreshToken() {
		return refreshToken;
	}
	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}
}

