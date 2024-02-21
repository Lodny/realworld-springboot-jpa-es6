package com.lodny.realworldjuiceembeddable.repository;

import com.lodny.realworldjuiceembeddable.entity.dto.ProfileResponse;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ProfileRepository {
    private final EntityManager entityManager;

    public ProfileResponse findByUsernameAndGetProfile(final String username, final Long loginUserId) {
        log.info("findByUsernameAndGetProfile() : username={}", username);

        return entityManager
                .createQuery("""
                    select  u.username
                          , u.bio
                          , u.image
                          , CASE WHEN f.id.followeeId IS NULL THEN FALSE ELSE TRUE END
                    from    RealWorldUser u
                    left join Follow f on f.id.followerId = :loginUserId
                    where   u.username = :username
                """, ProfileResponse.class)
                .setParameter("username", username)
                .setParameter("loginUserId", loginUserId)
                .getSingleResult();
    }
}
