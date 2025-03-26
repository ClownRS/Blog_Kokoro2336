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
        return jdbcTemplate.query("SELECT id, title, postDate, lastModified, featured, summary FROM posts",
                new BeanPropertyRowMapper<Post>(Post.class));
    }

    public Post getPostById(int id) {
        return jdbcTemplate.query("select * from posts where id=?", new Object[]{id}, new BeanPropertyRowMapper<>(Post.class)).get(0);
    }

    public Boolean addPost(Post post) {
        try {
            jdbcTemplate.update("insert into posts (title, summary, featured, content) values (?,?,?,?)",
                    new Object[]{post.getTitle(), post.getSummary(), post.getFeatured(), post.getContent()});
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public Boolean updatePost(Post post) {
        try {
            jdbcTemplate.update("update posts set title = ?, summary = ? ,featured = ?, content = ? where id = ?",
                    new Object[]{post.getTitle(), post.getSummary(), post.getFeatured(), post.getContent(), post.getId()});
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public Boolean deletePostById(int id) {
        try {
            jdbcTemplate.update("delete from posts where id=?", new Object[]{id});
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    public Boolean existsPostByTitle(String title) {
        if (title == null) {
            return false;
        }

        List<Post> postList;
        try {
            postList = jdbcTemplate.query("select * from posts where title=?", new Object[]{title}, new BeanPropertyRowMapper<>(Post.class));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        return !postList.isEmpty();
    }

    public Boolean existsPostById(int id) {
        if (id == 0) {
            return false;
        }

        List<Post> postList;
        try {
            postList = jdbcTemplate.query("select * from posts where id=?", new Object[]{id}, new BeanPropertyRowMapper<>(Post.class));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        return !postList.isEmpty();
    }
}
