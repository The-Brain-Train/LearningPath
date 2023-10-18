FROM maven:3.9.4-eclipse-temurin-20 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:3.9.4-eclipse-temurin-20-slim-buster

COPY --from=build /target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","backend.jar"]