package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.dto.ArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterArticleRequest;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapRegisterArticleRequest;
import com.lodny.realworldjuiceembeddable.service.ArticleService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping
    public ResponseEntity<?> registerArticle(@RequestBody final WrapRegisterArticleRequest wrapRegisterArticleRequest) {
        RegisterArticleRequest registerArticleRequest = wrapRegisterArticleRequest.article();
        log.info("[C] registerArticle() : registerArticleRequest={}", registerArticleRequest);

        ArticleResponse articleResponse = articleService.registerArticle(registerArticleRequest);
        log.info("[C] registerArticle() : articleResponse={}", articleResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapArticleResponse(articleResponse));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getArticleBySlug(@PathVariable final String slug) {
        log.info("[C] getArticleBySlug() : slug={}", slug);

        ArticleResponse articleResponse = articleService.getArticleBySlug(slug);
        log.info("[C] getArticleBySlug() : articleResponse={}", articleResponse);

        return ResponseEntity.ok(new WrapArticleResponse(articleResponse));
    }
}
