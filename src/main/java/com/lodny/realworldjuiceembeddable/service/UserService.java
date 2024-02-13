package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterUserRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse registerUser(final RegisterUserRequest registerUserRequest) {
        RealWorldUser user = RealWorldUser.of(registerUserRequest);
        RealWorldUser savedUser = userRepository.save(user);
        log.info("[S] registerUser() : savedUser={}", savedUser);

        return UserResponse.of(savedUser, "token");
    }
}
