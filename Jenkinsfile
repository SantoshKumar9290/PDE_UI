pipeline {
    agent any

    environment {
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

        stage('Capture Commit Info') {
            steps {
                script {
                    def commitId = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                    def author   = sh(script: "git log -1 --pretty=format:%an", returnStdout: true).trim()
                    def message  = sh(script: "git log -1 --pretty=format:%s", returnStdout: true).trim()

                    writeFile file: 'commit-info.txt', text: """
Commit ID     : ${commitId}
Commit Author : ${author}
Commit Message: ${message}
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
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'sonar-scanner'
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=PED_UI \
                          -Dsonar.sources=.
                        """
                    }
                }
            }
        }

        stage('Deploy to Application Server') {
            steps {
                sh """
                echo "Deploying to ${APP_SERVER}"

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
            echo "✅ SUCCESS: Build + SonarQube + Deploy completed"
        }
        failure {
            echo "❌ FAILED: Check Jenkins logs"
        }
    }
}
