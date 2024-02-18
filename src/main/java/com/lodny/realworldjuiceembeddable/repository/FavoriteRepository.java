package com.lodny.realworldjuiceembeddable.repository;

import com.lodny.realworldjuiceembeddable.entity.Favorite;
import com.lodny.realworldjuiceembeddable.entity.FavoriteId;
import org.springframework.data.repository.Repository;

public interface FavoriteRepository extends Repository<Favorite, FavoriteId> {
    Favorite save(Favorite favorite);

    void deleteById(FavoriteId favoriteId);
}
