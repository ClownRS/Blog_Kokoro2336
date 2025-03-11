package com.project.myblog.utils;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

public class JSON {
    public static String toJSON(Object obj) {
        String json = null;
        ObjectMapper mapper = new ObjectMapper();
        try {
            json = mapper.writeValueAsString(obj);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return json;
    }

    public static String tokensToJSON(String accessToken, String refreshToken) {
        Map<String, String> newTokens = new HashMap<>();
        newTokens.put("access_token", accessToken);
        newTokens.put("refresh_token", refreshToken);

        return JSON.toJSON(newTokens);
    }

    public static String loginStateToJSON(int i) {
        Map<String, Integer> map = new HashMap<>();
        map.put("state", i);

        return JSON.toJSON(map);
    }
}
