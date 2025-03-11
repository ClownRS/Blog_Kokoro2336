package com.project.myblog.controller;

import com.project.myblog.service.SysService;
import com.project.myblog.utils.JSON;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Controller
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {
    @Autowired
    SysService sysService;

    public SysService getSysService() {
        return sysService;
    }

    public void setSysService(SysService sysService) {
        this.sysService = sysService;
    }

    @ResponseBody
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(@RequestParam("username")String username, @RequestParam("password") String password, HttpServletResponse response) {
        int state = sysService.login(username, password);
        if (state == 1) {  //if login success, gen bi-token and return the tokens.
            String accessToken = sysService.genAccessToken(username);
            String refreshToken = sysService.genRefreshToken(username);

            return JSON.tokensToJSON(accessToken, refreshToken);
        }

        //else just send back the error state in JSON type.
        return JSON.loginStateToJSON(state);
    }

    @RequestMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        //
    }
}
