package com.hireflow.api.auth;
public record AuthRequest(String email, String password, String role) {}
