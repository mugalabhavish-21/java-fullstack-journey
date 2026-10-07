package com.hireflow.api.auth;
public record AuthResponse(boolean success, String token, String email, String role, String name, String message) {}
