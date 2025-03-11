package com.project.myblog.service;

import com.project.myblog.dao.SysDao;
import com.project.myblog.utils.JWT;
import com.project.myblog.utils.SHA256;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.DefaultClaims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SysService {
    @Autowired
    private SysDao sysDao;

    private static final String key = "kokoro";

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
     * @param accessToken
     * @param refreshToken
     * @return 1: auth success; 2: the access token has expired but the refresh one doesn't
     *         3: the long one has expired; 4: invalid token(username doesn't exist, etc.)
     */
    public Integer authWithToken(String accessToken, String refreshToken) {
        Boolean isAccessTokenExp = false;
        Boolean isRefreshTokenExp = false;
        Claims accessTokenClaims = null;
        Claims refreshTokenClaims = null;

        //check access token
        try {
            accessTokenClaims = JWT.parseJWT(accessToken, key);
        } catch (ExpiredJwtException e) {
            isAccessTokenExp = true;
        } catch (Exception e) {
            return 4;
        }

        try {
            refreshTokenClaims = JWT.parseJWT(refreshToken, key);
        } catch (ExpiredJwtException e) {
            isRefreshTokenExp = true;
        } catch (Exception e) {
            return 4;
        }

        //根据得到的情况返回状态码
        if (!isAccessTokenExp && !isRefreshTokenExp) {
            return 1;
        } else if (isAccessTokenExp && !isRefreshTokenExp) {
            return 2;
        } else if (isRefreshTokenExp){
            return 3;
        } else {
            return 4;
        }
    }

    public String genAccessToken(String username) {
        long exp = 1000 * 60;
        String sub = "access";
        Map<String, String> claims = new HashMap<>();
        claims.put("username", username);

        return JWT.genJWT(key, exp, sub, claims);
    }

    public String genRefreshToken(String username) {
        long exp = 1000 * 60 * 2;
        String sub = "refresh";
        Map<String, String> claims = new HashMap<>();
        claims.put("username", username);

        return JWT.genJWT(key, exp, sub, claims);
    }

    public String getKey() {
        return key;
    }
}
