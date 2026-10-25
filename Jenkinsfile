
pipeline {
    agent any

    tools {
        nodejs 'NodeJS26'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci --prefix backend'
                sh 'npm ci --prefix frontend'
                sh 'npm run build --prefix frontend'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test --prefix backend'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Docker image build will be enabled after configuring Docker access.'
            }
        }

        stage('Deploy') {
            steps {
                echo 'AWS EC2 deployment will be configured later.'
            }
        }
    }
}
