pipeline {
    agent any

    environment {
        APP_SERVER = "10.10.120.189"
        APP_DIR    = "/var/www/pde_ui"
    }

    tools {
        nodejs "Node16"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/SantoshKumar9290/PDE_UI.git'
            }
        }

        stage('Verify Node Version') {
            steps {
                sh '''
                  echo "Node Version:"
                  node -v
                  echo "NPM Version:"
                  npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                sh '''
                  if grep -q "\"build\"" package.json; then
                    npm run build
                  else
                    echo "No build script found – skipping build"
                  fi
                '''
            }
        }

        stage('Deploy to Application Server') {
            steps {
                sh '''
                  ssh jenkins@${APP_SERVER} "mkdir -p ${APP_DIR}"
                  rsync -av --delete \
                    --exclude=node_modules \
                    ./ jenkins@${APP_SERVER}:${APP_DIR}/
                '''
            }
        }

        stage('Start Application using PM2') {
            steps {
                sh '''
                  ssh jenkins@${APP_SERVER} "
                    cd ${APP_DIR}
                    pm2 delete pde_ui || true
                    pm2 start npm --name pde_ui -- start
                    pm2 save
                  "
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully"
        }
        failure {
            echo "❌ Deployment failed – check logs"
        }
    }
}
