package com.lodny.realworldjuiceembeddable.controller;

import com.lodny.realworldjuiceembeddable.entity.wrapper.WrapTag10Response;
import com.lodny.realworldjuiceembeddable.service.TagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<?> getTop10Tags() {
        log.info("getTop10Tags() : 1={}", 1);

        List<String> top10Tags = tagService.getTop10Tags();
        log.info("getTop10Tags() : top10Tags={}", top10Tags);

        return ResponseEntity.ok(new WrapTag10Response(top10Tags));
    }
}
