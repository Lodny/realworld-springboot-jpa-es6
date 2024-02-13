package com.lodny.realworldjuiceembeddable.entity.dto;

import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import lombok.Builder;

@Builder
public record ProfileResponse(
    String username,
    String bio,
    String image,
    Boolean following
) {

    public static ProfileResponse of(RealWorldUser user) {
        return new ProfileResponse(
                user.getUsername(),
                user.getBio(),
                user.getImage(),
                false);
    }
}
