FROM openjdk:17
WORKDIR /app
COPY build/libs/gateway-service-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir resources
ENTRYPOINT ["java","-jar","app.jar"]