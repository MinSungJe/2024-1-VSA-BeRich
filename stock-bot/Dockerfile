FROM amazoncorretto:17
# 작업 디렉토리 설정
WORKDIR /app
COPY build/libs/*.jar app/spring-base.jar
ENTRYPOINT ["java", "-jar", "app/spring-base.jar"]