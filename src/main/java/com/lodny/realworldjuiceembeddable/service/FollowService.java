package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Follow;
import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.ProfileResponse;
import com.lodny.realworldjuiceembeddable.repository.FollowRepository;
import com.lodny.realworldjuiceembeddable.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public ProfileResponse follow(final String followeeUsername, final Long followerId) {
        RealWorldUser followeeUser = userRepository.findByUsername(followeeUsername);
        log.info("[S] follow() : followeeUser={}", followeeUser);
        if (followeeUser == null)
            throw new IllegalArgumentException("The followee is not found");

        Follow savedFollow = followRepository.save(Follow.of(followeeUser.getId(), followerId));
        log.info("[S] follow() : savedFollow={}", savedFollow);

        return ProfileResponse.of(followeeUser, true);
    }
}
