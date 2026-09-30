package com.flightportal.service;
import com.flightportal.model.City;
import com.flightportal.model.Flight;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Locale;
import java.util.stream.Stream;
@Service
public class FlightService {
  private final List<City> cities = List.of(
    new City("HYD","Hyderabad"), new City("DEL","Delhi"), new City("BOM","Mumbai"),
    new City("BLR","Bengaluru"), new City("DXB","Dubai"), new City("LHR","London"),
    new City("JFK","New York"), new City("SIN","Singapore")
  );
  private final List<Flight> flights = List.of(
    new Flight(1L,"IndiGo","6E-101","HYD","JFK","06:30","18:30","12h 00m",0,"—",42000,true),
    new Flight(2L,"Emirates","EK-529","HYD","JFK","04:35","15:30","13h 25m",1,"Dubai",51000,true),
    new Flight(3L,"Qatar Airways","QR-501","HYD","JFK","03:55","17:45","15h 20m",1,"Doha",48000,true),
    new Flight(4L,"British Airways","BA-276","HYD","JFK","07:20","19:10","22h 50m",2,"London, Delhi",56000,true),
    new Flight(5L,"Air India","AI-840","HYD","DEL","08:00","10:20","2h 20m",0,"—",6500,true),
    new Flight(6L,"IndiGo","6E-221","HYD","BOM","11:10","13:00","1h 50m",0,"—",5900,false),
    new Flight(7L,"Emirates","EK-527","HYD","LHR","21:20","07:00","14h 10m",1,"Dubai",45500,true),
    new Flight(8L,"Singapore Airlines","SQ-517","HYD","SIN","11:40","19:20","5h 10m",0,"—",23000,true),
    new Flight(9L,"Air India","AI-950","HYD","JFK","20:00","11:30","23h 30m",2,"Delhi, London",52000,false),
    new Flight(10L,"IndiGo","6E-305","DEL","JFK","09:00","18:30","14h 30m",1,"London",39000,true),
    new Flight(11L,"Emirates","EK-511","BOM","JFK","10:00","23:00","18h 00m",1,"Dubai",47000,true),
    new Flight(12L,"Qatar Airways","QR-477","BLR","JFK","04:20","17:30","18h 10m",1,"Doha",50000,true)
  );
  public List<City> getCities() { return cities; }
  public List<Flight> search(String source, String destination) {
    if (source == null || destination == null || source.isBlank() || destination.isBlank())
      throw new IllegalArgumentException("Source and destination are required");
    if (source.equalsIgnoreCase(destination))
      throw new IllegalArgumentException("Source and destination cannot be the same");
    return flights.stream()
      .filter(f -> f.source().equalsIgnoreCase(source.trim()) && f.destination().equalsIgnoreCase(destination.trim()))
      .toList();
  }
}