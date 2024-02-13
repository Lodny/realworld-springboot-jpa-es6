package com.lodny.realworldjuiceembeddable.entity.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private String email;
    private String token;
    private String username;
    private String bio;
    private String image;

    @JsonIgnore
    private RealWorldUser realWorldUser;

    public static UserResponse of(final RealWorldUser user, final String token) {
       return UserResponse.builder()
               .token(token)
               .username(user.getUsername())
               .email(user.getEmail())
               .bio(user.getBio())
               .image(user.getImage())
               .realWorldUser(user)
               .build();
    }
}
