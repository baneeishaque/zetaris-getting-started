package com.example.eurostatcrud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class EurostatCrudApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurostatCrudApplication.class, args);
    }
}
