package com.example.demo.util;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.entity.RefreshToken;
import com.example.demo.entity.User;
import com.example.demo.repository.RefreshTokenRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {
    @Autowired private RefreshTokenRepository refreshRepo;

    // Key
    private final SecretKey secretKey = Keys.hmacShaKeyFor("taph0Aw1ThKiwithmailKeyOnCanhVinhInBinhDinhwitha".getBytes(StandardCharsets.UTF_8));

    private final long expirationMillis = 60 * 15 * 1000; 
//    private final long expirationMillis = 15 * 1000; //  giây



    // 
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail()) 
                .claim("role", user.getRole())
                .claim("username", user.getUserName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
    

    public String generateRefreshToken(User user) {
        RefreshToken token = new RefreshToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiryDate(Instant.now().plus(1, ChronoUnit.DAYS));
        token.setRevoked(false);
        refreshRepo.save(token);
        return token.getToken();
    }
    // 
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // 
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // 
    public boolean validateToken(String token, String expectedUsername) {
        String actualUsername = extractEmail(token);
        return (actualUsername.equals(expectedUsername) && !isTokenExpired(token));
    }

    // 
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
