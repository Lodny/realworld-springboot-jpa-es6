package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.dto.CommentResponse;
import com.lodny.realworldjuiceembeddable.entity.dto.RegisterCommentRequest;
import com.lodny.realworldjuiceembeddable.entity.dto.UserResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapCommentResponse;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapCommentResponses;
import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapRegisterCommentRequest;
import com.lodny.realworldjuiceembeddable.service.CommentService;
import com.lodny.realworldjuiceembeddable.sys.annotation.JwtTokenRequired;
import com.lodny.realworldjuiceembeddable.sys.annotation.LoginUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles/{slug}")
public class CommentController {
    private final CommentService commentService;

    @JwtTokenRequired
    @PostMapping("/comments")
    public ResponseEntity<?> registerComment(@PathVariable final String slug,
                                             @RequestBody final WrapRegisterCommentRequest wrapRegisterCommentRequest,
                                             @LoginUser final UserResponse loginUser) {
        RegisterCommentRequest registerCommentRequest = wrapRegisterCommentRequest.comment();
        log.info("[C] registerComment() : registerCommentRequest={}", registerCommentRequest);
        log.info("[C] registerComment() : loginUser={}", loginUser);

        CommentResponse commentResponse = commentService.registerComment(slug, registerCommentRequest, loginUser);
        log.info("[C] registerComment() : commentResponse={}", commentResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapCommentResponse(commentResponse));
    }

    @GetMapping("/comments")
    public ResponseEntity<?> getComments(@PathVariable final String slug, @LoginUser final UserResponse loginUser) {
        log.info("[C] getComments() : slug={}", slug);
        log.info("[C] getComments() : loginUser={}", loginUser);

        List<CommentResponse> comments = commentService.getComments(slug, loginUser);
        log.info("[C] getComments() : comments={}", comments);

        return ResponseEntity.ok(new WrapCommentResponses(comments));
    }

    @JwtTokenRequired
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable final String slug,
                              @PathVariable final Long id,
                              @LoginUser final UserResponse loginUser) {
        log.info("[C] deleteComment() : slug={}", slug);
        log.info("[C] deleteComment() : comment id={}", id);
        log.info("[C] deleteComment() : loginUser={}", loginUser);

        final Integer count = commentService.deleteComment(slug, id, loginUser.id());
        log.info("[C] deleteComment() : count={}", count);

        return ResponseEntity.ok(count);
    }
}
