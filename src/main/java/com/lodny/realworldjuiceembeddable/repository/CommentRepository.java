package com.lodny.realworldjuiceembeddable.repository;

import com.lodny.realworldjuiceembeddable.entity.Comment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface CommentRepository extends Repository<Comment, Long> {
    Comment save(Comment comment);
    Comment findById(Long commentId);

    // todo::delete one query
    void delete(Comment foundComment);

    @Query("""
        SELECT  c
              , u
              , CASE WHEN f IS NULL THEN false ELSE true END
        FROM    Comment c
        JOIN    Article a ON a.id = c.articleId
        JOIN    RealWorldUser u ON u.id = c.authorId
        LEFT JOIN Follow f ON f.id.followeeId = c.authorId AND f.id.followerId = :loginUserId
        WHERE   a.slug = :slug
    """)
    List<Object> findByArticleIdIncludeUser(String slug, Long loginUserId);
}
