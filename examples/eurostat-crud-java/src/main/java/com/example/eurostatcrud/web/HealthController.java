package com.example.eurostatcrud.web;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.eurostatcrud.service.EurostatService;

@RestController
public class HealthController {

    private final EurostatService eurostatService;

    public HealthController(EurostatService eurostatService) {
        this.eurostatService = eurostatService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        try {
            if (eurostatService.ping() == 1) {
                return ResponseEntity.ok(Map.<String, Object>of("status", "UP", "zetaris", "UP"));
            }
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.<String, Object>of("status", "DOWN", "zetaris", "DOWN"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.<String, Object>of("status", "DOWN", "zetaris", "DOWN"));
        }
    }
}
