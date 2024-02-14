package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.dto.ProfileResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapProfileResponse;
import com.lodny.realworldjuiceembeddable.service.FollowService;
import com.lodny.realworldjuiceembeddable.sys.annotation.JwtTokenRequired;
import com.lodny.realworldjuiceembeddable.sys.annotation.LoginUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profiles/{username}")
public class FollowController {

    private final FollowService followService;

    @JwtTokenRequired
    @PostMapping("/follow")
    public ResponseEntity<?> follow(@PathVariable final String username,
                                    @LoginUser final UserResponse loginUser) {
        log.info("[C] follow() : username={}", username);
        log.info("[C] follow() : loginUser={}", loginUser);

        ProfileResponse profileResponse = followService.follow(username, loginUser.id());
        log.info("[C] follow() : profileResponse={}", profileResponse);

        return ResponseEntity.ok(new WrapProfileResponse(profileResponse));
    }

}
