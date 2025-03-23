package com.project.myblog.utils;

import java.security.Key;
import java.util.Base64;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JWT {
    public static Claims parseJWT(String token, String key) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static String genJWT(String key, Long exp, String sub, Map claims) {
        return Jwts.builder()
                .setSubject(sub)
                .setIssuedAt(new Date())
                //set expiration time
                .setExpiration(new Date(System.currentTimeMillis() + exp))
                //set claims
                .claims(claims)
                //encrypt with hs256 and key
                .signWith(SignatureAlgorithm.HS256, key)
                //gen token
                .compact();
    }

    /**
     * only get the username in the payload.
     * @return username if exist, else return null.
     * */
    public static String getUsernameInJWT(String token) {
        String JWTInString = new String(Base64.getDecoder().decode(token.split("\\.")[1]));  //需要new String对象，因为解码直接得到的是byte[]数组
        ObjectMapper mapper = new ObjectMapper();
        JsonNode payLoad = null;
        try {
            payLoad = mapper.readTree(JWTInString);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return payLoad.get("username").asText();
    }
}
