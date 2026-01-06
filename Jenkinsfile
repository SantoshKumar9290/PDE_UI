pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    environment {
        APP_NAME        = "pde_frontend"
        BASE_DIR        = "/opt/apps/frontend"
        CURRENT_DIR     = "/opt/apps/frontend/current"
        RELEASES_DIR    = "/opt/apps/frontend/releases"
        BACKUP_DIR      = "/opt/apps/frontend/backup"
        SONAR_HOST_URL  = "http://10.10.120.20:9000"
        SONAR_PROJECT   = "PDE-FRONTEND"
        HEALTH_URL      = "http://localhost:3000"
        RELEASE_NAME    = "${BUILD_NUMBER}-$(date +%Y%m%d%H%M%S)"
    }

    stages {

        /* 1️⃣ Checkout Code */
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/SantoshKumar9290/PDE_UI.git'
            }
        }

        /* 2️⃣ Install Dependencies */
        stage('Install Dependencies') {
            steps {
                sh '''
                  node -v
                  npm -v
                  rm -rf node_modules package-lock.json
                  npm install --legacy-peer-deps
                '''
            }
        }

        /* 3️⃣ Code Quality Scan (SonarQube) */
        stage('SonarQube Scan') {
            environment {
                SONAR_TOKEN = credentials('sonar-token')
            }
            steps {
                sh '''
                  npx sonar-scanner \
                    -Dsonar.projectKey=${SONAR_PROJECT} \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=${SONAR_HOST_URL} \
                    -Dsonar.token=${SONAR_TOKEN}
                '''
            }
        }

        /* 4️⃣ Security Scan (Trivy) */
        stage('Trivy Security Scan') {
            steps {
                sh '''
                  trivy fs . \
                    --severity HIGH,CRITICAL \
                    --exit-code 0
                '''
            }
        }

        /* 5️⃣ Build Application */
        stage('Build Application') {
            steps {
                sh '''
                  npm run build
                '''
            }
        }

        /* 6️⃣ Deploy to Physical Server (Release-based) */
        stage('Deploy') {
            steps {
                sh '''
                  mkdir -p ${RELEASES_DIR} ${CURRENT_DIR} ${BACKUP_DIR}

                  # Backup current
                  if [ -d "${CURRENT_DIR}" ] && [ "$(ls -A ${CURRENT_DIR})" ]; then
                    rm -rf ${BACKUP_DIR}/*
                    cp -r ${CURRENT_DIR}/* ${BACKUP_DIR}/
                  fi

                  # Create new release
                  RELEASE_PATH=${RELEASES_DIR}/${RELEASE_NAME}
                  mkdir -p ${RELEASE_PATH}
                  cp -r build/* ${RELEASE_PATH}/

                  # Switch current to new release
                  rm -rf ${CURRENT_DIR}/*
                  cp -r ${RELEASE_PATH}/* ${CURRENT_DIR}/
                '''
            }
        }

        /* 7️⃣ Restart with PM2 */
        stage('Restart with PM2') {
            steps {
                sh '''
                  pm2 stop ${APP_NAME} || true
                  pm2 start ecosystem.config.js --name ${APP_NAME}
                  pm2 save
                '''
            }
        }

        /* 8️⃣ Health Check */
        stage('Health Check') {
            steps {
                sh '''
                  sleep 10
                  curl -f ${HEALTH_URL}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful using release ${RELEASE_NAME}"
        }
        failure {
            echo "❌ Deployment failed — previous version still available in backup"
        }
    }
}
