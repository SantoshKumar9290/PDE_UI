pipeline {
    agent any

    environment {
        APP_SERVER = "10.10.120.189"
        APP_DIR = "/var/www/pde_ui"
    }

    tools {
        nodejs "node16"   // name from Jenkins NodeJS tool config
    }

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/SantoshKumar9290/PDE_UI.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                    npx sonar-scanner \
                    -Dsonar.projectKey=PDE_UI \
                    -Dsonar.sources=. \
                    """
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build step"'
            }
        }

        stage('Deploy to App Server') {
            steps {
                sh """
                ssh jenkins@${APP_SERVER} '
                    mkdir -p ${APP_DIR}
                '
                scp -r * jenkins@${APP_SERVER}:${APP_DIR}/
                """
            }
        }

        stage('Start Application with PM2') {
            steps {
                sh """
                ssh jenkins@${APP_SERVER} '
                    cd ${APP_DIR}
                    pm2 delete pde_ui || true
                    pm2 start npm --name pde_ui -- start
                    pm2 save
                '
                """
            }
        }
    }

    post {
        success {
            echo "Deployment Successful"
        }
        failure {
            echo "Deployment Failed"
        }
    }
}
