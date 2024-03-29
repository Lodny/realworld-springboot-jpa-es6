package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.dto.LoginRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterUserRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UpdateUserRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapLoginRequest;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapRegisterUserRequest;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapUpdateUserRequest;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapUserResponse;
import com.lodny.realworldjuiceembeddable.service.UserService;
import com.lodny.realworldjuiceembeddable.sys.annotation.JwtTokenRequired;
import com.lodny.realworldjuiceembeddable.sys.annotation.LoginUser;
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
        RegisterUserRequest registerUserRequest = wrapRegisterUserRequest.user();
        log.info("[C] registerUser() : registerUserRequest={}", registerUserRequest);

        UserResponse userResponse = userService.registerUser(registerUserRequest);
        log.info("[C] registerUser() : userResponse={}", userResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapUserResponse(userResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody final WrapLoginRequest wrapLoginRequest) {
        LoginRequest loginRequest = wrapLoginRequest.user();
        log.info("[C] login() : loginRequest={}", loginRequest);

        UserResponse userResponse = userService.login(loginRequest);
        log.info("[C] login() : userResponse={}", userResponse);

        return ResponseEntity.ok(new WrapUserResponse(userResponse));
    }

    @JwtTokenRequired
    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody final WrapUpdateUserRequest wrapUpdateUserRequest,
                                        @LoginUser final UserResponse loginUser) {
        UpdateUserRequest updateUserRequest = wrapUpdateUserRequest.user();
        log.info("[C] updateUser() : updateUserRequest={}", updateUserRequest);

        UserResponse userResponse = userService.updateUser(updateUserRequest, loginUser);
        log.info("[C] registerUser() : userResponse={}", userResponse);

        return ResponseEntity.ok(new WrapUserResponse(userResponse));
    }
}
