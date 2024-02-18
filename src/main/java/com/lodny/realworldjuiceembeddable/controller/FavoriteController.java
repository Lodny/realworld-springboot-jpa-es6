package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.dto.ArticleResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapArticleResponse;
import com.lodny.realworldjuiceembeddable.service.FavoriteService;
import com.lodny.realworldjuiceembeddable.sys.annotation.JwtTokenRequired;
import com.lodny.realworldjuiceembeddable.sys.annotation.LoginUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles/{slug}")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @JwtTokenRequired
    @PostMapping("/favorite")
    public ResponseEntity<?> favorite(@PathVariable final String slug,
                                         @LoginUser final UserResponse loginUser) {
        log.info("[C] favorite() : slug={}", slug);
        log.info("[C] favorite() : loginUser={}", loginUser);

        ArticleResponse articleResponse = favoriteService.favorite(slug, loginUser.id());
        log.info("[C] favorite() : articleResponse={}", articleResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapArticleResponse(articleResponse));
    }

    @JwtTokenRequired
    @DeleteMapping("/favorite")
    public ResponseEntity<?> unfavorite(@PathVariable final String slug,
                                         @LoginUser final UserResponse loginUser) {
        log.info("[C] unfavorite() : slug={}", slug);
        log.info("[C] unfavorite() : loginUser={}", loginUser);

        ArticleResponse articleResponse = favoriteService.unfavorite(slug, loginUser.id());
        log.info("[C] unfavorite() : articleResponse={}", articleResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapArticleResponse(articleResponse));
    }

}
