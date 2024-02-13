package com.lodny.realworldjuiceembeddable.repository;

import com.lodny.realworldjuiceembeddable.entity.Article;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

public interface ArticleRepository extends Repository<Article, Long> {
    Article save(final Article article);

    Article findBySlug(final String slug);

    @Query("""
        select  a, u, f
        from    Article a
        join    RealWorldUser u on u.id = a.authorId
        left join Favorite f on f.id.articleId = a.id and f.id.userId = :loginUserId
        where   a.slug = :slug
    """)
    Object findBySlugIncludeUser(final String slug, final Long loginUserId);

    @Transactional
    int deleteBySlugAndAuthorId(final String slug, final Long authorId);

    @Transactional
    void deleteBySlug(final String slug);
}
