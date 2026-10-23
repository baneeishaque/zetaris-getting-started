package com.example.eurostatcrud.domain;

public record EurostatSeries(String period, double unemploymentRatePct) {

    public String getPeriod() {
        return period;
    }

    public double getUnemploymentRatePct() {
        return unemploymentRatePct;
    }
}
