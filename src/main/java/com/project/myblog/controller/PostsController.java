package com.project.myblog.controller;

import com.project.myblog.entity.Post;
import com.project.myblog.service.PostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostsController {

    @Autowired
    private PostsService postsService;

    public PostsService getPostsService() {
        return postsService;
    }

    public void setPostsService(PostsService postsService) {
        this.postsService = postsService;
    }

    @RequestMapping("/load")
    public List<Post> getFullPostList() {
        return postsService.getFullPostList();
    }

    @RequestMapping("/read/{id}")
    public String getPostContentById(@PathVariable(value = "id") int id) {
        return postsService.getPostContentById(id);
    }
}
