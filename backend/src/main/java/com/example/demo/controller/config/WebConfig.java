package com.example.demo.controller.config; // hoặc com.example.demo.config
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.demo.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class WebConfig implements WebMvcConfigurer {
	  
	  @Override
	  public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/uploads/**")
	            .addResourceLocations("file:uploads/");
	  }
}

