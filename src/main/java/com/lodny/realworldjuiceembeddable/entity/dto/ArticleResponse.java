package com.lodny.realworldjuiceembeddable.entity.dto;

import com.lodny.realworldjuiceembeddable.entity.Article;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Set;

@Builder
public record ArticleResponse(
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
    public static ArticleResponse of(final Article article, final ProfileResponse author) {
        // todo : BeanUtils.copyProperites
        return ArticleResponse.builder()
                .slug(article.getSlug())
                .title(article.getTitle())
                .description(article.getDescription())
                .body(article.getBody())
                .tagList(article.getTagList())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .author(author)
                .build();
    }
}
