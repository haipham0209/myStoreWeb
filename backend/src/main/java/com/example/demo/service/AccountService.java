package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginRequestDto;
import com.example.demo.dto.LoginResponseDto;
import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.dto.RegisterResponseDto;
import com.example.demo.entity.RefreshToken;
import com.example.demo.entity.User;
import com.example.demo.entity.User.Role;
import com.example.demo.entity.User.Status;
import com.example.demo.repository.RefreshTokenRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AccountService {

	@Autowired
	private AuthenticationManager authManager;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private RefreshTokenRepository refreshTokenRepository;

//	public LoginResponseDto login(LoginRequestDto request) {
//
//		Authentication authentication = authManager
//				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
//		// success, get user information
//		User user = userRepo.findByEmail(request.getEmail())
//				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//		// generate token
//		String accessToken = jwtUtil.generateAccessToken(user);
//		String refreshToken = jwtUtil.generateRefreshToken(user);
//
//		return new LoginResponseDto(accessToken, refreshToken);
//	}

	public LoginResponseDto login(LoginRequestDto request, HttpServletResponse response) {

	    Authentication authentication = authManager
	            .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

	    User user = userRepo.findByEmail(request.getEmail())
	            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

	    String accessToken = jwtUtil.generateAccessToken(user);

	    // Tạo và lưu refresh token vào DB
	    String refreshToken = jwtUtil.generateRefreshToken(user);

	    Cookie cookie = new Cookie("refreshToken", refreshToken);
	    cookie.setHttpOnly(true);
	    cookie.setSecure(false); // true nếu dùng HTTPS, false dev local
	    cookie.setPath("/");

	    if (request.isRemember()) {
	        // Nếu remember, set thời gian cookie dài 7 ngày
	        cookie.setMaxAge(7 * 24 * 60 * 60);
	    }
	    // Nếu không remember, không set maxAge => cookie phiên (mất khi đóng trình duyệt)

	    response.addCookie(cookie);

	    return new LoginResponseDto(accessToken, null);
	}


	public void logout(String refreshTokenStr) {
		RefreshToken token = refreshTokenRepository.findByToken(refreshTokenStr)
				.orElseThrow(() -> new IllegalArgumentException("Refresh token not exist"));

		token.setRevoked(true);
		refreshTokenRepository.save(token);
	}

	public String refreshAccessToken(String refreshToken) {
//		System.out.println("toi day");
		RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
				.orElseThrow(() -> new IllegalArgumentException("Refresh token not valid"));

		if (storedToken.isRevoked()) {
			throw new IllegalStateException("Token is revoked");
		}

		if (storedToken.isExpired()) {
			throw new IllegalStateException("Refresh token is expired");
		}

		User user = storedToken.getUser();
		if (user == null) {
			throw new IllegalStateException("User not found");
		}

		return jwtUtil.generateAccessToken(user);
	}

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder; // bcrypt

	public RegisterResponseDto register(RegisterRequestDto request) {
		// 1. Kiểm tra email đã tồn tại chưa
//		if (userRepository.existsByEmail(request.getEmail())) {
//			throw new IllegalArgumentException("Email is existed");
//		}

		// 2. Mã hóa mật khẩu
		String encodedPassword = passwordEncoder.encode(request.getPassword());

		// 3. Tạo user mới
		User user = new User();
		user.setUserName(request.getUserName());
		user.setEmail(request.getEmail());
		user.setPassword(encodedPassword);
		user.setRole(Role.CUSTOMER); //
		user.setStatus(Status.PENDING);

		userRepository.save(user);

		return new RegisterResponseDto("Account Registered");
	}

}
