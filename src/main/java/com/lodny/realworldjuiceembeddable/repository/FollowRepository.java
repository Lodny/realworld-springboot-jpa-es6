package com.lodny.realworldjuiceembeddable.repository;

import com.lodny.realworldjuiceembeddable.entity.Follow;
import com.lodny.realworldjuiceembeddable.entity.FollowId;
import org.springframework.data.repository.Repository;

public interface FollowRepository extends Repository<Follow, FollowId> {
    Follow save(Follow follow);

    void deleteById(FollowId followId);
}
