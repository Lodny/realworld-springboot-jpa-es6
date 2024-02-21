package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Follow;
import com.lodny.realworldjuiceembeddable.entity.FollowId;
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
        RealWorldUser followeeUser = userRepository.findByUsername(followeeUsername)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
        log.info("[S] follow() : followeeUser={}", followeeUser);

        Follow savedFollow = followRepository.save(Follow.of(followeeUser.getId(), followerId));
        log.info("[S] follow() : savedFollow={}", savedFollow);

        return ProfileResponse.of(followeeUser, true);
    }

    public ProfileResponse unfollow(final String followeeUsername, final Long followerId) {
        RealWorldUser followeeUser = userRepository.findByUsername(followeeUsername)
                .orElseThrow(() -> new IllegalArgumentException("The followee is not found"));
        log.info("[S] unfollow() : followeeUser={}", followeeUser);

        followRepository.deleteById(new FollowId(followeeUser.getId(), followerId));

        return ProfileResponse.of(followeeUser, false);
    }
}
