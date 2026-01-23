pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://10.10.120.20:9000"
        SONAR_TOKEN = credentials('jenkins-token')
        APP_NAME = "PDE_UI"
        APP_SERVER = "10.10.120.189"
        APP_PATH = "/opt/PDE_UI"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/SantoshKumar9290/PDE_UI.git'
            }
        }

        stage('Capture Commit & Trigger Info') {
            steps {
                script {
                    def commitId = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                    def author   = sh(script: "git log -1 --pretty=format:%an", returnStdout: true).trim()
                    def email    = sh(script: "git log -1 --pretty=format:%ae", returnStdout: true).trim()
                    def message  = sh(script: "git log -1 --pretty=format:%s",  returnStdout: true).trim()
                    def trigger  = currentBuild.getBuildCauses().toString()

                    echo """
==============================
 DEPLOYMENT AUDIT DETAILS
 Commit ID      : ${commitId}
 Commit Author  : ${author}
 Author Email   : ${email}
 Commit Message : ${message}
 Build Trigger  : ${trigger}
==============================
"""

                    writeFile file: 'commit-info.txt', text: """
Commit ID      : ${commitId}
Commit Author  : ${author}
Author Email   : ${email}
Commit Message : ${message}
Build Trigger  : ${trigger}
"""
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh "npm install --force"
            }
        }

        stage('Clean Previous Build') {
            steps {
                sh "rm -rf .next"
            }
        }

        stage('Build Next.js App') {
            steps {
                sh "npm run build"
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('Sonar-jenkins-token') {
                    sh """
                    /opt/sonarscanner/sonar-scanner-*/bin/sonar-scanner \
                    -Dsonar.projectKey=pde_ui \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=${SONAR_HOST_URL} \
                    -Dsonar.login=${SONAR_TOKEN}
                    """
                }
            }
        }

        /* 🚀 DEPLOY TO APPLICATION SERVER */
        stage('Deploy to Application Server (10.10.120.189)') {
            steps {
                sh """
                echo "Deploying to Application Server ${APP_SERVER}"

                rsync -avz --delete \
                  .next package.json ecosystem.config.js commit-info.txt \
                  root@${APP_SERVER}:${APP_PATH}/

                ssh root@${APP_SERVER} << EOF
                  cd ${APP_PATH}
                  pm2 delete PDE-UI || true
                  pm2 delete ${APP_NAME} || true
                  pm2 start ecosystem.config.js
                  pm2 save
                EOF
                """
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'commit-info.txt'
            echo "SUCCESS: Build on Jenkins + Deploy on App Server completed"
        }
        failure {
            echo "FAILED: Check Jenkins logs"
        }
    }
}
