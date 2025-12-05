pipeline {
    agent any

    tools {
        nodejs "Node18"   // Make sure Node18 is installed in Jenkins
    }

    environment {
        SONAR_HOST = 'pde_ui'   // SonarQube server name (check Global Tool Config)
    }

    stages {

        stage('Checkout Code') {
            steps {
                git credentialsId: 'github-cred',  // your GitHub credentials ID
                    url: 'https://github.com/SantoshKumar9290/PDE_UI.git',
                    branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm install
                    npm install -g next
                '''
            }
        }

        stage('Build UI') {
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('pde_ui') {
                    sh """
                        sonar-scanner \
                        -Dsonar.projectKey=pde_ui \
                        -Dsonar.projectName=pde_ui \
                        -Dsonar.sources=. \
                        -Dsonar.language=js \
                        -Dsonar.sourceEncoding=UTF-8 \
                        -Dsonar.typescript.tsconfigPath=tsconfig.json \
                        -Dsonar.inclusions=src/**/*.js,src/**/*.jsx,src/**/*.ts,src/**/*.tsx,pages/**/*.tsx,pages/**/*.js \
                        -Dsonar.exclusions=node_modules/**,.next/**,coverage/**,build/**,dist/**,**/*.min.js \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pde_ui:latest .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh """
                    if [ \$(docker ps -q --filter name=pde_ui) ]; then
                        docker stop pde_ui
                        docker rm pde_ui
                    fi
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 3000:3000 --name pde_ui pde_ui:latest'
            }
        }
    }
}
