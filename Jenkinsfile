pipeline {
    agent any

    environment {
        APP_NAME = 'PDE-UI'
        APP_PORT = '2000'
        TRIVY_CACHE_DIR = '/tmp/trivy-cache'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Node Check') {
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
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SONARQUBE-PDE-FRONTEND') {
                        sh "${scannerHome}/bin/sonar-scanner"
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
                echo "===== TRIVY SECURITY SCAN ====="
                mkdir -p trivy-reports

                trivy fs . \
                  --cache-dir $TRIVY_CACHE_DIR \
                  --severity HIGH,CRITICAL \
                  --format table \
                  --output trivy-reports/trivy.txt

                trivy fs . \
                  --cache-dir $TRIVY_CACHE_DIR \
                  --severity CRITICAL \
                  --exit-code 1 \
                  --no-progress .
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'npm run build'
            }
        }

        stage('PM2 Deploy') {
            steps {
                sh '''
                pm2 delete ${APP_NAME} || true
                pm2 start npm --name "${APP_NAME}" -- start -i max
                pm2 save
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh "curl -f http://localhost:${APP_PORT}"
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-reports/*', fingerprint: true
        }
        success {
            echo "✅ SUCCESS: SonarQube + Trivy + PM2 deployment completed"
        }
        failure {
            echo "❌ FAILED: Check Sonar or Trivy reports"
        }
    }
}
