package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);  // Dùng khi refresh

    void deleteByUserId(Long Id); // Tuỳ chọn: dùng khi logout

    boolean existsByToken(String token); // Tuỳ chọn: kiểm tra có tồn tại không
}
