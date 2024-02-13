package com.lodny.realworldjuiceembeddable.repository;

import com.lodny.realworldjuiceembeddable.entity.Article;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.Repository;

public interface ArticleRepository extends Repository<Article, Long> {
    Article save(Article article);

    Article findBySlug(String slug);

    void deleteBySlugAndAuthorId(String slug, Long authorId);

    @Transactional
    void deleteBySlug(String slug);
}
