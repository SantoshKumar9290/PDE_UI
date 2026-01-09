pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://10.10.120.20:9000"
        SONAR_TOKEN = credentials('jenkins-token')
        DOCKER_IMAGE = "pde_ui_app"
        APP_NAME = "PDE-UI"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/SantoshKumar9290/PDE_UI.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh "npm install --force"
            }
        }

        stage('Clean previous build') {
            steps {
                sh "rm -rf .next"
            }
        }

        stage('Build Next.js App') {
            steps {
                sh "npm run build"
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh """
                        /opt/sonarscanner/sonar-scanner-*/bin/sonar-scanner \
                        -Dsonar.projectKey=PDE_UI \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_TOKEN
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:latest .
                """
            }
        }

        stage('PM2 Cluster Deployment') {
            steps {
                sh """
                    pm2 delete ${APP_NAME} || true
                    pm2 start npm --name "${APP_NAME}" -- start -i max
                    pm2 save
                """
            }
        }
    }

    post {
        success {
            echo "SUCCESS: Build + Sonar + Docker Build + PM2 Cluster Deployment Completed!"
        }
        failure {
            echo "FAILED: Check pipeline logs!"
        }
    }
}
