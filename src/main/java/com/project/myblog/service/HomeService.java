package com.project.myblog.service;

import com.project.myblog.dao.HomeDao;
import com.project.myblog.entity.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Service("homeService")
public class HomeService {

    @Autowired
    private HomeDao homeDao;

    public void setHomeDao(HomeDao homeDao) {
        this.homeDao = homeDao;
    }

    public List<Post> getPostList() {
        return homeDao.getPostList();
    }
}
