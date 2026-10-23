package com.example.eurostatcrud.config;

import java.sql.Driver;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;

@Configuration
public class ZetarisConfig {

    @Bean
    DataSource zetarisDataSource(ZetarisProperties props) throws Exception {
        Class<?> type = Class.forName(props.driverClassName());
        Driver driver = (Driver) type.getDeclaredConstructor().newInstance();
        return new SimpleDriverDataSource(driver, props.url(), props.username(), props.password());
    }

    @Bean
    JdbcTemplate zetarisJdbcTemplate(DataSource zetarisDataSource, ZetarisProperties props) {
        JdbcTemplate template = new JdbcTemplate(zetarisDataSource);
        template.setQueryTimeout(props.queryTimeoutSeconds());
        return template;
    }
}
