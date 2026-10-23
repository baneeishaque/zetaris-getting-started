package com.example.eurostatcrud.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.zetaris")
public record ZetarisProperties(
        String url,
        String username,
        String password,
        String driverClassName,
        int queryTimeoutSeconds) {
}
