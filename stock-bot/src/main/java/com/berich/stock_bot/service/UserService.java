package com.berich.stock_bot.service;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.berich.stock_bot.config.jwt.TokenProvider;
import com.berich.stock_bot.dto.AddUserRequest;
import com.berich.stock_bot.dto.LoginTokenResponse;
import com.berich.stock_bot.dto.UserInformationResponse;
import com.berich.stock_bot.entity.Account;
import com.berich.stock_bot.entity.User;
import com.berich.stock_bot.repository.AccountRepository;
import com.berich.stock_bot.repository.RefreshTokenRepository;
import com.berich.stock_bot.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private AccountRepository accountRepository;

    public static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(14);
    public static final Duration ACCESS_TOKEN_DURATION = Duration.ofHours(2);
   // private final AuthenticationManager authenticationManager;

    //회원가입
    @Transactional
    public Long save(AddUserRequest dto) {
        return userRepository.save(User.builder()
                .loginId(dto.getLoginId())
                .email(dto.getEmail())
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))//비밀번호 암호화 저장
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .birthDate(dto.getBirthDate())
                .build()).getId();
    }

    //로그인
    @Transactional
    public LoginTokenResponse login(String loginId, String password) {
        // User user = userRepository.findByLoginId(loginId)
        //         .orElseThrow(() -> new BadCredentialsException("User not found"));
        User user = userRepository.findByLoginId(loginId)
                .orElse(null);

        if(user == null) {
            return null;
        }

        // if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
        //     throw new BadCredentialsException("Invalid password");

        // }

        if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
            //throw new BadCredentialsException("Invalid password");
            return null;
        }

        

        String refreshToken = tokenProvider.generateToken(user, REFRESH_TOKEN_DURATION);
        String accessToken = tokenProvider.generateToken(user, ACCESS_TOKEN_DURATION);
        refreshTokenService.saveRefreshToken(user.getId(),refreshToken);
        LoginTokenResponse loginToken = new LoginTokenResponse("Bearer", accessToken, refreshToken);
        return loginToken;
    }

        // public LoginTokenResponse login(String loginId, String password) {
        // Authentication authentication = authenticationManager.authenticate(
        //     new UsernamePasswordAuthenticationToken(loginId, password)
        // );

        // UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // User user = userRepository.findByLoginId(userDetails.getUsername())
        //         .orElseThrow(() -> new BadCredentialsException("User not found"));//로그인 아이디로 조회
        // String accessToken = tokenProvider.generateToken(user, ACCESS_TOKEN_DURATION);
        // String refreshToken = tokenProvider.generateToken(user, REFRESH_TOKEN_DURATION);
        
        // refreshTokenService.saveRefreshToken(user.getId(), refreshToken);
        
        // return new LoginTokenResponse("Bearer", accessToken, refreshToken);
        // }

    public User findById(Long userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다: " + userId));
    }

    public User getUserByLoginId(String loginId) {
        return userRepository.findByLoginId(loginId).orElseThrow(() -> new UsernameNotFoundException("해당 id의 사용자가 없습니다: " + loginId));
    }

    //계정삭제
    @Transactional
    public void deleteAccount(Long userId) {
        userRepository.deleteById(userId);//계정삭제
        //리프레시 토큰도 자동 삭제
        //계좌삭제 자동
    }

    //유저정보 조회
    public UserInformationResponse getUserInfo(String loginId){
        User user = userRepository.findByLoginId(loginId).orElse(null);
        Account account = accountRepository.findByUserId(user.getId()).orElse(null);
        String accountNum;
        if (user==null){
            //예외처리
        }
        if(account==null) {
            accountNum= "등록된 계좌 없음";
        } else {
            accountNum = account.getAccountNum();
        }
        return new UserInformationResponse(loginId, user.getFirstName(), user.getLastName(), accountNum);

    }

}
