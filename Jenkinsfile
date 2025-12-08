pipeline {
    agent any

    tools {
        nodejs "Node16"        // Using Node.js v16 (your server version)
    }

    environment {
        SONAR_HOST = 'pde_ui'
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

        stage('PM2 Deploy') {
            steps {
                sh '''
                    # Install pm2 if missing
                    if ! command -v pm2 >/dev/null 2>&1; then
                        sudo npm install -g pm2
                    fi

                    npm install
                    npm run build

                    # Stop previous app
                    pm2 delete pde_ui || true

                    # Start new app
                    pm2 start npm --name "pde_ui" -- run start

                    # Save pm2
                    pm2 save

                    # Show pm2 running processes
                    pm2 list
                '''
            }
        }
    }
}
