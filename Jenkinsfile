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

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                sh '''
                  npx sonar-scanner \
                    -Dsonar.projectKey=pde_ui \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://10.10.120.20:9000 \
                    -Dsonar.token=sqp_abc57ecbb8de50c0399ed8f26091028e306baa8d
                '''
            }
        }

        stage('Build Application') {
            steps {
                sh '''
                  if grep -q "\"build\"" package.json; then
                    npm run build
                  else
                    echo "No build script found – skipping"
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
}
