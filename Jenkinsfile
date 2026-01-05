pipeline {
    agent any

    environment {
        APP_NAME = 'PDE-UI'
        APP_PORT = '2000'
        TRIVY_CACHE_DIR = '/tmp/trivy-cache'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Node Check') {
            steps {
                sh '''
                echo "===== NODE CHECK ====="
                which node
                node -v
                npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "===== INSTALL DEPENDENCIES ====="
                npm install --legacy-peer-deps
                '''
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SONARQUBE-PDE-FRONTEND') {
                        sh '''
                        echo "===== SONARQUBE SCAN ====="
                        '"${scannerHome}"'/bin/sonar-scanner
                        '''
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

        stage('Trivy Security Scan (HTML)') {
            steps {
                sh '''
                echo "===== TRIVY SECURITY SCAN (HTML REPORT) ====="

                mkdir -p trivy-reports

                # Generate HTML report
                trivy fs . \
                  --cache-dir $TRIVY_CACHE_DIR \
                  --severity HIGH,CRITICAL \
                  --format template \
                  --template "@trivy-templates/html.tpl" \
                  --output trivy-reports/trivy.html \
                  --no-progress

                # Fail pipeline ONLY if CRITICAL vulnerabilities found
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
                sh '''
                echo "===== BUILD FRONTEND ====="
                npm run build
                '''
            }
        }

        stage('PM2 Deploy') {
            steps {
                sh '''
                echo "===== PM2 DEPLOY ====="
                pm2 delete ${APP_NAME} || true
                pm2 start npm --name "${APP_NAME}" -- start -i max
                pm2 save
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "===== HEALTH CHECK ====="
                curl -f http://localhost:${APP_PORT}
                '''
            }
        }
    }

    post {
        always {
            echo "Archiving Trivy HTML report"
            archiveArtifacts artifacts: 'trivy-reports/trivy.html', fingerprint: true
        }
        success {
            echo "✅ SUCCESS: SonarQube + Trivy + PM2 pipeline completed"
        }
        failure {
            echo "❌ FAILURE: Check SonarQube or Trivy report"
        }
    }
}
