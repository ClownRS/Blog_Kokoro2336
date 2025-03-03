package com.project.myblog.controller;

import com.project.myblog.service.SysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/sys")
@CrossOrigin("*")
public class SysController {
    @Autowired
    private SysService sysService;

    public SysService getSysService() {
        return sysService;
    }

    public void setSysService(SysService sysService) {
        this.sysService = sysService;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(@RequestParam("username")String username,@RequestParam("password") String password) {
        int status = sysService.login(username, password);

        return "redirect:/sys_login.html?status=" + status;
    }
}
