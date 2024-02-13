package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.LoginRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterUserRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.repository.UserRepository;
import com.lodny.realworldjuiceembeddable.sys.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public UserResponse registerUser(final RegisterUserRequest registerUserRequest) {
        RealWorldUser newUser = RealWorldUser.of(registerUserRequest);
        RealWorldUser savedUser = userRepository.save(newUser);
        log.info("[S] registerUser() : savedUser={}", savedUser);

        String token = jwtUtil.createToken(savedUser.getEmail());
        log.info("[S] registerUser() : token={}", token);

        return UserResponse.of(savedUser, token);
    }

    public UserResponse login(final LoginRequest loginRequest) {
        RealWorldUser foundUser = userRepository.findByEmail(loginRequest.email());
        log.info("[S] login() : foundUser={}", foundUser);
        if (foundUser == null)
            throw new IllegalArgumentException("user not found");

        if (! loginRequest.password().equals(foundUser.getPassword()))
            throw new IllegalArgumentException("invalid user or password");

        String token = jwtUtil.createToken(foundUser.getEmail());
        log.info("[S] login() : token={}", token);

        return UserResponse.of(foundUser, token);
    }
}
