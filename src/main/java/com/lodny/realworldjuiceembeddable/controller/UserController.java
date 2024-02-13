package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.dto.RegisterUserRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapRegisterUserRequest;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapUserResponse;
import com.lodny.realworldjuiceembeddable.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody final WrapRegisterUserRequest wrapRegisterUserRequest) {
        // todo : Resolved [org.springframework.http.converter.HttpMessageNotReadableException: JSON parse error: Cannot construct instance of `com.lodny.realworldjuiceembeddable.entity.dto.RegisterUserRequest`, problem: email 은 필수입니다.]
        RegisterUserRequest registerUserRequest = wrapRegisterUserRequest.user();
        log.info("[C] registerUser() : registerUserRequest={}", registerUserRequest);

        UserResponse userResponse = userService.registerUser(registerUserRequest);
        log.info("[C] registerUser() : userResponse={}", userResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapUserResponse(userResponse));
    }
}
