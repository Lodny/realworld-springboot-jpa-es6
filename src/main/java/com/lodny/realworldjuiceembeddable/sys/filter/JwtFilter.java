package com.lodny.realworldjuiceembeddable.sys.filter;

import com.lodny.realworldjuiceembeddable.sys.properties.JwtProperty;
import com.lodny.realworldjuiceembeddable.sys.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtProperty jwtProperty;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response, final FilterChain filterChain) throws ServletException, IOException {
        String auth = request.getHeader(jwtProperty.getHeader());
        log.info("[F] doFilterInternal() : auth={}", auth);

        filterChain.doFilter(request, response);
    }
}
