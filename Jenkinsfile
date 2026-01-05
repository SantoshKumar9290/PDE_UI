pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('SONAR_TOKEN')
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
                  which node
                  node -v
                  npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
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
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=PDE-FRONTEND \
                        -Dsonar.sources=. \
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

        stage('Build Frontend') {
            steps {
                sh '''
                  npm run build
                '''
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

        stage('PM2 Start') {
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
                curl -f http://localhost:${APP_PORT}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ PDE-UI deployed successfully"
        }
        failure {
            echo "❌ Pipeline failed – check logs"
        }
    }
}
