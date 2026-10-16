package com.hireflow.api.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

import java.net.URI;

/**
 * Production datasource setup.
 *
 * Render provides PostgreSQL as a postgresql:// connection URI. Other hosts
 * can instead provide DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD.
 */
@Configuration
@Profile("prod")
public class ProductionDataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    public HikariDataSource productionDataSource(Environment environment) {
        HikariDataSource dataSource = new HikariDataSource();
        String databaseUrl = environment.getProperty("DATABASE_URL");

        if (databaseUrl != null && !databaseUrl.isBlank()) {
            configureFromConnectionUri(dataSource, databaseUrl);
            return dataSource;
        }

        String explicitJdbcUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        if (explicitJdbcUrl != null && !explicitJdbcUrl.isBlank()) {
            dataSource.setJdbcUrl(explicitJdbcUrl);
        } else {
            String host = required(environment, "DB_HOST");
            String port = environment.getProperty("DB_PORT", "5432");
            String database = required(environment, "DB_NAME");
            dataSource.setJdbcUrl("jdbc:postgresql://" + host + ":" + port + "/" + database);
        }

        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUsername(firstNonBlank(
                environment.getProperty("DB_USER"),
                environment.getProperty("SPRING_DATASOURCE_USERNAME")));
        dataSource.setPassword(firstNonBlank(
                environment.getProperty("DB_PASSWORD"),
                environment.getProperty("SPRING_DATASOURCE_PASSWORD")));
        return dataSource;
    }

    private void configureFromConnectionUri(HikariDataSource dataSource, String connectionUri) {
        URI uri = URI.create(connectionUri);
        String scheme = uri.getScheme();
        if (scheme == null || !(scheme.equals("postgres") || scheme.equals("postgresql"))) {
            throw new IllegalArgumentException("DATABASE_URL must use postgres:// or postgresql://");
        }
        if (uri.getHost() == null || uri.getRawPath() == null || uri.getRawPath().length() < 2) {
            throw new IllegalArgumentException("DATABASE_URL must include a host and database name");
        }

        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://").append(uri.getHost());
        if (uri.getPort() > 0) {
            jdbcUrl.append(':').append(uri.getPort());
        }
        jdbcUrl.append(uri.getRawPath());
        if (uri.getRawQuery() != null && !uri.getRawQuery().isBlank()) {
            jdbcUrl.append('?').append(uri.getRawQuery());
        }

        String userInfo = uri.getUserInfo();
        if (userInfo == null || !userInfo.contains(":")) {
            throw new IllegalArgumentException("DATABASE_URL must contain database credentials");
        }
        int separator = userInfo.indexOf(':');
        dataSource.setJdbcUrl(jdbcUrl.toString());
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUsername(userInfo.substring(0, separator));
        dataSource.setPassword(userInfo.substring(separator + 1));
    }

    private String required(Environment environment, String key) {
        String value = environment.getProperty(key);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Missing required production database variable: " + key);
        }
        return value;
    }

    private String firstNonBlank(String first, String second) {
        if (first != null && !first.isBlank()) return first;
        return second;
    }
}
