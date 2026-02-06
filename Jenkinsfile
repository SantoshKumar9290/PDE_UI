pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://10.10.120.20:9000"
        SONAR_TOKEN = credentials('jenkins-token')
        APP_NAME = "pde_ui"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || true'
            }
        }

        stage('SonarQube Scan') {
            steps {
                sh """
                sonar-scanner \
                  -Dsonar.projectKey=$APP_NAME \
                  -Dsonar.sources=. \
                  -Dsonar.host.url=$SONAR_HOST_URL \
                  -Dsonar.token=$SONAR_TOKEN
                """
            }
        }
    }

    post {
        success {
            echo "Build & Sonar scan completed successfully"
        }
        failure {
            echo "FAILED: Check logs"
        }
    }
}
