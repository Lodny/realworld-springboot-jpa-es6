package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Article;
import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.ArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.ProfileResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterArticleRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.mapper.ArticleMapper;
import com.lodny.realworldjuiceembeddable.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

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

//        Object[] objects = (Object[])articleRepository.findBySlugIncludeUser(slug, loginUserId);
//        log.info("getArticleBySlug() : objects={}", objects);
//        return ArticleResponse.of(objects);

        Map<String, Object> map = articleMapper.selectArticleBySlug(slug, loginUserId);
        log.info("[S] getArticleBySlug() : map={}", map);

        return ArticleResponse.of(map);
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

    public Page<ArticleResponse> getArticles(final PageRequest pageRequest, final Long loginUserId) {
        Page<Object> objs = articleRepository.getArticles(loginUserId, pageRequest);
        log.info("[S] getArticles() : objs={}", objs);

        return getArticleResponses(objs);
    }

    public Page<ArticleResponse> getArticlesByTag(final String tag,
                                                  final Long loginUserId,
                                                  final PageRequest pageRequest) {
        Page<Object> objs = articleRepository.getArticlesByTag(tag, loginUserId, pageRequest);
        log.info("[S] getArticlesByTag() : objs={}", objs);

        return getArticleResponses(objs);
    }

    public Page<ArticleResponse> getArticlesByAuthor(final String author,
                                                     final Long loginUserId,
                                                     final PageRequest pageRequest) {
        Page<Object> objs = articleRepository.getArticlesByAuthor(author, loginUserId, pageRequest);
        log.info("[S] getArticlesByTag() : objs={}", objs);

        return getArticleResponses(objs);
    }

    public Page<ArticleResponse> getFeedArticles(final Long loginUserId, final PageRequest pageRequest) {
        Page<Object> objs = articleRepository.getFeedArticles(loginUserId, pageRequest);
        log.info("[S] getFeedArticles() : objs={}", objs);

        return getArticleResponses(objs);
    }

    public Page<ArticleResponse> getArticlesByFavorited(final String favorited, final Long loginUserId, final PageRequest pageRequest) {
        Page<Object> objs = articleRepository.getArticlesByFavorited(favorited, loginUserId, pageRequest);
        log.info("[S] getArticlesByFavorited() : objs={}", objs);

        return getArticleResponses(objs);
    }

    private Page<ArticleResponse> getArticleResponses(final Page<Object> objs) {
        List<ArticleResponse> articleResponses = objs.stream()
                .map(obj -> ArticleResponse.of((Object[]) obj))
                .toList();

        log.info("[S] getArticleResponses() : articleResponses={}", articleResponses);

        return new PageImpl<>(articleResponses, objs.getPageable(), objs.getTotalElements());
    }
}
