package com.flightportal.controller;
import com.flightportal.model.City;
import com.flightportal.model.Flight;
import com.flightportal.service.FlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {
  private final FlightService service;
  public FlightController(FlightService service) { this.service = service; }
  @GetMapping("/cities") public List<City> cities() { return service.getCities(); }
  @GetMapping("/flights")
  public ResponseEntity<?> flights(@RequestParam String source, @RequestParam String destination) {
    try { return ResponseEntity.ok(service.search(source, destination)); }
    catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage())); }
  }
}