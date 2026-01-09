pipeline {
    agent any

    tools {
        nodejs "node16"
    }

    environment {
        SONARQUBE = "sonarqube-server"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git credentialsId: 'github-cred',
                    url: 'https://github.com/<your-repo-path>.git',
                    branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t nodeapp:latest .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh """
                    if [ \$(docker ps -q --filter name=nodeapp) ]; then
                        docker stop nodeapp
                        docker rm nodeapp
                    fi
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 3000:3000 --name nodeapp nodeapp:latest'
            }
        }
    }
}
