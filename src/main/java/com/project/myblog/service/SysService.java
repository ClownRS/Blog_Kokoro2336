package com.project.myblog.service;

import com.project.myblog.dao.SysDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SysService {
    @Autowired
    private SysDao sysDao;

    public SysDao getSysDao() {
        return sysDao;
    }

    public void setSysDao(SysDao sysDao) {
        this.sysDao = sysDao;
    }
    
    /**
     * @return : 1: login success; 2: user doesn't exist; 3: wrong password*/
    public int login(String username, String password) {
        if (!sysDao.userExists(username)) {
            return 2;
        } else if (sysDao.findUser(username, password).isEmpty()) {
            return 3;
        }
        return 1;
    }
}
