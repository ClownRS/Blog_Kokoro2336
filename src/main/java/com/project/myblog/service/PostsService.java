package com.project.myblog.service;

import com.project.myblog.dao.PostsDao;
import com.project.myblog.entity.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Service
public class PostsService {
    @Autowired
    private PostsDao postsDao;

    public PostsDao getPostsDao() {
        return postsDao;
    }

    public void setPostsDao(PostsDao postsDao) {
        this.postsDao = postsDao;
    }

    public List<Post> getFullPostList() {
        return postsDao.getFullPostList();
    }

    public String getPostContentById(int id) {
        Post post =  postsDao.getPostById(id);
        return post.getContent();
    }

    public Post getPostById(int id) {
        return postsDao.getPostById(id);
    }

    public boolean existsPost(Integer id) {
        return id != null && postsDao.getPostById(id) != null;
    }

    public Boolean updatePost(Post post) {
        return postsDao.updatePost(post);
    }

    public Boolean addPost(Post post) {
        return postsDao.addPost(post);
    }

    public Boolean deletePostById(int id) {
        return postsDao.deletePostById(id);
    }
}
