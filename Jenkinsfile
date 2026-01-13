pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://10.10.120.20:9000"
        SONAR_TOKEN = credentials('jenkins-token')
        APP_NAME = "PDE_UI"     // <-- Updated as you requested
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

        stage('Clean Previous Build') {
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
                withSonarQubeEnv('Sonar-jenkins-token') {
                    sh """
                        /opt/sonarscanner/sonar-scanner-*/bin/sonar-scanner \
                        -Dsonar.projectKey=jenkins-token \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_TOKEN
                    """
                }
            }
        }

      stage('PM2 Cluster Deployment') {
    steps {
        sh """
            pm2 delete PDE-UI || true
            pm2 delete ${APP_NAME} || true
            pm2 start ecosystem.config.js
            pm2 save
        """
    }
}

    post {
        success {
            echo "SUCCESS: SonarQube + Build + PM2 Cluster Deployment Completed!"
        }
        failure {
            echo "FAILED: Check pipeline logs!"
        }
    }
 }







