package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequestDto {
	@NotBlank(message = "User Name must not be blank")
	private String userName;

	@Email(message = "Email format is invalid")
	@NotBlank(message = "Email must not be blank")
	private String email;

	@NotBlank(message = "Password must not be blank")
	@Size(min = 6, message = "Password must be at least 6 characters long")
	private String password;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
