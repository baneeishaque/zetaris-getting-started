package com.example.eurostatcrud.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.eurostatcrud.domain.EurostatSeries;
import com.example.eurostatcrud.exception.EurostatDataAccessException;

@Repository
public class JdbcEurostatRepository implements EurostatRepository {

    private static final String SELECT_ALL = """
            SELECT period, unemployment_rate_pct
            FROM eurostat.une_rt_m_pl_series_table
            ORDER BY period
            """;

    private static final String SELECT_ONE = """
            SELECT period, unemployment_rate_pct
            FROM eurostat.une_rt_m_pl_series_table
            WHERE period = ?
            """;

    private static final String COUNT_ONE = """
            SELECT COUNT(*)
            FROM eurostat.une_rt_m_pl_series_table
            WHERE period = ?
            """;

    private static final String COUNT_ALL = """
            SELECT COUNT(*)
            FROM eurostat.une_rt_m_pl_series_table
            """;

    private final JdbcTemplate jdbcTemplate;

    public JdbcEurostatRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<EurostatSeries> findAll() {
        try {
            return jdbcTemplate.query(SELECT_ALL, (rs, rowNum) ->
                    new EurostatSeries(rs.getString("period"), rs.getDouble("unemployment_rate_pct")));
        } catch (DataAccessException ex) {
            throw new EurostatDataAccessException("Could not read Eurostat observations from Zetaris.", ex);
        }
    }

    @Override
    public Optional<EurostatSeries> findByPeriod(String period) {
        try {
            return jdbcTemplate.query(SELECT_ONE, (rs, rowNum) ->
                    new EurostatSeries(rs.getString("period"), rs.getDouble("unemployment_rate_pct")), period)
                    .stream()
                    .findFirst();
        } catch (DataAccessException ex) {
            throw new EurostatDataAccessException(
                    "Could not read Eurostat observation " + period + " from Zetaris.", ex);
        }
    }

    @Override
    public boolean existsByPeriod(String period) {
        try {
            Long count = jdbcTemplate.queryForObject(COUNT_ONE, Long.class, period);
            return count != null && count > 0;
        } catch (DataAccessException ex) {
            throw new EurostatDataAccessException(
                    "Could not check Eurostat period " + period + " in Zetaris.", ex);
        }
    }

    @Override
    public long count() {
        try {
            Long count = jdbcTemplate.queryForObject(COUNT_ALL, Long.class);
            return count == null ? 0 : count;
        } catch (DataAccessException ex) {
            throw new EurostatDataAccessException("Could not count Eurostat observations in Zetaris.", ex);
        }
    }

    @Override
    public int ping() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result == null ? 0 : result;
        } catch (DataAccessException ex) {
            throw new EurostatDataAccessException("Could not reach Zetaris.", ex);
        }
    }
}
