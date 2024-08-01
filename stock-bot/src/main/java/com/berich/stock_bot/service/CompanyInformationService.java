package com.berich.stock_bot.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import com.berich.stock_bot.entity.CompanyInformation;
import com.berich.stock_bot.repository.CompanyInformationRepository;

@Service//서버시작시 실행
@Order(1)
public class CompanyInformationService implements CommandLineRunner {

    //코스피 200 종목 저장하기
    @Autowired
    private CompanyInformationRepository companyInformationRepository;

    @Override
    public void run(String... args) throws Exception {//바로 시작 한번
        // 데이터베이스 비우기
        companyInformationRepository.deleteAll();
        // CSV 파일 경로
        String csvFile = "classpath:data/data_KOSPI200.csv";
        List<CompanyInformation> companies = readCompanyDataFromCsv(csvFile);

        // 데이터베이스에 저장
        companyInformationRepository.saveAll(companies);
    }

    //정보읽어오기
    private List<CompanyInformation> readCompanyDataFromCsv(String csvFile) throws IOException {
        List<CompanyInformation> companies = new ArrayList<>();//회사목록
        File file = ResourceUtils.getFile(csvFile);
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            br.readLine(); // 헤더 없이
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                CompanyInformation company = new CompanyInformation();//id자동생성
                company.setStockCode(values[0]);//1열
                company.setCompanyName(values[1]);//2열
                companies.add(company);
            }
        }
        return companies;
    }

    //모든 주식코드 목록
    public List<String> getAllStockCodes() {
        List<CompanyInformation> companies = companyInformationRepository.findAll();
        return companies.stream()
                        .map(CompanyInformation::getStockCode)
                        .collect(Collectors.toList());
    }
}
