package com.braintrain.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("status")
@AllArgsConstructor
@CrossOrigin
public class StatusController {
    @GetMapping
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok().body("Server is up and running!");
    }
}
