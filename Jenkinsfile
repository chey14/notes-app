
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
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
                sh 'docker build -t notes-app-backend:latest ./backend'
                sh 'docker build -t notes-app-frontend:latest ./frontend'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment to AWS EC2 will be configured next.'
            }
        }
    }
}
