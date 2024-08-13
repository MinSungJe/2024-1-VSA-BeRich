package com.berich.stock_bot.entity;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "users") //users이름의 테이블 생성
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class User implements UserDetails {

    //고유id-자동생성
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", updatable = false)
    private Long id;

    //유저가 설정한 로그인시 아이디, unique
    @Column(name = "loginId", nullable = false, unique = true)
    private String loginId;

    //유저 email, unique
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    //유저 비밀번호
    @Column(name = "password", nullable = false)
    private String password;

    //유저 기본정보
    //이름
    @Column(nullable = false)
    private String firstName;
    //성
    @Column(nullable = false)
    private String lastName;
    //생년월일
    @Column(nullable = false)
    private LocalDate birthDate;

    // 계좌정보
    @JsonIgnore
    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL, orphanRemoval = true)
    private Account account;

    // 토큰정보
    @JsonIgnore
    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL, orphanRemoval = true)
    private RefreshToken refreshToken;

    @Builder
    public User(String loginId, String email, String password, String firstName, String lastName, LocalDate birthDate, String auth) {
        this.loginId = loginId;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
    }


    @Override//사용자가 가지고 있는 권한 목록 반환
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("user"));
    }



    @Override //고유한 사용자 id 반환 - 로그인 id로 설정
    public String getUsername() {
        return loginId;
    }

    @Override //비밀번호 반환
    public String getPassword() {
        return password;
    }

    @Override //계정이 만료되지 않은 것으로 설정
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override //계정 잠금 없는 것으로 설정
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override // 비밀번호 만료되었는지 확인
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override //계정활성화-like 인스타 활성화/비활성화
    public boolean isEnabled() {
        return true;
    }

}
