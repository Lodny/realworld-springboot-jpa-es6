package com.lodny.realworldjuiceembeddable.sys.resolver;

import com.lodny.realworldjuiceembeddable.sys.annotation.LoginUser;
import com.lodny.realworldjuiceembeddable.sys.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Slf4j
@Component
//@RequiredArgsConstructor
public class LoginUserMethodArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        boolean hasAnnotation = parameter.hasParameterAnnotation(LoginUser.class);
//        boolean hasUserType = User.class.isAssignableFrom(parameter.getParameterType());
//        return hasAnnotation && hasUserType;
        return hasAnnotation;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        return JwtUtil.currentUser();
//        User user = userService.getLoginUserById(webRequest.getSessionId()).orElse(null);
//        webRequest.setAttribute("user",user,0);
//        return user;
    }
}
