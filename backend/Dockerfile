# Build stage
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Spring Boot chọn profile dựa vào env
ENTRYPOINT ["sh","-c","java -jar -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE app.jar"]
EXPOSE 8080
