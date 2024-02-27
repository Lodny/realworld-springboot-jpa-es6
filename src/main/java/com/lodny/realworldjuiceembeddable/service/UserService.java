package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.LoginRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterUserRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UpdateUserRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.repository.UserRepository;
import com.lodny.realworldjuiceembeddable.sys.exception.RealException;
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
        final String errorMsg = "email or password is invalid. please check.";

        RealWorldUser foundUser = userRepository.findByEmail(loginRequest.email())
                        .orElseThrow(() -> new RealException(errorMsg));
        log.info("[S] login() : foundUser={}", foundUser);

        if (! loginRequest.password().equals(foundUser.getPassword()))
            throw new RealException(errorMsg);

        String token = jwtUtil.createToken(foundUser.getEmail());
        log.info("[S] login() : token={}", token);

        return UserResponse.of(foundUser, token);
    }

    public UserResponse updateUser(final UpdateUserRequest updateUserRequest, final UserResponse loginUser) {
        log.info("[S] updateUser() : loginUser={}", loginUser);

        final RealWorldUser user = loginUser.user();
        user.update(updateUserRequest);
        RealWorldUser savedUser = userRepository.save(user);
        log.info("[S] updateUser() : savedUser={}", savedUser);

        return UserResponse.of(savedUser, loginUser.token());
    }
}
