package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Article;
import com.lodny.realworldjuiceembeddable.entity.Favorite;
import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.ArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.ProfileResponse;
import com.lodny.realworldjuiceembeddable.repository.ArticleRepository;
import com.lodny.realworldjuiceembeddable.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ArticleRepository articleRepository;

    public ArticleResponse addFavorite(final String slug, final Long loginUserId) {
        ArticleResponse articleResponse = getArticleBySlug(slug, loginUserId);
//        Article article = articleRepository.findBySlug(slug);
//        if (article == null)
//            throw new IllegalArgumentException("The article is not found");
//        log.info("addFavorite() : article={}", article);

        Favorite favorite = favoriteRepository.save(Favorite.of(articleResponse.id(), loginUserId));
        log.info("[S] addFavorite() : favorite={}", favorite);


        return articleResponse;
    }

    private ArticleResponse getArticleBySlug(final String slug, final Long loginUserId) {
        Object[] articleAndOther = (Object[]) articleRepository.findBySlugIncludeUser(slug, loginUserId);
        log.info("getArticleBySlug() : articleAndOther.length={}", articleAndOther.length);
        log.info("getArticleBySlug() : articleAndOther={}", articleAndOther);

        if (articleAndOther.length < 2)
            throw new IllegalArgumentException("The article is not found");

        return ArticleResponse.of(
                (Article)articleAndOther[0],
                ProfileResponse.of((RealWorldUser)articleAndOther[1], false),
                true);
    }
}
