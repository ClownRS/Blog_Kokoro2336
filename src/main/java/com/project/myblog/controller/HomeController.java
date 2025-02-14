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

    @RequestMapping("/jump")
    public String jump() {
        System.out.println("giao");
        List<Post> postList = homeService.getPostList();

        //转为json格式
        String postListJSON = null;
        ObjectMapper mapper = new ObjectMapper();
        try {
            postListJSON = mapper.writeValueAsString(postList);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return postListJSON;
    }

}
