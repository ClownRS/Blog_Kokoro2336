package com.project.myblog.interceptor;

import com.project.myblog.service.SysService;
import com.project.myblog.utils.JWT;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.util.Enumeration;

@Component
@CrossOrigin(value = "*", allowedHeaders = {"Authorization", "Content-Type"}, methods = {RequestMethod.GET, RequestMethod.POST,
                                                                                         RequestMethod.OPTIONS, RequestMethod.PUT, RequestMethod.DELETE})
public class SysInterceptor implements HandlerInterceptor {
    /**
     * 负责拦截/sys路径下除了/auth以外的请求
     * 负责验证access token*/
    @Autowired
    SysService sysService;

    public SysService getSysService() {
        return sysService;
    }

    public void setSysService(SysService sysService) {
        this.sysService = sysService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if(HttpMethod.OPTIONS.toString().equals(request.getMethod())){
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.contains("Bearer")) {
            String accessToken = authHeader.substring(7);
            request.setAttribute("accessToken", accessToken);

            if(!sysService.authWithToken(accessToken)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
            return sysService.authWithToken(accessToken);
        }
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
