package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Article;
import com.lodny.realworldjuiceembeddable.entity.Favorite;
import com.lodny.realworldjuiceembeddable.entity.FavoriteId;
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

    public ArticleResponse favorite(final String slug, final Long loginUserId) {
        log.info("[S] favorite() : loginUserId={}", loginUserId);
        Article article = articleRepository.findBySlug(slug);
        if (article == null)
            throw new IllegalArgumentException("article not found");

        Favorite favorite = favoriteRepository.save(Favorite.of(article.getId(), loginUserId));
        log.info("[S] addFavorite() : favorite={}", favorite);

        Object[] articleAndOther = (Object[])articleRepository.findBySlugIncludeUser(slug, loginUserId);
        return getArticleResponseByObjs(articleAndOther);
    }

    public ArticleResponse unfavorite(final String slug, final Long loginUserId) {
        log.info("[S] unfavorite() : loginUserId={}", loginUserId);
        Article article = articleRepository.findBySlug(slug);
        if (article == null)
            throw new IllegalArgumentException("article not found");

        favoriteRepository.deleteById(new FavoriteId(article.getId(), loginUserId));

        Object[] articleAndOther = (Object[])articleRepository.findBySlugIncludeUser(slug, loginUserId);
        return getArticleResponseByObjs(articleAndOther);
    }

    private ArticleResponse getArticleResponseByObjs(final Object[] articleAndOther) {
        log.info("[S] getArticleResponseByObjs() : articleAndOther.length={}", articleAndOther.length);
        log.info("[S] getArticleResponseByObjs() : articleAndOther={}", articleAndOther);
        if (articleAndOther.length < 4 || articleAndOther[0] == null)
            throw new IllegalArgumentException("The article is not found");

        return ArticleResponse.of(
                (Article) articleAndOther[0],
                ProfileResponse.of((RealWorldUser) articleAndOther[1], (Boolean)articleAndOther[3]),
                (Boolean) articleAndOther[2]);
    }
}
