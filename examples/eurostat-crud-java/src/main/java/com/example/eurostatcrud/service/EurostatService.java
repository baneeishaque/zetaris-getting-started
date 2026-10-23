package com.example.eurostatcrud.service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.eurostatcrud.domain.EurostatSeries;
import com.example.eurostatcrud.domain.PageResult;
import com.example.eurostatcrud.domain.SeriesSummary;
import com.example.eurostatcrud.repository.EurostatRepository;

@Service
public class EurostatService {

    private final EurostatRepository repository;

    public EurostatService(EurostatRepository repository) {
        this.repository = repository;
    }

    public List<EurostatSeries> listAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(EurostatSeries::period).reversed())
                .toList();
    }

    public Optional<EurostatSeries> findByPeriod(String period) {
        return repository.findByPeriod(period);
    }

    public boolean existsByPeriod(String period) {
        return repository.existsByPeriod(period);
    }

    public SeriesSummary summary() {
        List<EurostatSeries> all = listAll();
        if (all.isEmpty()) {
            return new SeriesSummary(0, null, null, null, null, 0.0);
        }
        EurostatSeries latest = all.get(0);
        EurostatSeries earliest = all.get(all.size() - 1);
        double average = all.stream()
                .mapToDouble(EurostatSeries::unemploymentRatePct)
                .average()
                .orElse(0.0);
        return new SeriesSummary(
                all.size(),
                latest.period(),
                latest.unemploymentRatePct(),
                earliest.period(),
                earliest.unemploymentRatePct(),
                average);
    }

    public PageResult<EurostatSeries> page(int page, int size, String year) {
        List<EurostatSeries> all = listAll();
        List<EurostatSeries> filtered = (year == null || year.isBlank())
                ? all
                : all.stream().filter(series -> series.period().startsWith(year + "-")).toList();

        int safeSize = Math.max(1, Math.min(size, 100));
        int totalPages = filtered.isEmpty() ? 0 : (int) Math.ceil((double) filtered.size() / safeSize);
        int safePage = totalPages == 0 ? 0 : Math.max(0, Math.min(page, totalPages - 1));
        int from = safePage * safeSize;
        int to = Math.min(from + safeSize, filtered.size());
        List<EurostatSeries> items = from >= filtered.size()
                ? List.of()
                : List.copyOf(filtered.subList(from, to));

        return new PageResult<>(
                items,
                safePage,
                safeSize,
                filtered.size(),
                totalPages,
                safePage > 0,
                safePage + 1 < totalPages);
    }

    public List<String> years() {
        return listAll().stream()
                .map(series -> series.period().substring(0, 4))
                .distinct()
                .sorted(Comparator.reverseOrder())
                .toList();
    }

    public int ping() {
        return repository.ping();
    }
}
