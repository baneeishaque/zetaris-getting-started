package com.example.eurostatcrud;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.eurostatcrud.service.EurostatService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@EnabledIfEnvironmentVariable(named = "ZETARIS_JDBC_URL", matches = ".+")
class EurostatJdbcIT {

    @Autowired
    private EurostatService eurostatService;

    @Value("${local.server.port}")
    private int port;

    @Test
    void readsEurostatAndReportsHealthy() throws Exception {
        assertThat(eurostatService.listAll()).isNotEmpty();
        assertThat(eurostatService.summary().count()).isPositive();
        assertThat(eurostatService.findByPeriod("2025-07")).isPresent();

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder(
                        URI.create("http://127.0.0.1:" + port + "/health"))
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("\"status\":\"UP\"");
    }
}
