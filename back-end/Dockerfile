FROM maven:3.8.4-openjdk-17-slim AS build

COPY . .
RUN mvn clean package -DskipTests

FROM amazoncorretto:17.0.8-alpine3.18

COPY --from=build /target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","backend.jar"]