package com.lodny.realworldjuiceembeddable.entity.dto;

public record ArticleParam(Integer offset, Integer limit) {
    public ArticleParam {
        if (offset == null) offset = 0;
        if (limit == null) limit = 20;
    }
}
