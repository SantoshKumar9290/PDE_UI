pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://10.10.120.20:9000"
        SONAR_TOKEN = credentials('jenkins-token')
        DOCKER_IMAGE = "pde_ui_app"
        REGISTRY = "docker.io/library"
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
                npm install
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh '''
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
                docker build -t $DOCKER_IMAGE:latest .
                docker tag $DOCKER_IMAGE:latest $REGISTRY/$DOCKER_IMAGE:latest
                docker push $REGISTRY/$DOCKER_IMAGE:latest
                '''
            }
        }

        stage('PM2 Deploy (Cluster Mode)') {
            steps {
                sh '''
                pm2 delete PDE-UI || true

cat <<EOF > ecosystem.config.js
module.exports = {
  apps: [{
    name: "PDE-UI",
    script: "npm",
    args: "start",
    exec_mode: "cluster",
    instances: "max",
    watch: false
  }]
}
EOF

                pm2 start ecosystem.config.js

                pm2 save
                pm2 status
                '''
            }
        }
    }

    post {
        success {
            echo "SUCCESS: Sonar + Docker + PM2 Cluster Deployment Completed!"
        }
        failure {
            echo "ERROR: Pipeline Failed!"
        }
    }
}
