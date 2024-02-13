package com.lodny.realworldjuiceembeddable.repository;

import com.lodny.realworldjuiceembeddable.entity.Article;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

public interface ArticleRepository extends Repository<Article, Long> {
    Article save(Article article);

    @Query("""
        select  a, u
        from    Article a
        join    RealWorldUser u on u.id = a.authorId
        where   a.slug = :slug
    """)
    Object findBySlug(String slug);

    @Transactional
    int deleteBySlugAndAuthorId(String slug, Long authorId);

    @Transactional
    void deleteBySlug(String slug);
}
