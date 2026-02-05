pipeline {
    agent any

    tools {
        nodejs 'Node16'
    }

    environment {
        APP_NAME = "PDE_UI"
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
                    def message  = sh(script: "git log -1 --pretty=format:%s", returnStdout: true).trim()
                    def triggerInfo = currentBuild.getBuildCauses().toString()

                    writeFile file: 'commit-info.txt', text: """
Commit ID        : ${commitId}
Commit Author   : ${author}
Author Email    : ${email}
Commit Message  : ${message}
Build Trigger   : ${triggerInfo}
"""
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --force'
            }
        }

        stage('Clean Previous Build') {
            steps {
                sh 'rm -rf .next'
            }
        }

        stage('Build Next.js App') {
            steps {
                sh 'npm run build'
            }
        }

         stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('Sonar-jenkins-token') {
                    sh """
                        /opt/sonarscanner/sonar-scanner-*/bin/sonar-scanner \
                        -Dsonar.projectKey=PDE_UI \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('PM2 Cluster Deployment') {
            steps {
                sh '''
                    pm2 delete PDE-UI || true
                    pm2 delete PDE_UI || true
                    pm2 start ecosystem.config.js
                    pm2 save
                '''
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'commit-info.txt'
            echo 'SUCCESS: Build & Deployment Completed'
        }
        failure {
            echo 'FAILED: Check logs'
        }
    }
}

