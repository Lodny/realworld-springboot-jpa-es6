package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.dto.ProfileResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileResponse getProfile(final String username, final UserResponse loginUser) {
        ProfileResponse profileResponse = profileRepository.findByUsernameAndGetProfile(username, loginUser == null ? -1 : loginUser.id());
        log.info("[S] getProfile() : profileResponse={}", profileResponse);
        if (profileResponse == null)
            throw new IllegalArgumentException("user not found");

        return profileResponse;
    }
}
