pipeline {
    agent any

    environment {
        SONAR_HOST_URL = 'http://10.10.120.190:9000'
        SONAR_TOKEN = credentials('sonar-token')
        APP_NAME = 'pde_ui'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Scan') {
            steps {
                sh """
                sonar-scanner \
                  -Dsonar.projectKey=PDE_UI-SONAR \
                  -Dsonar.sources=. \
                  -Dsonar.host.url=${SONAR_HOST_URL} \
                  -Dsonar.login=${SONAR_TOKEN}
                """
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy with PM2 Cluster') {
            steps {
                sh """
                pm2 delete ${APP_NAME} || true
                pm2 start npm --name "${APP_NAME}" -i max -- start
                pm2 save
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment successful'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}
