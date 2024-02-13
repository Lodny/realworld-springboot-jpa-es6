package com.lodny.realworldjuiceembeddable.entity;

import com.lodny.realworldjuiceembeddable.entity.dto.RegisterUserRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RealWorldUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true)
    private String email;
    private String password;

    private String bio;
    private String image;

//    public static RealWorldUser of(final String username, final String email, final String password) {
    public static RealWorldUser of(final RegisterUserRequest request) {
        return RealWorldUser.builder()
                .username(request.username())
                .email(request.email())
                .password(request.password())
                .build();
    }

    //    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
}
