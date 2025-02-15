package com.project.myblog.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.myblog.entity.Post;
import com.project.myblog.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/home")
@CrossOrigin(origins = "*")
public class HomeController {

    @Autowired
    private HomeService homeService;

    public void setHomeService(HomeService homeService) {
        this.homeService = homeService;
    }

    /**
     * 在页面跳转时负责返回post列表*/
    @RequestMapping("/jump")
    public List<Post> getPostList() throws IOException {
        return homeService.getPostList();
    }

}
