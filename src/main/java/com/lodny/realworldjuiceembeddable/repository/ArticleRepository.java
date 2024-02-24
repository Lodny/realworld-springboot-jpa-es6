package com.lodny.realworldjuiceembeddable.repository;

import com.lodny.realworldjuiceembeddable.entity.Article;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface ArticleRepository extends Repository<Article, Long> {
    Article save(final Article article);

    Optional<Article> findBySlug(final String slug);

//    SELECT  NEW com.lodny.realworldjuiceembeddable.entity.dto.Dto01(a, u, fa, fo)
//    FROM    Article a JOIN FETCH a.tagList
    @Query("""
        SELECT  a
              , u
              , CASE WHEN fa IS NULL THEN false ELSE true END
              , CASE WHEN fo IS NULL THEN false ELSE true END
              , (SELECT COUNT(f) FROM Favorite f WHERE f.id.articleId = a.id)
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
              , (SELECT COUNT(f) FROM Favorite f WHERE f.id.articleId = a.id)
        FROM    Article a
        JOIN    RealWorldUser u ON u.id = a.authorId
        LEFT JOIN Favorite fa ON fa.id.articleId = a.id AND fa.id.userId = :loginUserId
        LEFT JOIN Follow fo ON fo.id.followeeId = a.authorId AND fo.id.followerId = :loginUserId
        ORDER BY a.createdAt DESC
    """)
    Page<Object> getArticles(final Long loginUserId, final Pageable pageable);

    @Query("""
        SELECT  a
              , u
              , CASE WHEN fa IS NULL THEN false ELSE true END
              , CASE WHEN fo IS NULL THEN false ELSE true END
              , (SELECT COUNT(f) FROM Favorite f WHERE f.id.articleId = a.id)
        FROM    Article a
        JOIN    RealWorldUser u ON u.id = a.authorId
        LEFT JOIN Favorite fa ON fa.id.articleId = a.id AND fa.id.userId = :loginUserId
        LEFT JOIN Follow fo ON fo.id.followeeId = a.authorId AND fo.id.followerId = :loginUserId
        WHERE   :tag MEMBER Of a.tagList
        ORDER BY a.createdAt DESC
    """)
    Page<Object> getArticlesByTag(String tag, Long loginUserId, PageRequest pageRequest);

    @Query("""
        SELECT  a
              , u
              , CASE WHEN fa IS NULL THEN false ELSE true END
              , CASE WHEN fo IS NULL THEN false ELSE true END
              , (SELECT COUNT(f) FROM Favorite f WHERE f.id.articleId = a.id)
        FROM    Article a
        JOIN    RealWorldUser u ON u.id = a.authorId
        LEFT JOIN Favorite fa ON fa.id.articleId = a.id AND fa.id.userId = :loginUserId
        LEFT JOIN Follow fo ON fo.id.followeeId = a.authorId AND fo.id.followerId = :loginUserId
        WHERE   a.authorId = (SELECT u.id FROM RealWorldUser u WHERE u.username = :author)
        ORDER BY a.createdAt DESC
    """)
    Page<Object> getArticlesByAuthor(String author, Long loginUserId, PageRequest pageRequest);

    @Query("""
        SELECT  a
              , u
              , CASE WHEN fa IS NULL THEN false ELSE true END
              , CASE WHEN fo IS NULL THEN false ELSE true END
              , (SELECT COUNT(f) FROM Favorite f WHERE f.id.articleId = a.id)
        FROM    Article a
        JOIN    RealWorldUser u ON u.id = a.authorId
        JOIN    Favorite fTmp ON fTmp.id.articleId = a.id
        LEFT JOIN Favorite fa ON fa.id.articleId = a.id AND fa.id.userId = :loginUserId
        LEFT JOIN Follow fo ON fo.id.followeeId = a.authorId AND fo.id.followerId = :loginUserId
        WHERE   fTmp.id.userId = (SELECT u.id FROM RealWorldUser u WHERE u.username = :favorited)
        ORDER BY a.createdAt DESC
    """)
    Page<Object> getArticlesByFavorited(String favorited, Long loginUserId, PageRequest pageRequest);
}
