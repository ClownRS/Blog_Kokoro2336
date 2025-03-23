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

    public Post getPostById(int id) {
        return jdbcTemplate.query("select * from posts where id=?", new Object[]{id}, new BeanPropertyRowMapper<>(Post.class)).get(0);
    }

    public Boolean addPost(Post post) {
        try {
            jdbcTemplate.update("insert into posts (title, summary, isFeatured, content) values (?,?,?,?)",
                    new Object[]{post.getTitle(), post.getSummary(), post.getFeatured(), post.getContent()});
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public Boolean updatePost(Post post) {
        try {
            jdbcTemplate.update("update posts set title = ?, summary = ? ,isFeatured = ?, content = ?",
                    new Object[]{post.getTitle(), post.getSummary(), post.getFeatured(), post.getContent()});
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
