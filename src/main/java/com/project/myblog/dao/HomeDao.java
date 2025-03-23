package com.project.myblog.dao;

import com.project.myblog.entity.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("homeDao")
public class HomeDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Post> getFeaturedPostList() {
        return jdbcTemplate.query("SELECT * FROM posts WHERE isFeatured = TRUE", new BeanPropertyRowMapper<>(Post.class));
    }
}
