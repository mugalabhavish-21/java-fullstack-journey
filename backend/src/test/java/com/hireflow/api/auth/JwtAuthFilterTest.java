package com.hireflow.api.auth;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.concurrent.atomic.AtomicBoolean;

import static org.junit.jupiter.api.Assertions.*;

class JwtAuthFilterTest {
    private static final String SECRET =
            "test-secret-for-hireflow-filter-tests-at-least-32-bytes";
    private final JwtService jwtService = new JwtService(SECRET);
    private final JwtAuthFilter filter = new JwtAuthFilter(jwtService);

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void validBearerTokenSetsPrincipalAndRole() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization",
                "Bearer " + jwtService.generate("applicant@example.com", "APPLICANT"));
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean invoked = new AtomicBoolean(false);

        FilterChain chain = (req, res) -> {
            invoked.set(true);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            assertNotNull(auth);
            assertEquals("applicant@example.com", auth.getName());
            assertTrue(auth.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_APPLICANT")));
        };

        filter.doFilter(request, response, chain);

        assertTrue(invoked.get());
        assertEquals(200, response.getStatus());
    }

    @Test
    void invalidBearerTokenReturns401AndStopsChain() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer not-a-jwt");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean invoked = new AtomicBoolean(false);

        filter.doFilter(request, response, (req, res) -> invoked.set(true));

        assertEquals(401, response.getStatus());
        assertTrue(response.getContentAsString().contains("Invalid or expired bearer token"));
        assertFalse(invoked.get());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void missingBearerTokenDoesNotCreateAuthentication() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean invoked = new AtomicBoolean(false);

        filter.doFilter(request, response, (req, res) -> invoked.set(true));

        assertTrue(invoked.get());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
