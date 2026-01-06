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
        BACKUP_DIR = "/opt/apps/frontend/backup"
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

        stage('Deploy & Install Prod Deps') {
            steps {
                sh '''
                  set -e
                  mkdir -p $CURRENT_DIR $RELEASES_DIR $BACKUP_DIR

                  if [ "$(ls -A $CURRENT_DIR 2>/dev/null)" ]; then
                    rm -rf $BACKUP_DIR/*
                    cp -r $CURRENT_DIR/* $BACKUP_DIR/
                  fi

                  RELEASE_NAME=$(date +%Y%m%d%H%M%S)
                  RELEASE_PATH=$RELEASES_DIR/$RELEASE_NAME
                  mkdir -p $RELEASE_PATH

                  cp -r .next public package.json package-lock.json ecosystem.config.js $RELEASE_PATH/

                  cd $RELEASE_PATH
                  npm install --production --legacy-peer-deps

                  rm -rf $CURRENT_DIR/*
                  cp -r $RELEASE_PATH/* $CURRENT_DIR/
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
