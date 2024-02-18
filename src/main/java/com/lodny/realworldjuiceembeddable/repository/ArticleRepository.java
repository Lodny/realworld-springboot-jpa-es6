package com.lodny.realworldjuiceembeddable.repository;

import com.lodny.realworldjuiceembeddable.entity.Article;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

public interface ArticleRepository extends Repository<Article, Long> {
    Article save(final Article article);

    Article findBySlug(final String slug);

    @Query("""
        SELECT  a
              , u
              , CASE WHEN fa IS NULL THEN false ELSE true END
              , CASE WHEN fo IS NULL THEN false ELSE true END
        FROM    Article a
        JOIN    RealWorldUser u ON u.id = a.authorId
        LEFT JOIN Favorite fa ON fa.id.articleId = a.id AND fa.id.userId = :loginUserId
        LEFT JOIN Follow fo ON fo.id.followeeId = a.authorId AND fo.id.followerId = :loginUserId
        WHERE   a.slug = :slug
    """)
    Object findBySlugIncludeUser(final String slug, final Long loginUserId);

    @Transactional
    int deleteBySlugAndAuthorId(final String slug, final Long authorId);

    @Transactional
    void deleteBySlug(final String slug);

    @Query("""
        SELECT  a
              , u
              , CASE WHEN fa IS NULL THEN false ELSE true END
              , CASE WHEN fo IS NULL THEN false ELSE true END
        FROM    Article a
        JOIN    RealWorldUser u ON u.id = a.authorId
        LEFT JOIN Favorite fa ON fa.id.articleId = a.id AND fa.id.userId = :loginUserId
        LEFT JOIN Follow fo ON fo.id.followeeId = a.authorId AND fo.id.followerId = :loginUserId
        ORDER BY a.createdAt DESC
    """)
    Page<Object> getArticles(final Long loginUserId, final Pageable pageable);
}
