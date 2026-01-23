pipeline {
    agent any

    environment {
        // SonarQube
        SONAR_HOST_URL = "http://10.10.120.20:9000"
        SONAR_TOKEN    = credentials('jenkins-token')

        // App details
        APP_NAME    = "PDE_UI"
        APP_SERVER  = "10.10.120.189"
        APP_PATH    = "/opt/PDE_UI"
        DEPLOY_USER = "jenkins"
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
                    sh '''
                    /opt/sonarscanner/sonar-scanner-*/bin/sonar-scanner \
                    -Dsonar.projectKey=pde_ui \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=$SONAR_HOST_URL \
                    -Dsonar.token=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Deploy to Application Server (10.10.120.189)') {
            steps {
                sh """
                echo "Deploying to ${APP_SERVER} as ${DEPLOY_USER}"

                rsync -avz --delete \
                  .next package.json ecosystem.config.js commit-info.txt \
                  ${DEPLOY_USER}@${APP_SERVER}:${APP_PATH}/

                ssh ${DEPLOY_USER}@${APP_SERVER} << EOF
                  cd ${APP_PATH}
                  pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
                  pm2 save
                EOF
                """
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'commit-info.txt'
            echo "SUCCESS: Build + Sonar + Deploy completed"
        }
        failure {
            echo "FAILED: Check Jenkins logs"
        }
    }
}
