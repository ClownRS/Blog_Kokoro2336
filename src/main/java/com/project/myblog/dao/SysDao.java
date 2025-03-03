package com.project.myblog.dao;

import com.project.myblog.entity.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SysDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Admin> findUser(String username, String password) {
        return jdbcTemplate.query("select * from admin where username=? and password=?",
                new Object[]{username, password}, new BeanPropertyRowMapper<Admin>(Admin.class));
    }

    public boolean userExists(String username) {
        List<Admin> admins = jdbcTemplate.query("select * from admin where username=?",
                new Object[]{username}, new BeanPropertyRowMapper<Admin>(Admin.class));

        return !admins.isEmpty();
    }
}
