package com.project.myblog.service;

import com.project.myblog.dao.SysDao;
import com.project.myblog.utils.JWT;
import com.project.myblog.utils.SHA256;
import io.jsonwebtoken.*;
import io.jsonwebtoken.impl.DefaultClaims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SysService {
    @Autowired
    private SysDao sysDao;

    private static final String key = "kokorogiaogiaogiaogiaogiaogiaogiaogiaogiaogiaogiaogiaogiao";

    public SysDao getSysDao() {
        return sysDao;
    }

    public void setSysDao(SysDao sysDao) {
        this.sysDao = sysDao;
    }
    
    /**
     * @return : 1: login success; 2: user doesn't exist; 3: wrong password
     * */
    public int login(String username, String password) {
        String passwordHash = SHA256.getSHA256Hash(password);

        if (!sysDao.userExists(username)) {
            return 2;
        } else if (sysDao.findUserByUnameAndPWD(username, passwordHash).isEmpty()) {
            return 3;
        }
        return 1;
    }

    /**
     * auth with token.
     * @param token
     * @return true if success, else false.
     */
    public Boolean authWithToken(String token) {
        try {
            JWT.parseJWT(token, key);
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    public String genAccessToken(String username) {
        long exp = 1000 * 60 * 60 * 24;
        String sub = "access";
        Map<String, String> claims = new HashMap<>();
        claims.put("username", username);

        return JWT.genJWT(key, exp, sub, claims);
    }

    public String genRefreshToken(String username) {
        long exp = 1000 * 60 * 60 * 24 * 7;
        String sub = "refresh";
        Map<String, String> claims = new HashMap<>();
        claims.put("username", username);

        return JWT.genJWT(key, exp, sub, claims);
    }

    public String getKey() {
        return key;
    }
}
