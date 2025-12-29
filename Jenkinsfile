pipeline {
    agent any

    tools {
        nodejs 'Node16'
    }

    environment {
        NODE_ENV = 'production'
        SONAR_SCANNER_HOME = tool 'SonarScanner'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git credentialsId: 'github-cred',
                    url: 'https://github.com/SantoshKumar9290/PDE_UI.git',
                    branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Node Version:"
                    node -v
                    npm -v

                    rm -rf node_modules package-lock.json
                    npm install --legacy-peer-deps
                '''
            }
        }

        stage('Build UI') {
            steps {
                sh 'npm run build'
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
                    if ! command -v pm2 >/dev/null 2>&1; then
                        sudo npm install -g pm2
                    fi

                
                    pm2 start ecosystem.config.js --name pde_ui
                    pm2 save
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build, Scan & Deployment Successful"
        }
        failure {
            echo "❌ Pipeline Failed"
        }
        always {
            echo "Job: ${env.JOB_NAME}"
            echo "Build: ${env.BUILD_NUMBER}"
            echo "Status: ${currentBuild.currentResult}"
        }
    }
}

