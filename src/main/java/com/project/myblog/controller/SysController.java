package com.project.myblog.controller;

import com.project.myblog.entity.Post;
import com.project.myblog.service.PostsService;
import com.project.myblog.service.SysService;
import com.project.myblog.utils.JSON;
import com.project.myblog.utils.JWT;
import com.project.myblog.utils.Reader;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@Controller
@RequestMapping("/sys")
@CrossOrigin(value = "*", allowedHeaders = {"Authorization", "Content-Type"}) //处理跨域请求时，必须保证Authorization为允许的头。
public class SysController {
    @Autowired
    private SysService sysService;

    @Autowired
    private PostsService postsService;

    public PostsService getPostsService() {
        return postsService;
    }

    public void setPostsService(PostsService postsService) {
        this.postsService = postsService;
    }

    public SysService getSysService() {
        return sysService;
    }

    public void setSysService(SysService sysService) {
        this.sysService = sysService;
    }

    private class RawPost {
        public Integer id;
        public Boolean isFeatured;
        public String summary;
        public MultipartFile file;

    }

    @PostMapping("/upload")
    @ResponseBody
    public String upload(Integer id,String title, Boolean isFeatured, String summary, @RequestParam(value = "file", required = true) MultipartFile file) {
        //read content from multipart file
        String content = null;
        try {
            content = Reader.readTextFromMultipartFile(file);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Post post = new Post(id, title, summary, isFeatured, content);
        String uploadType = null;
        Boolean isSuccess = null;
        if (postsService.existsPost(id)) {
            uploadType = "update";
            isSuccess = postsService.updatePost(post);
        } else {
            uploadType = "add";
            isSuccess = postsService.addPost(post);
        }

        return JSON.uploadStateToJSON(uploadType, isSuccess);
    }

    /**
     *负责refresh Token未过期的情况下重新生成access Token.
     * @return 新的access token*/
    @ResponseBody
    @RequestMapping("/genAccessToken")
    public String genAccessToken(HttpServletRequest request) {
        String refreshToken = (String) request.getAttribute("refreshToken");
        String username = JWT.getUsernameInJWT(refreshToken);

        String accessToken = sysService.genAccessToken(username);

        return JSON.tokensToJSON(accessToken, refreshToken);
    }

    /**
     * 在sys页面加载postList.
     */
    @ResponseBody
    @RequestMapping("/load")
    public List<Post> load() {
        return postsService.getFullPostList();
    }
}
