package com.example.demo.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;


	@RestController
	public class CategoryImageController {

		@GetMapping("/uploads/categories/{filename:.+}")
		public ResponseEntity<Resource> serveProductImage(@PathVariable String filename) {
		    try {
		        Path file = Paths.get("uploads/categories").resolve(filename);
		        Resource resource = new UrlResource(file.toUri());

		        if (resource.exists() && resource.isReadable()) {
		            return ResponseEntity.ok()
		                .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(file))
		                .body(resource);
		        }else {
		            Resource defaultResource = new ClassPathResource("static/images/default.jpeg");
		            String contentType = "image/jpeg";  // hoặc tự xác định content type

		            return ResponseEntity.ok()
		                .header(HttpHeaders.CONTENT_TYPE, contentType)
		                .body(defaultResource);
		        }

		    } catch (IOException e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		    }
		

	}

}
