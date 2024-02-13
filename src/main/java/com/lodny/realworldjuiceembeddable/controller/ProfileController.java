package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.dto.ProfileResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapProfileResponse;
import com.lodny.realworldjuiceembeddable.service.ProfileService;
import com.lodny.realworldjuiceembeddable.sys.annotation.LoginUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfile(@PathVariable final String username,
                                        @LoginUser final UserResponse loginUser) {
        log.info("[C] getProfile() : username={}", username);
        log.info("[C] getProfile() : loginUser={}", loginUser);

        ProfileResponse profileResponse = profileService.getProfile(username, loginUser);
        log.info("[C] getProfile() : profileResponse={}", profileResponse);

        return ResponseEntity.ok(new WrapProfileResponse(profileResponse));
    }
}
