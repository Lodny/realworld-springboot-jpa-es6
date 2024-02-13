package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Article;
import com.lodny.realworldjuiceembeddable.entity.dto.ArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterArticleRequest;
import com.lodny.realworldjuiceembeddable.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleResponse registerArticle(final RegisterArticleRequest registerArticleRequest) {
        Article article = Article.of(registerArticleRequest);
        log.info("[S] registerArticle() : article={}", article);

        Article savedArticle = articleRepository.save(article);
        log.info("[S] registerArticle() : savedArticle={}", savedArticle);

        return ArticleResponse.of(savedArticle);
    }

    public ArticleResponse getArticleBySlug(final String slug) {
        Article foundArticle = articleRepository.findBySlug(slug);
        log.info("[S] getArticleBySlug() : foundArticle={}", foundArticle);

        return ArticleResponse.of(foundArticle);
    }
}
