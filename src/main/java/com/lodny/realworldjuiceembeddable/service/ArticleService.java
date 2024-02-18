package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Article;
import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.*;
import com.lodny.realworldjuiceembeddable.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public ArticleResponse getArticleBySlug(final String slug, final UserResponse loginUser) {
        final Long loginUserId = loginUser == null ? -1 : loginUser.id();
        log.info("[S] getArticleBySlug() : loginUserId={}", loginUserId);

        Object[] obj = (Object[])articleRepository.findBySlugIncludeUser(slug, loginUserId);
        log.info("[S] getArticleBySlug() : obj={}", obj);

        return getArticleResponseByObjs(obj);
    }

    public int deleteArticleBySlug(final String slug, final Long loginUserId) {
//        Article foundArticle = getArticleBySlug(slug);
//        if (! foundArticle.getAuthorId().equals(loginUserId))
//            throw new IllegalArgumentException("The author is different from the logged-in user.");
//
//        articleRepository.delete(foundArticle);

//        articleRepository.deleteBySlug(slug);
        return articleRepository.deleteBySlugAndAuthorId(slug, loginUserId);
    }

    public List<ArticleResponse> getArticles(final ArticleParam articleParam, final UserResponse loginUser) {
        final Long loginUserId = loginUser == null ? -1 : loginUser.id();
        log.info("[S] getArticles() : loginUserId={}", loginUserId);

        int pageSize = articleParam.limit();
        int pageNo = articleParam.offset() / pageSize;
        PageRequest pageRequest = PageRequest.of(pageNo, pageSize);
        Page<Object> objs = articleRepository.getArticles(loginUserId, pageRequest);
        log.info("[S] getArticles() : objs={}", objs);

        return objs.stream()
                .map(obj -> getArticleResponseByObjs((Object[])obj))
                .toList();
    }

    private static ArticleResponse getArticleResponseByObjs(final Object[] objs) {
        log.info("[S] getArticleResponseByObjs() : objs={}, size={}", objs, objs.length);
        if (objs.length != 4)
            throw new IllegalArgumentException("The article is not found");

        return ArticleResponse.of(
                (Article) objs[0],
                ProfileResponse.of((RealWorldUser) objs[1], (Boolean)objs[3]),
                (Boolean) objs[2]);
    }
}
