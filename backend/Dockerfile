# Build the Spring Boot application with Maven and Java 17.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml .
RUN mvn -B -ntp dependency:go-offline

COPY src ./src
RUN mvn -B -ntp package

# Run the packaged application on a smaller Java 17 runtime.
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

RUN useradd --system --uid 10001 --create-home appuser
COPY --from=build --chown=10001:10001 /workspace/target/hireflow-api-0.0.1-SNAPSHOT.jar /app/app.jar

USER 10001:10001
EXPOSE 8080
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
