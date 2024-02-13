package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.dto.ArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterArticleRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapRegisterArticleRequest;
import com.lodny.realworldjuiceembeddable.service.ArticleService;
import com.lodny.realworldjuiceembeddable.sys.annotation.JwtTokenRequired;
import com.lodny.realworldjuiceembeddable.sys.annotation.LoginUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
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

        ArticleResponse articleResponse = articleService.getArticleBySlug(slug, loginUser == null ? null : loginUser.user());
        log.info("[C] getArticleBySlug() : articleResponse={}", articleResponse);

        return ResponseEntity.ok(new WrapArticleResponse(articleResponse));
    }

    @JwtTokenRequired
    @DeleteMapping("/{slug}")
    public ResponseEntity<?> deleteArticleBySlug(@PathVariable final String slug, @LoginUser final UserResponse loginUser) {
        log.info("[C] deleteArticleBySlug() : slug={}", slug);
        log.info("[C] deleteArticleBySlug() : loginUser={}", loginUser);

        int count = articleService.deleteArticleBySlug(slug, loginUser);
        log.info("[C] deleteArticleBySlug() : count={}", count);

        return ResponseEntity.ok(count);
    }
}
