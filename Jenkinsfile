pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://10.10.120.20:9000"
        SONAR_TOKEN = credentials('sonar-token')
        DOCKER_IMAGE = "pde_ui_app"
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
                    echo "Installing npm packages..."
                    npm install
                '''
            }
        }

        stage('Build Next.js App') {
            steps {
                sh '''
                    echo "Running Next.js Build..."
                    npm run build
                    npm start
                '''
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''
                        echo "Running SonarQube Scanner..."
                        sonar-scanner \
                        -Dsonar.projectKey=PDE_UI \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker Image..."
                    docker build -t ${DOCKER_IMAGE}:latest .
                '''
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                    echo "Stopping old container if exists..."
                    docker rm -f pde_ui || true

                    echo "Starting new container..."
                    docker run -d --name pde_ui -p 3000:3000 ${DOCKER_IMAGE}:latest
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 Build, Scan & Deployment Successful!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs!"
        }
    }
}

