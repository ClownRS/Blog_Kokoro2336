package com.project.myblog.interceptor;

import com.project.myblog.service.SysService;
import com.project.myblog.utils.JSON;
import com.project.myblog.utils.JWT;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.io.PrintWriter;

import static com.project.myblog.utils.JSON.tokensToJSON;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    /**
     * To Intercept all the request to /sys to handle authorization.
     * */

    @Autowired
    SysService sysService;  //直接注入service层对象

    public SysService getSysService() {
        return sysService;
    }

    public void setSysService(SysService sysService) {
        this.sysService = sysService;
    }

    /**
     * authorization
     * */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authHeader = request.getHeader("Authorization");
        if (authHeader.contains("Bearer") && authHeader.contains("Refresh ")) {
            String[] tokens = authHeader.split(",");
            String accessToken = tokens[0].substring(7);
            String refreshToken = tokens[1].substring(7);
            String username = JWT.getUsernameInJWT(accessToken);

            response.setContentType("application/json;charset=utf-8");
            response.setCharacterEncoding("utf-8");

            Integer authState = sysService.authWithToken(accessToken, refreshToken);

            if (authState == 1) {  //if auth success, redirect to sys interface.
                response.sendRedirect("redirect:/sys.html?state=1");
            } else if (authState == 2) {   //if accessToken expired but refresh doesn't, regen the access and return the tokens.
                String newAccessToken = sysService.genAccessToken(username);
                PrintWriter writer = response.getWriter();
                writer.write(JSON.tokensToJSON(newAccessToken, refreshToken));
            } else if (authState == 3 || authState == 4) {   //if both expired, redirect to login.
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }

            return true;
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
