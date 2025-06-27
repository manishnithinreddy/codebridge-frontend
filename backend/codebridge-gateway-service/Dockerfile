FROM maven:3.8.7-eclipse-temurin-21 as build
WORKDIR /workspace/app

COPY pom.xml .
COPY src src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
COPY --from=build /workspace/app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
