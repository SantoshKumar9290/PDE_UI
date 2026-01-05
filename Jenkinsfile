pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    environment {
        // SonarQube
        SONAR_TOKEN = credentials('SONAR_TOKEN')

        // App details
        APP_NAME = 'PDE-UI'
        APP_PORT = '3000'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                trivy fs \
                  --severity HIGH,CRITICAL \
                  --exit-code 1 \
                  --no-progress \
                  .
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                npm install --force
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                npm run build
                '''
            }
        }

        stage('PM2 Start (Cluster Mode)') {
            steps {
                sh '''
                pm2 delete ${APP_NAME} || true

                pm2 start npm \
                  --name "${APP_NAME}" \
                  -- start \
                  -i max

                pm2 save
                '''
            }
        }

        stage('UI Health Check') {
            steps {
                sh '''
                curl -f http://localhost:${APP_PORT} || exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "✅ PDE-UI deployed successfully (Sonar + Trivy + PM2 Cluster)"
        }
        failure {
            echo "❌ Pipeline failed – check Jenkins logs"
        }
    }
}
