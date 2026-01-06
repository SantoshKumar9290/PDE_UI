pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    environment {
        APP_NAME = "pde_frontend"
        BASE_DIR = "/opt/apps/frontend"
        CURRENT_DIR = "/opt/apps/frontend/current"
        RELEASES_DIR = "/opt/apps/frontend/releases"
        PORT = "2000"
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

        stage('Deploy to Server') {
            steps {
                sh '''
                  set -e

                  mkdir -p ${CURRENT_DIR}

                  # Clean current
                  rm -rf ${CURRENT_DIR}/*

                  # Copy required files
                  cp -r .next public package.json package-lock.json ecosystem.config.js ${CURRENT_DIR}/

                  # Install production deps
                  cd ${CURRENT_DIR}
                  npm install --omit=dev --legacy-peer-deps
                '''
            }
        }

        stage('Start UI with PM2') {
            steps {
                sh '''
                  pm2 delete ${APP_NAME} || true
                  pm2 start ${CURRENT_DIR}/ecosystem.config.js
                  pm2 save
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                  sleep 10
                  curl -f http://localhost:${PORT}/PDE
                '''
            }
        }
    }

    post {
        success {
            echo "✅ UI deployed and running under PM2"
        }
        failure {
            echo "❌ Deployment failed"
        }
    }
}
