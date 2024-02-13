package com.lodny.realworldjuiceembeddable.entity;

import com.lodny.realworldjuiceembeddable.entity.dto.RegisterArticleRequest;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Set;

@ToString
@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String slug;
    private String title;
    private String description;
    private String body;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "article_tag")
    @Column(name = "tag")
    private Set<String> tagList;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public static Article of(final RegisterArticleRequest request) {
        return Article.builder()
                .slug(request.title() + ": slug")
                .title(request.title())
                .description(request.description())
                .body(request.body())
                .tagList(request.tagList())
                .build();
    }
}
