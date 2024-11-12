FROM openjdk:17-jdk-bullseye
WORKDIR /app
RUN apt-get update && \
    apt-get install -y ffmpeg
COPY build/libs/card-service-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir resources
ENTRYPOINT ["java","-jar","app.jar"]