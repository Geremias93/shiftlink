package com.shiftlink.backend.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.shiftlink.backend.user.UserAccount;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final long expirationMinutes;

    public JwtService(
            JwtEncoder jwtEncoder,
            @Value("${jwt.expiration-minutes}") long expirationMinutes) {

        this.jwtEncoder = jwtEncoder;
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(UserAccount user) {

        Instant now = Instant.now();
        Instant expiresAt = now.plus(
            expirationMinutes,
            ChronoUnit.MINUTES
        );

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("shiftlink")
            .issuedAt(now)
            .expiresAt(expiresAt)
            .subject(user.getId().toString())
            .claim("email", user.getEmail())
            .build();

        return jwtEncoder
            .encode(JwtEncoderParameters.from(claims))
            .getTokenValue();
    }

    public long getExpirationSeconds() {
        return expirationMinutes * 60;
    }

}
