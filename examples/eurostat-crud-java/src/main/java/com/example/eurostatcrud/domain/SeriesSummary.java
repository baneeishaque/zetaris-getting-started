package com.example.eurostatcrud.domain;

public record SeriesSummary(
        long count,
        String latestPeriod,
        Double latestRate,
        String earliestPeriod,
        Double earliestRate,
        double averageRate) {

    public long getCount() {
        return count;
    }

    public String getLatestPeriod() {
        return latestPeriod;
    }

    public Double getLatestRate() {
        return latestRate;
    }

    public String getEarliestPeriod() {
        return earliestPeriod;
    }

    public Double getEarliestRate() {
        return earliestRate;
    }

    public double getAverageRate() {
        return averageRate;
    }
}
