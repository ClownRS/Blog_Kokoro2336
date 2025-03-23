package com.project.myblog.entity;

import java.sql.Timestamp;
import java.util.Date;

public class Post {
    private Integer id;
    private String title;
    private Timestamp postDate;
    private Timestamp lastModified;
    private String summary;
    private String content;
    private Boolean isFeatured;

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Boolean getFeatured() {
        return isFeatured;
    }

    public void setFeatured(Boolean featured) {
        isFeatured = featured;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Timestamp getPostDate() {
        return postDate;
    }

    public void setPostDate(Timestamp postDate) {
        this.postDate = postDate;
    }

    public Timestamp getLastModified() {
        return lastModified;
    }

    public void setLastModified(Timestamp lastModified) {
        this.lastModified = lastModified;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Post(Integer id, String title, String summary, Boolean isFeatured, String content) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.isFeatured = isFeatured;
        this.content = content;
    }

    public Post() { //需要显式写出无参构造，否则spring会报BeanInstantiationException.
    }
}
