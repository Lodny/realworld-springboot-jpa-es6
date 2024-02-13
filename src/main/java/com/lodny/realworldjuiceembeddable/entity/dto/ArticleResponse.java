package com.lodny.realworldjuiceembeddable.entity.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lodny.realworldjuiceembeddable.entity.Article;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Set;

@Builder
public record ArticleResponse(
        @JsonIgnore Long id,
        String slug,
        String title,
        String description,
        String body,
        Set<String> tagList,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean favorited,
        Long favoritesCount,
        ProfileResponse author
) {
    public static ArticleResponse of(final Article article, final ProfileResponse author, final Boolean favorited) {
        // todo : BeanUtils.copyProperites
        return ArticleResponse.builder()
                .id(article.getId())
                .slug(article.getSlug())
                .title(article.getTitle())
                .description(article.getDescription())
                .body(article.getBody())
                .tagList(article.getTagList())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .favorited(favorited)
                .author(author)
                .build();
    }
}
