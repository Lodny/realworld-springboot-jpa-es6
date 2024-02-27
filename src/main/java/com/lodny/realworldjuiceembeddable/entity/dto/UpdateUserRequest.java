package com.lodny.realworldjuiceembeddable.entity.dto;

public record UpdateUserRequest(String username, String email, String password, String image, String bio) { }
