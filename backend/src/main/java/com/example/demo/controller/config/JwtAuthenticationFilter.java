package com.example.demo.controller.config;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.dto.ErrorResponseDto;
import com.example.demo.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		final String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		final String token = authHeader.substring(7);

		try {
			String email = jwtUtil.extractEmail(token);

			if (email != null && jwtUtil.validateToken(token, email)) {
				String role = jwtUtil.extractClaims(token).get("role", String.class);

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email,
						null, List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())));

				SecurityContextHolder.getContext().setAuthentication(authentication);
			} else {
				sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token expired or invalid");
				return;
			}
		} catch (ExpiredJwtException e) {
			sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
			return;
		} catch (Exception e) {
			sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
			return;
		}

		filterChain.doFilter(request, response);
	}

	private void sendErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
		response.setStatus(status);
		response.setContentType("application/json;charset=UTF-8");
		ErrorResponseDto error = new ErrorResponseDto(message, status);
		new ObjectMapper().writeValue(response.getWriter(), error);
	}

}
