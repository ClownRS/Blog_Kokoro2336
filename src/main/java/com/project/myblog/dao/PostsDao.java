package com.project.myblog.dao;

import com.project.myblog.entity.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PostsDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Post> getFullPostList() {
        return jdbcTemplate.query("SELECT id, title, postDate, lastModified, isFeatured, summary FROM posts",
                new BeanPropertyRowMapper<Post>(Post.class));
    }

    public String getPostContentById(int id) {
        return jdbcTemplate.queryForObject("SELECT content FROM posts WHERE id = ?", new Object[]{id}, String.class);
    }
}
