package com.lodny.realworldjuiceembeddable.sys.filter;

import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.repository.UserRepository;
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
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response, final FilterChain filterChain) throws ServletException, IOException {
        String auth = request.getHeader(jwtProperty.getHeader());
        log.info("[F] doFilterInternal() : auth={}", auth);
        if (auth == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String sessionId = request.getSession().getId();
        String email = jwtUtil.getEmailByToken(auth);
        String token = auth.replace(jwtProperty.getTokenTitle(), "");
        RealWorldUser currentUser = userRepository.findByEmail(email);
        log.info("[F] doFilterInternal() : currentUser={}", currentUser);

        jwtUtil.putLoginUser(sessionId, UserResponse.of(currentUser, token));
        filterChain.doFilter(request, response);
        jwtUtil.removeLoginUser(sessionId); //todo::중간에 exception 나게 되면?
    }
}
