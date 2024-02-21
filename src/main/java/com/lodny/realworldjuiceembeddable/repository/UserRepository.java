package com.lodny.realworldjuiceembeddable.repository;


import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface UserRepository extends Repository<RealWorldUser, Long> {
    RealWorldUser save(final RealWorldUser user);
    Optional<RealWorldUser> findByEmail(final String email);
    Optional<RealWorldUser> findByUsername(final String username);
}
