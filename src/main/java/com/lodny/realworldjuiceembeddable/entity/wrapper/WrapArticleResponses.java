package com.lodny.realworldjuiceembeddable.entity.wrapper;

import com.lodny.realworldjuiceembeddable.entity.dto.ArticleResponse;

import java.util.List;

public record WrapArticleResponses(List<ArticleResponse> articles, int articlesCount) { }
