pipeline {
    agent any

    environment {
        APP_NAME = 'PDE-UI'
        APP_PORT = '2000'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Check Node') {
            steps {
                sh '''
                  echo "=== NODE CHECK ==="
                  which node
                  node -v
                  npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                  echo "=== INSTALL DEPENDENCIES ==="
                  npm install --legacy-peer-deps
                '''
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SONARQUBE-PDE-FRONTEND') {
                        sh """
                        echo "=== SONARQUBE SCAN ==="
                        ${scannerHome}/bin/sonar-scanner
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
                echo "=================================="
                echo "🔐 STARTING TRIVY SECURITY SCAN 🔐"
                echo "=================================="

                trivy fs \
                  --severity HIGH,CRITICAL \
                  --exit-code 1 \
                  --no-progress \
                  .

                echo "✅ TRIVY SCAN COMPLETED"
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                  echo "=== BUILD FRONTEND ==="
                  npm run build
                '''
            }
        }

        stage('PM2 Start') {
            steps {
                sh '''
                echo "=== PM2 START ==="
                pm2 delete ${APP_NAME} || true
                pm2 start npm --name "${APP_NAME}" -- start -i max
                pm2 save
                '''
            }
        }

        stage('UI Health Check') {
            steps {
                sh '''
                echo "=== HEALTH CHECK ==="
                curl -f http://localhost:${APP_PORT}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ PIPELINE SUCCESS (SonarQube + Trivy + Deploy)"
        }
        failure {
            echo "❌ PIPELINE FAILED"
        }
    }
}
