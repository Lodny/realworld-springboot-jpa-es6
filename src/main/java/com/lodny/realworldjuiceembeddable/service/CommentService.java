package com.lodny.realworldjuiceembeddable.service;

import com.lodny.realworldjuiceembeddable.entity.Article;
import com.lodny.realworldjuiceembeddable.entity.Comment;
import com.lodny.realworldjuiceembeddable.entity.RealWorldUser;
import com.lodny.realworldjuiceembeddable.entity.dto.*;
import com.lodny.realworldjuiceembeddable.repository.ArticleRepository;
import com.lodny.realworldjuiceembeddable.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;

    public CommentResponse registerComment(final String slug,
                                           final RegisterCommentRequest registerCommentRequest,
                                           final UserResponse loginUser) {
        Object[] articleAndOther = (Object[])articleRepository.findBySlugIncludeUser(slug, loginUser.id());
        ArticleResponse articleResponse = getArticleResponseByObjs(articleAndOther);
        log.info("registerComment() : articleResponse={}", articleResponse);

        Comment comment = Comment.of(registerCommentRequest, articleResponse.id(), loginUser.id());
        log.info("registerComment() : comment={}", comment);
        Comment savedComment = commentRepository.save(comment);
        log.info("registerComment() : savedComment={}", savedComment);

        return CommentResponse.of(savedComment, articleResponse.author());
    }

    public void deleteComment(final String slug, final Long commentId, final Long loginUserId) {
        log.info("[S] deleteComment() : loginUserId={}", loginUserId);

        Article article = articleRepository.findBySlug(slug);
        if (article == null)
            throw new IllegalArgumentException("article not found");
        log.info("[S] deleteComment() : article={}", article);

        Comment foundComment = commentRepository.findById(commentId);
        if (foundComment == null)
            throw new IllegalArgumentException("comment not found");
        log.info("[S] deleteComment() : foundComment={}", foundComment);

        if (! foundComment.getArticleId().equals(article.getId()))
            throw new IllegalArgumentException("The comment article id does not match slug-based article id.");

        if (! foundComment.getAuthorId().equals(loginUserId))
            throw new IllegalArgumentException("Author Id of Slug-based article does not match the login user id.");

        commentRepository.delete(foundComment);
    }

    public List<CommentResponse> getComments(final String slug, final UserResponse loginUser) {
        List<Object> commentAndOther = commentRepository.findByArticleIdIncludeUser(slug, loginUser == null ? -1 : loginUser.id());
        log.info("[S] getComments() : commentAndOther.size()={}", commentAndOther.size());

        return commentAndOther.stream().map(obj -> {
            Object[] objs = (Object[]) obj;
            if (objs.length < 3)
                throw new IllegalArgumentException("objs size is wrong");

            Comment comment = (Comment) objs[0];
            RealWorldUser user = (RealWorldUser) objs[1];
            return CommentResponse.of(comment, ProfileResponse.of(user, (Boolean)objs[2]));
        }).toList();
    }

    private ArticleResponse getArticleResponseByObjs(final Object[] articleAndOther) {
        log.info("[S] getArticleResponseByObjs() : articleAndOther.length={}", articleAndOther.length);
        log.info("[S] getArticleResponseByObjs() : articleAndOther={}", articleAndOther);
        if (articleAndOther.length < 4 || articleAndOther[0] == null)
            throw new IllegalArgumentException("The article is not found");

        return ArticleResponse.of(
                (Article) articleAndOther[0],
                ProfileResponse.of((RealWorldUser) articleAndOther[1], (Boolean)articleAndOther[3]),
                (Boolean) articleAndOther[2]);
    }
}
