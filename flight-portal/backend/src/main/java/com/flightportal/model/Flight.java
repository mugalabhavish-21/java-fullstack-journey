package com.flightportal.model;
public record Flight(
  Long id, String airline, String flightNumber, String source, String destination,
  String departure, String arrival, String duration, int stops,
  String stopoverCity, double price, boolean available
) {}