FROM maven:3.8.6-openjdk-20 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:20-jdk-slim
COPY --from=build /target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","backend.jar"]