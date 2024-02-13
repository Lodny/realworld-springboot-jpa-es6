package com.lodny.realworldjuiceembeddable.entity.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import lombok.Builder;

@Builder
public record UserResponse(
    String email,
    String token,
    String username,
    String bio,
    String image,
    @JsonIgnore Long id,
    @JsonIgnore RealWorldUser user) {

    public static UserResponse of(final RealWorldUser user, final String token) {
       return UserResponse.builder()
               .token(token)
               .username(user.getUsername())
               .email(user.getEmail())
               .bio(user.getBio())
               .image(user.getImage())
               .id(user.getId())
               .user(user)
               .build();
    }
}
