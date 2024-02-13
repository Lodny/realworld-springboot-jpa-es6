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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles/{slug}")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @JwtTokenRequired
    @PostMapping("/favorite")
    public ResponseEntity<?> addFavorite(@PathVariable final String slug,
                                         @LoginUser final UserResponse loginUser) {
        log.info("[C] addFavorite() : slug={}", slug);
        log.info("[C] addFavorite() : loginUser={}", loginUser);

        ArticleResponse articleResponse = favoriteService.addFavorite(slug, loginUser.id());
        log.info("[C] addFavorite() : articleResponse={}", articleResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapArticleResponse(articleResponse));
    }

}
