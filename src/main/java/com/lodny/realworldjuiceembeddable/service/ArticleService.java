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

        Article savedArticle = articleRepository.save(article);
        log.info("[S] registerArticle() : savedArticle={}", savedArticle);

        return ArticleResponse.of(
                savedArticle,
                ProfileResponse.of(loginUser, false),
                false);
    }

    public ArticleResponse getArticleBySlug(final String slug, final RealWorldUser loginUser) {
        ArticleResponse articleResponse = getArticleBySlug(slug, loginUser == null ? -1 : loginUser.getId());
        log.info("getArticleBySlug() : articleResponse={}", articleResponse);

        return articleResponse;
    }

    public int deleteArticleBySlug(final String slug, final UserResponse loginUser) {
//        Article foundArticle = getArticleBySlug(slug);
//        if (! foundArticle.getAuthorId().equals(loginUser.id()))
//            throw new IllegalArgumentException("The author is different from the logged-in user.");
//
//        articleRepository.delete(foundArticle);

//        articleRepository.deleteBySlug(slug);
        return articleRepository.deleteBySlugAndAuthorId(slug, loginUser.id());
    }

    private ArticleResponse getArticleBySlug(final String slug, final Long loginUserId) {
        log.info("[S] getArticleBySlug() : loginUserId={}", loginUserId);
        Object[] objs = (Object[]) articleRepository.findBySlugIncludeUser(slug, loginUserId);
        log.info("[S] getArticleBySlug() : objs={}, size={}", objs, objs.length);
        if (objs.length != 3)
            throw new IllegalArgumentException("The article is not found");

        return ArticleResponse.of(
                (Article)objs[0],
                ProfileResponse.of((RealWorldUser)objs[1], false),
                objs[2] != null);
    }
}
