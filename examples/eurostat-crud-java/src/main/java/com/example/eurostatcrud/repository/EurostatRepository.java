package com.example.eurostatcrud.repository;

import java.util.List;
import java.util.Optional;

import com.example.eurostatcrud.domain.EurostatSeries;

public interface EurostatRepository {

    List<EurostatSeries> findAll();

    Optional<EurostatSeries> findByPeriod(String period);

    boolean existsByPeriod(String period);

    long count();

    int ping();
}
