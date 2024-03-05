package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.dto.ArticleParam;
import com.lodny.realworldjuiceembeddable.entity.dto.ArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterArticleRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapArticleResponses;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapRegisterArticleRequest;
import com.lodny.realworldjuiceembeddable.service.ArticleService;
import com.lodny.realworldjuiceembeddable.sys.annotation.JwtTokenRequired;
import com.lodny.realworldjuiceembeddable.sys.annotation.LoginUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    @JwtTokenRequired
    @PostMapping
    public ResponseEntity<?> registerArticle(@RequestBody final WrapRegisterArticleRequest wrapRegisterArticleRequest,
                                             @LoginUser final UserResponse loginUser) {
        RegisterArticleRequest registerArticleRequest = wrapRegisterArticleRequest.article();
        log.info("[C] registerArticle() : registerArticleRequest={}", registerArticleRequest);
        log.info("[C] registerArticle() : loginUser={}", loginUser);

        ArticleResponse articleResponse = articleService.registerArticle(registerArticleRequest, loginUser.user());
        log.info("[C] registerArticle() : articleResponse={}", articleResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapArticleResponse(articleResponse));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getArticleBySlug(@PathVariable final String slug,
                                              @LoginUser final UserResponse loginUser) {
        log.info("[C] getArticleBySlug() : slug={}", slug);
        log.info("[C] getArticleBySlug() : loginUser={}", loginUser);

        ArticleResponse articleResponse = articleService.getArticleBySlug(slug, loginUser);
        log.info("[C] getArticleBySlug() : articleResponse={}", articleResponse);

        return ResponseEntity.ok(new WrapArticleResponse(articleResponse));
    }

    @JwtTokenRequired
    @GetMapping("/feed")
    public ResponseEntity<?> getFeedArticle(@ModelAttribute final ArticleParam articleParam,
                                            @LoginUser final UserResponse loginUser) {
        log.info("getFeedArticle() : articleParam={}", articleParam);
        log.info("[C] getFeedArticle() : loginUser={}", loginUser);

        PageRequest pageRequest = getPageRequest(articleParam);
        log.info("[C] getFeedArticle() : pageRequest={}", pageRequest);

        final Page<ArticleResponse> pageArticles = articleService.getFeedArticles(loginUser.id(), pageRequest);
        log.info("[C] getFeedArticle() : pageArticles={}", pageArticles);

        return ResponseEntity.ok(new WrapArticleResponses(pageArticles));
    }

    @GetMapping
    public ResponseEntity<?> getArticles(@ModelAttribute final ArticleParam articleParam,
                                         @LoginUser final UserResponse loginUser) {
        log.info("[C] getArticles() : articleParam={}", articleParam);
        log.info("[C] getArticles() : loginUser={}", loginUser);

        PageRequest pageRequest = getPageRequest(articleParam);
        log.info("[C] getArticles() : pageRequest={}", pageRequest);

        final Long loginUserId = loginUser == null ? -1 : loginUser.id();
        log.info("[C] getArticles() : loginUserId={}", loginUserId);

        log.info("[C] getArticles() : articleParam.type()={}", articleParam.type());


        final Page<ArticleResponse> pageArticles =
                switch (articleParam.type()) {
                    case "tag"       -> articleService.getArticlesByTag(articleParam.tag(), loginUserId, pageRequest);
                    case "author"    -> articleService.getArticlesByAuthor(articleParam.author(), loginUserId, pageRequest);
                    case "favorited" -> articleService.getArticlesByFavorited(articleParam.favorited(), loginUserId, pageRequest);
                    default          -> articleService.getArticles(pageRequest, loginUserId);
                };
        log.info("[C] getArticles() : pageArticles={}", pageArticles);

        return ResponseEntity.ok(new WrapArticleResponses(pageArticles));
    }

    private static PageRequest getPageRequest(final ArticleParam articleParam) {
        int pageSize = articleParam.limit();
        int pageNo = articleParam.offset() / pageSize;

        return PageRequest.of(pageNo, pageSize);
    }

    @JwtTokenRequired
    @DeleteMapping("/{slug}")
    public ResponseEntity<?> deleteArticleBySlug(@PathVariable final String slug, @LoginUser final UserResponse loginUser) {
        log.info("[C] deleteArticleBySlug() : slug={}", slug);
        log.info("[C] deleteArticleBySlug() : loginUser={}", loginUser);

        int count = articleService.deleteArticleBySlug(slug, loginUser.id());
        log.info("[C] deleteArticleBySlug() : count={}", count);

        return ResponseEntity.ok(count);
    }
}
