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
    public String upload(@RequestBody Post post) {
        String uploadType = null;
        Boolean isSuccess = null;
        String message = null;
        if (validId(post.getId())) {
            uploadType = "update";
            if (postsService.existsPostByTitle(post.getTitle())) {
                uploadType = "update";
                isSuccess = false;
                message = "There is already a post with this title!";
            } else {
                isSuccess = postsService.updatePost(post);
                if (isSuccess) {
                    message = "Upload successful!";
                } else {
                    message = "Upload failed!";
                }
            }
        } else if (postsService.existsPostByTitle(post.getTitle())) {
            uploadType = "update";
            isSuccess = false;
            message = "There is already a post with this title!";
        } else {
            uploadType = "add";
            isSuccess = postsService.addPost(post);
            if (isSuccess) {
                message = "Add successful!";
            } else {
                message = "Add failed!";
            }
        }

        return JSON.uploadStateToJSON(uploadType, isSuccess, message);
    }

    private Boolean validId(Integer id) {
        return !(id == null || id == 0 || !postsService.existsPost(id));
    }

    @PostMapping("/delete/{id}")
    @ResponseBody
    public String delete(@PathVariable(value = "id") Integer id) {
        String message = null;
        Boolean isSuccess = null;
        if (id != null && id != 0 && postsService.existsPost(id)) {
            isSuccess = postsService.deletePostById(id);
            if (isSuccess) {
                message = "Delete Success!";
            } else {
                message = "Delete Failed!";
            }
        } else {
            isSuccess = false;
            message = "Post Not Found!";
        }

        return JSON.deleteStateToJSON(isSuccess, message);
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

    @RequestMapping("/get/{id}")
    @ResponseBody
    public Post getPostById(@PathVariable(value = "id") Integer id) {
        return postsService.getPostById(id);
    }

}
