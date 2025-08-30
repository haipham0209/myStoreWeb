package com.example.demo.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.dto.LogOutRequestDto;
import com.example.demo.dto.LoginRequestDto;
import com.example.demo.dto.LoginResponseDto;
import com.example.demo.dto.RefreshAccessTokenRequestDto;
import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.dto.RegisterResponseDto;
import com.example.demo.service.AccountService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class AccountController {

	@Autowired
	private AccountService authService;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequestDto request, HttpServletResponse response) {
		LoginResponseDto loginResponse = authService.login(request, response);
		return ResponseEntity.ok(loginResponse);
	}

//	@PostMapping("/logout")
//	public ResponseEntity<?> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
//		authService.logout(refreshToken);
//		return ResponseEntity.ok("Logout success");
//	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletResponse response,
			@CookieValue(value = "refreshToken", required = false) String refreshToken) {

		if (refreshToken != null) {
			authService.logout(refreshToken);
			// Xóa cookie bằng cách set lại với maxAge = 0
			ResponseCookie clearCookie = ResponseCookie.from("refreshToken", "").httpOnly(true).secure(false) 
					.path("/").sameSite("None") // nếu dùng cross-origin
					.maxAge(0) // xóa ngay
					.build();

			response.setHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());
		}

		return ResponseEntity.ok("Logout success");
	}

	@PostMapping("/refresh-access-token")
	public ResponseEntity<?> refreshAccessToken(
			@CookieValue(value = "refreshToken", required = false) String refreshToken) {
		if (refreshToken == null || refreshToken.isBlank()) {
			throw new IllegalArgumentException("Refresh token is required");
		}
		String newAccessToken = authService.refreshAccessToken(refreshToken);
		return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto request) {
		RegisterResponseDto response = authService.register(request);
		return ResponseEntity.ok(response);
	}
//  @PostMapping("/forgot-password") 
//  @PostMapping("/reset-password") 
//  @PutMapping("/change-password") 

}
