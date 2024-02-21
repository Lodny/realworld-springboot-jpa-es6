package com.lodny.realworldjuiceembeddable.sys.util;

import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.sys.properties.JwtProperty;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtProperty jwtProperty;

//    @Value("${jwt.secret}")
//    private String secret;

    private static final Map<String, UserResponse> userMap = new HashMap<>();


    @EventListener(ApplicationReadyEvent.class)
    public void ready() {
        log.info("ready() : jwtProperty={}", jwtProperty);
    }

    public String createToken(final String email) {
        Date expiration = new Date(System.currentTimeMillis() + jwtProperty.getExpirationMS());

        return Jwts.builder()
                .setSubject(email)
                .setExpiration(expiration)
                .signWith(getKey())
                .compact();
    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperty.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getEmailByToken(final String authString) {
        String tokenTitle = jwtProperty.getTokenTitle();
        if (authString == null || !authString.startsWith(tokenTitle))
            return null;

        String token = authString.replace(tokenTitle, "");

        Claims claims = null;
        try {
            claims = Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            log.info("getEmailByToken() : 1={}", 1);
            throw new IllegalArgumentException("The token has expired.");
        } catch (UnsupportedJwtException e) {
            throw new IllegalArgumentException("UnsupportedJwtException");
        } catch (MalformedJwtException e) {
            throw new IllegalArgumentException("MalformedJwtException");
        } catch (SignatureException e) {
            throw new IllegalArgumentException("SignatureException");
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("IllegalArgumentException");
        }

        return claims.getSubject();
    }

    public void putLoginUser(final String sessionId, final UserResponse user) {
        log.info("putLoginUser() : sessionId={}", sessionId);
        userMap.put(sessionId, user);
    }

    public void removeLoginUser(final String sessionId) {
        log.info("removeLoginUser() : sessionId={}", sessionId);
        userMap.remove(sessionId);
    }

    public static UserResponse getAuthenticatedUser() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) return null;

        String sessionId = attributes.getSessionId();
        log.info("getAuthenticatedUser() : sessionId={}", sessionId);
        return userMap.get(sessionId);
    }
}
