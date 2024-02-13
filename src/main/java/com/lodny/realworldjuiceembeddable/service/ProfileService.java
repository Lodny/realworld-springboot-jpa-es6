package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.ProfileResponse;
import com.lodny.realworldjuiceembeddable.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileResponse getProfile(final String username) {
        RealWorldUser foundUser = userRepository.findByUsername(username);
        log.info("[S] getProfile() : foundUser={}", foundUser);
        if (foundUser == null)
            throw new IllegalArgumentException("user not found");

        return ProfileResponse.of(foundUser);
    }
}
