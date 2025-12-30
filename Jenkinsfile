pipeline {
    agent any

    tools {
        nodejs 'Node16'
    }

    environment {
        NODE_ENV = 'production'
        SONAR_SCANNER_HOME = tool 'SonarScanner'
        PM2_HOME = "/var/lib/jenkins/.pm2"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-cred',
                    url: 'https://github.com/SantoshKumar9290/PDE_UI.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Node Version:"
                    node -v
                    npm -v

                    npm install
                '''
            }
        }

        stage('Build Application') {
            steps {
                sh '''
                    npm run build
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh '''
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=pde_ui \
                        -Dsonar.projectName=pde_ui \
                        -Dsonar.sources=. \
                        -Dsonar.sourceEncoding=UTF-8 \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Deploy with PM2') {
            steps {
                sh '''
                    pm2 delete pde_ui || true
                    pm2 start ecosystem.config.js
                    pm2 save
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build, Sonar & Deployment Successful"
        }
        failure {
            echo "❌ Build or Deployment Failed"
        }
        always {
            echo "Job: ${env.JOB_NAME}"
            echo "Build Number: ${env.BUILD_NUMBER}"
            echo "Status: ${currentBuild.currentResult}"
        }
    }
}
