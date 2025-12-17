pipeline {
    agent any

    tools {
        nodejs "Node16"
    }

    environment {
        NODEJS_HOME = "/var/lib/jenkins/tools/hudson.plugins.nodejs.NodeJSInstallation/Node16"
        PATH = "${NODEJS_HOME}/bin:${PATH}"
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
                    echo "Node version:"
                    node -v
                    npm -v
                    which node

                    rm -rf node_modules package-lock.json
                    npm install --legacy-peer-deps
                '''
            }
        }

        stage('Build UI') {
            steps {
                sh '''
                    npm run build
                '''
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('pde_ui') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=pde_ui \
                        -Dsonar.projectName=pde_ui \
                        -Dsonar.sources=. \
                        -Dsonar.language=js \
                        -Dsonar.sourceEncoding=UTF-8
                    '''
                }
            }
        }

        stage('PM2 Deploy') {
            steps {
                sh '''
                    if ! command -v pm2 >/dev/null 2>&1; then
                        sudo npm install -g pm2
                    fi

                    pm2 delete pde_ui || true
                    pm2 start "npm run start:pm2" --name "pde_ui"
                    pm2 save
                    pm2 list
                '''
            }
        }
    }
}
