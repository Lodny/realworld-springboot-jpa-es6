package com.lodny.realworldjuiceembeddable.entity.wrapper;

import com.lodny.realworldjuiceembeddable.entity.dto.CommentResponse;

import java.util.List;

public record WrapCommentResponses(List<CommentResponse> comments) { }
