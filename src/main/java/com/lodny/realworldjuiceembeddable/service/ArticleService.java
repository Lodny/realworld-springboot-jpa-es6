package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Article;
import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.ArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.ProfileResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterArticleRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleResponse registerArticle(final RegisterArticleRequest registerArticleRequest,
                                           final RealWorldUser loginUser) {
        Article article = Article.of(registerArticleRequest, loginUser.getId());
        log.info("[S] registerArticle() : article={}", article);
        log.info("[S] registerArticle() : loginUser={}", loginUser);

        Article savedArticle = articleRepository.save(article);
        log.info("[S] registerArticle() : savedArticle={}", savedArticle);

        return ArticleResponse.of(savedArticle, ProfileResponse.of(loginUser));
    }

    public ArticleResponse getArticleBySlug(final String slug, final RealWorldUser loginUser) {
        Article foundArticle = getArticleBySlug(slug);
        return ArticleResponse.of(foundArticle, ProfileResponse.of(loginUser));
    }

    public void deleteArticleBySlug(final String slug, final UserResponse loginUser) {
//        Article foundArticle = getArticleBySlug(slug);
//        if (! foundArticle.getAuthorId().equals(loginUser.id()))
//            throw new IllegalArgumentException("The author is different from the logged-in user.");
//
//        articleRepository.delete(foundArticle);

        articleRepository.deleteBySlug(slug);
//        articleRepository.deleteBySlugAndAuthorId(slug, loginUser.id());
    }

    private Article getArticleBySlug(final String slug) {
        Article foundArticle = articleRepository.findBySlug(slug);
        log.info("[S] getArticleBySlug() : foundArticle={}", foundArticle);
        if (foundArticle == null)
            throw new IllegalArgumentException("The article is not found");

        return foundArticle;
    }
}
