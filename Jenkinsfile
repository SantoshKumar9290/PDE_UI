pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://10.10.120.20:9000"
        SONAR_TOKEN = credentials('jenkins-token')
        APP_NAME = "PDE_UI"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/SantoshKumar9290/PDE_UI.git'
            }
        }

        /* 🔴 NEW STAGE – LAST COMMIT DEVELOPER INFO */
        stage('Capture Last Commit Info') {
            steps {
                script {
                    def commitId = sh(
                        script: "git rev-parse HEAD",
                        returnStdout: true
                    ).trim()

                    def author = sh(
                        script: "git log -1 --pretty=format:'%an'",
                        returnStdout: true
                    ).trim()

                    def email = sh(
                        script: "git log -1 --pretty=format:'%ae'",
                        returnStdout: true
                    ).trim()

                    def message = sh(
                        script: "git log -1 --pretty=format:'%s'",
                        returnStdout: true
                    ).trim()

                    echo "=============================="
                    echo " LAST COMMIT DETAILS"
                    echo " Commit ID : ${commitId}"
                    echo " Developer : ${author}"
                    echo " Email     : ${email}"
                    echo " Message   : ${message}"
                    echo "=============================="

                    writeFile file: 'commit-info.txt', text: """
Commit ID : ${commitId}
Developer : ${author}
Email     : ${email}
Message   : ${message}
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

        stage('PM2 Cluster Deployment') {
            steps {
                sh """
                    pm2 delete PDE-UI || true
                    pm2 delete ${APP_NAME} || true
                    pm2 start ecosystem.config.js
                    pm2 save
                """
            }
        }

    } // stages end

    post {
        success {
            archiveArtifacts artifacts: 'commit-info.txt'
            echo "SUCCESS: Build & Deploy done"
        }
        failure {
            echo "FAILED: Check pipeline logs"
        }
    }
}
