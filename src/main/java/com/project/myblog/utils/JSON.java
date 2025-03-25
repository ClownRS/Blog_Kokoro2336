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
        newTokens.put("accessToken", accessToken);
        newTokens.put("refreshToken", refreshToken);

        return JSON.toJSON(newTokens);
    }

    public static String loginStateToJSON(int i) {
        Map<String, Integer> map = new HashMap<>();
        map.put("state", i);

        return JSON.toJSON(map);
    }

    public static String uploadStateToJSON(String uploadType, Boolean isSuccess) {
        Map<String, String> map = new HashMap<>();
        map.put("uploadType", uploadType);
        map.put("isSuccess", isSuccess.toString());

        return JSON.toJSON(map);
    }

    public static String authStateToJSON(String requestType, String state) {
        Map<String, String> map = new HashMap<>();
        map.put("requestType", requestType);
        map.put("state", state);
        return JSON.toJSON(map);
    }

    public static String deleteStateToJSON(Boolean isSuccess, String message) {
        Map<String, String> map = new HashMap<>();
        map.put("isSuccess", isSuccess.toString());
        map.put("message", message);

        return JSON.toJSON(map);
    }
}
