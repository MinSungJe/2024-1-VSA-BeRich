package com.berich.stock_bot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.berich.stock_bot.dto.AddUserRequest;
import com.berich.stock_bot.dto.LoginRequest;
import com.berich.stock_bot.dto.LoginTokenResponse;
import com.berich.stock_bot.entity.User;
import com.berich.stock_bot.repository.UserRepository;
import com.berich.stock_bot.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class UserApiController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;


    //아이디 중복확인
    @PostMapping("/signup/check-loginId")
    public ResponseEntity<String> checkLoginId(@RequestBody String inputLoginId) {
        if(!userRepository.existsByLoginId(inputLoginId)){
            return ResponseEntity.ok("사용가능한 아이디입니다.");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 아이디입니다.");
    }

    //이메일 중복확인
    @PostMapping("/signup/check-email")
    public ResponseEntity<String> checkEmail(@RequestBody String inputEmail) {
        if(!userRepository.existsByEmail(inputEmail)){
            return ResponseEntity.ok("사용가능한 이메일입니다.");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 등록된 이메일입니다.");
    
    }


    //회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody AddUserRequest request) {
        userService.save(request);
        return ResponseEntity.ok("가입이 성공적으로 완료되었습니다.");
    }

    //회원탈퇴
    @GetMapping("/api/withdraw")
    public ResponseEntity<String> deleteAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByLoginId(authentication.getName()).orElse(null);
        Long userId = user.getId();
        userService.deleteAccount(userId);
        return ResponseEntity.ok("탈퇴처리 되었습니다.");
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String loginId = loginRequest.getLoginId();
        
        String password = loginRequest.getPassword();
        System.out.println("이게뭐야야야야야"+loginId+password);
        // LoginTokenResponse loginToken = userService.login(loginId, password);
        // return loginToken;
        try {
        LoginTokenResponse loginToken = userService.login(loginId, password);
        if (loginToken != null) {
            // 로그인 성공 시 토큰과 함께 200 OK 응답
            return ResponseEntity.ok(loginToken);
        } else {
            // 로그인 실패 시 401 Unauthorized 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호를 다시 확인해주세요.");
        }
        } catch (Exception e) {
            // 예외 발생 시 400 Bad Request 응답
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("An error occurred");
        }
    }

    // //로그아웃
    // @PostMapping("/logout")
    // public ResponseEntity<String> logout(@RequestHeader("Authorization") String authorizationHeader) {
    //     // "Bearer " 접두사 제거
    //     String token = authorizationHeader.substring(7);
    //     tokenService.blacklistToken(token);
    //     return ResponseEntity.ok("로그아웃 되었습니다.");
    // }
}
