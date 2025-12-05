pipeline {
  agent any
  tools { nodejs "Node18" } // make sure Node18 is configured in Jenkins

  environment {
    APP_NAME = "pde-ui"
    DEPLOY_USER = "root"               // change if different user
    DEPLOY_SERVER = "10.10.120.20"     // your server IP
    DEPLOY_PATH = "/var/www/pde-ui"
    SSH_CRED_ID = "server-ssh"         // Jenkins SSH credential ID (create this in Jenkins)
  }

  options { timestamps(); ansiColor('xterm') }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { sh 'npm install' }
    }

    stage('Build') {
      steps { sh 'npm run build' }
    }

    stage('Archive') {
      steps { archiveArtifacts artifacts: 'dist/**', fingerprint: true }
    }

    stage('Deploy via SSH + PM2') {
      steps {
        // sshagent requires SSH Agent plugin AND the credential 'server-ssh' configured
        sshagent (credentials: [env.SSH_CRED_ID]) {
          sh '''
            echo "Creating deploy directory..."
            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "mkdir -p ${DEPLOY_PATH}"
            echo "Copying files..."
            scp -r dist/* ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}
            echo "Starting PM2 serve..."
            ssh ${DEPLOY_USER}@${DEPLOY_SERVER} "
              cd ${DEPLOY_PATH} || exit 1
              pm2 stop ${APP_NAME} || true
              pm2 delete ${APP_NAME} || true
              # serve the static built UI on port 3000 and name it
              pm2 serve . 3000 --name ${APP_NAME} --spa
              pm2 save
            "
          '''
        }
      }
    }
  }

  post {
    success { echo "Pipeline finished successfully" }
    failure { echo "Pipeline failed — check console logs" }
  }
}
