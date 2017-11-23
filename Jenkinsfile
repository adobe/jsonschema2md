pipeline {
    agent any
    environment {
        PATH = "/apps/java/latest/bin:/apps/node/node-v6.11.4-linux-x64/bin:$PATH"
    }

    stages {
        stage('Show Environment') {
            steps {
                sh "env"
                sh "node --version"
                sh "npm --version"
            }
        }
        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }
        stage('Test') {
            steps {
                sh "npm test"
            }
        }
    }
}
