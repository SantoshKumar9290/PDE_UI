pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    environment {
        SONAR_HOST_URL = "http://10.10.120.20:9000"
        SONAR_PROJECT_KEY = "PDE-FRONTEND"
        APP_NAME = "pde_frontend"
        DEPLOY_DIR = "/opt/apps/frontend/current"
        TRIVY_SEVERITY = "HIGH,CRITICAL"
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
                sh '''
                  rm -rf node_modules package-lock.json
                  npm install --legacy-peer-deps
                '''
            }
        }

        stage('Build Next.js') {
            steps {
                sh '''
                  npm run build
                '''
            }
        }

        stage('SonarQube Scan') {
            environment {
                SONAR_TOKEN = credentials('sonar-token')
            }
            steps {
                sh '''
                  npx sonar-scanner \
                    -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                    -Dsonar.sources=src,pages \
                    -Dsonar.host.url=${SONAR_HOST_URL} \
                    -Dsonar.token=${SONAR_TOKEN}
                '''
            }
        }

        stage('SonarQube Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        /* 🔐 TRIVY SECURITY GATE */
        stage('Trivy Security Scan (Gate)') {
            steps {
                sh '''
                  echo "Running Trivy Security Scan..."
                  trivy fs . \
                    --severity ${TRIVY_SEVERITY} \
                    --exit-code 1 \
                    --no-progress
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                  mkdir -p /opt/apps/frontend
                  rm -rf ${DEPLOY_DIR}/*
                  cp -r .next public package.json ecosystem.config.js ${DEPLOY_DIR}/
                  cd ${DEPLOY_DIR}
                  npm install --production --legacy-peer-deps
                '''
            }
        }

        stage('Restart UI (PM2)') {
            steps {
                sh '''
                  pm2 delete ${APP_NAME} || true
                  pm2 start ${DEPLOY_DIR}/ecosystem.config.js
                  pm2 save
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                  sleep 10
                  curl -f http://localhost:2000/PDE
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build passed Sonar + Trivy gates and deployed"
        }
        failure {
            echo "❌ Build FAILED due to Quality/Security gate"
        }
    }
}
