package com.lodny.realworldjuiceembeddable.sys.interceptor;

import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.sys.annotation.JwtTokenRequired;
import com.lodny.realworldjuiceembeddable.sys.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Method;

@Slf4j
@Component
public class JwtTokenInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.info("[I] preHandle() : request={}", request);

        if (handler instanceof HandlerMethod) {
            Method method = ((HandlerMethod) handler).getMethod();
            if (method.isAnnotationPresent(JwtTokenRequired.class)) {
                UserResponse loginUser = JwtUtil.currentUser();
                if (loginUser == null)
//                    response.sendRedirect("/my-error");
                    throw new IllegalArgumentException("token not found");
            }
        }

        return true;
    }
}
