package com.lodny.realworldjuiceembeddable.entity.dto;

import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.sys.util.ImageUtil;
import lombok.Builder;

@Builder
public record ProfileResponseRecord(
    String username,
    String bio,
    String image,
    Boolean following
) {
    public ProfileResponseRecord {
        image = ImageUtil.nullToDefaultImage(image);
    }

    public static ProfileResponseRecord of(final RealWorldUser user, final Boolean following) {
        if (user == null)
            return null;

        return new ProfileResponseRecord(
                user.getUsername(),
                user.getBio(),
                user.getImage(),
                following);
    }
}
