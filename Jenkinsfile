pipeline {
    agent any

    tools {
        nodejs "node20"   // Jenkins NodeJS installation name
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Khajasyed73/PDE_UI.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('Archive Build Artifacts') {
            steps {
                archiveArtifacts artifacts: '.next/**', fingerprint: true
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
