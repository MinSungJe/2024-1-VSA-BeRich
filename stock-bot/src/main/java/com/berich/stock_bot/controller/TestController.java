package com.berich.stock_bot.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class TestController {

    @GetMapping("/api/test")
    public String testC(@AuthenticationPrincipal UserDetails user) {
        String userId = user.getUsername();
        return "로그인기능이 되는지 테스트트트트트트!!!" + userId;
    }

//     @PostMapping("/api/abb")
//     public ResponseEntity<String> abb(@RequestBody Request request) {
//         String a = request.getAbc();
//         System.out.println("진짜임?" +a);
//         //accountService.enrollAccount(userDetail.getUsername(), accountRequest);

//         return ResponseEntity.ok("좀되라고 제발"+a);
//     }
}
