package com.lodny.realworldjuiceembeddable.repository;


import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import org.springframework.data.repository.Repository;

public interface UserRepository extends Repository<RealWorldUser, Long> {

    RealWorldUser save(RealWorldUser user);
}
