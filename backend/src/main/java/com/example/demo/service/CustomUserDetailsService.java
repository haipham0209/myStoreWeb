package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.entity.User.Status;
import com.example.demo.exception.DeletedUserException;
import com.example.demo.exception.PendingUserException;
import com.example.demo.repository.UserRepository;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + email));

        if (user.getStatus() == Status.DELETED) {
            throw new DeletedUserException("User account has been deleted");
        } else if (user.getStatus() == Status.PENDING) {
            throw new PendingUserException("User account is pending approval");
        } else if (user.getStatus() != Status.ACTIVE) {
            throw new DisabledException("User is not active");
        }

        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name().toUpperCase()))
        );
    }

}
