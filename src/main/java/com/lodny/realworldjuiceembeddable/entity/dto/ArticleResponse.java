package com.lodny.realworldjuiceembeddable.entity.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lodny.realworldjuiceembeddable.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleResponse {
    @JsonIgnore
    private Long id;

    private String slug;
    private String title;
    private String description;
    private String body;
    private Set<String> tagList;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean favorited;
    private Long favoritesCount;

    private ProfileResponse author;

    public static ArticleResponse of(final Article article,
                                     final ProfileResponse author,
                                     final Boolean favorited,
                                     final Long favoritesCount) {
        // todo : BeanUtils.copyProperites
        return new ArticleResponse(
                article.getId(),
                article.getSlug(),
                article.getTitle(),
                article.getDescription(),
                article.getBody(),
                article.getTagList(),
                article.getCreatedAt(),
                article.getUpdatedAt(),
                favorited,
                favoritesCount,
                author);
    }

    public void tagListToDto(Object value) {
        this.tagList = Set.of(((String)value).split(","));
//        log.info("tagListToDto() : this.tagList={}", this.tagList);
    }
}
