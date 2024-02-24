package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Article;
import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.*;
import com.lodny.realworldjuiceembeddable.mapper.ArticleMapper;
import com.lodny.realworldjuiceembeddable.repository.ArticleRepository;
import com.lodny.realworldjuiceembeddable.sys.util.MapToDto.MapToDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final ArticleMapper articleMapper;

    public ArticleResponse registerArticle(final RegisterArticleRequest registerArticleRequest,
                                           final RealWorldUser loginUser) {
        Article article = Article.of(registerArticleRequest, loginUser.getId());
        log.info("[S] registerArticle() : article={}", article);

        Article savedArticle = articleRepository.save(article);
        log.info("[S] registerArticle() : savedArticle={}", savedArticle);

        return ArticleResponse.of(
                savedArticle,
                ProfileResponse.of(loginUser, false),
                false,
                0L);
    }

    public ArticleResponse getArticleBySlug(final String slug, final UserResponse loginUser) {
        final Long loginUserId = loginUser == null ? -1 : loginUser.id();
        log.info("[S] getArticleBySlug() : loginUserId={}", loginUserId);

//        Object[] articleAndOther = articleRepository.findBySlugIncludeUser(slug, loginUserId);
//        log.info("getArticleBySlug() : articleAndOther={}", articleAndOther);
//        return getArticleResponseByObjs(articleAndOther);

        Map<String, Object> map = articleMapper.selectArticleBySlug(slug, loginUserId);
        log.info("[S] getArticleBySlug() : map={}", map);

        return MapToDto.convert(map, ArticleResponse.class);
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

    public List<ArticleResponse> getArticles(final PageRequest pageRequest, final Long loginUserId) {
        Page<Object> objs = articleRepository.getArticles(loginUserId, pageRequest);
        log.info("[S] getArticles() : objs={}", objs);

        return getArticleResponses(objs);
    }

    public List<ArticleResponse> getArticlesByTag(final String tag,
                                                  final Long loginUserId,
                                                  final PageRequest pageRequest) {
        Page<Object> objs = articleRepository.getArticlesByTag(tag, loginUserId, pageRequest);
        log.info("[S] getArticlesByTag() : objs={}", objs);

        return getArticleResponses(objs);
    }

    public List<ArticleResponse> getArticlesByAuthor(final String author,
                                                     final Long loginUserId,
                                                     final PageRequest pageRequest) {
        Page<Object> objs = articleRepository.getArticlesByAuthor(author, loginUserId, pageRequest);
        log.info("[S] getArticlesByTag() : objs={}", objs);

        return getArticleResponses(objs);
    }

    public List<ArticleResponse> getArticlesByFavorited(final String favorited, final Long loginUserId, final PageRequest pageRequest) {
        Page<Object> objs = articleRepository.getArticlesByFavorited(favorited, loginUserId, pageRequest);
        log.info("[S] getArticlesByFavorited() : objs={}", objs);

        return getArticleResponses(objs);
    }

    private List<ArticleResponse> getArticleResponses(final Page<Object> objs) {
        return objs.stream()
                .map(obj -> getArticleResponseByObjs((Object[]) obj))
                .toList();
    }

    private ArticleResponse getArticleResponseByObjs(final Object[] articleAndOther) {
        final int ARRAY_COUNT = 5;

        if (articleAndOther.length == 0)
            throw new IllegalArgumentException("The article is not found");

        final Object[] articleObjects = (Object[])articleAndOther[0];
        log.info("[S] getArticleResponseByObjs() : articleObjects.length={}", articleObjects.length);
        log.info("[S] getArticleResponseByObjs() : articleObjects={}", articleObjects);
        if (articleObjects.length < ARRAY_COUNT || articleObjects[0] == null)
            throw new IllegalArgumentException("The article is not found 2");

        return ArticleResponse.of(
                (Article) articleObjects[0],
                ProfileResponse.of((RealWorldUser) articleObjects[1], (Boolean)articleObjects[3]),
                (Boolean) articleObjects[2],
                (Long) articleObjects[4]);
    }
}
