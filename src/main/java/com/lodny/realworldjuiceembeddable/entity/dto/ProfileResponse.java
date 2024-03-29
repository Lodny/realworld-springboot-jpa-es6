package com.lodny.realworldjuiceembeddable.entity.dto;


import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.sys.util.ImageUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private String username;
    private String bio;
    private String image;
    private Boolean following;

    public static ProfileResponse of(final RealWorldUser user, final Boolean following) {
        if (user == null)
            return null;

        return new ProfileResponse(
                user.getUsername(),
                user.getBio(),
                ImageUtil.nullToDefaultImage(user.getImage()),
                following);
    }
}
