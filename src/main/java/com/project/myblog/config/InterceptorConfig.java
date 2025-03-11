package com.project.myblog.config;

import com.project.myblog.interceptor.AuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthInterceptor())  //注册新的拦截器
                .addPathPatterns("/sys/**")
                .excludePathPatterns("/sys/login"); //添加不包含的路径
    }
}
