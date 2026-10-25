pipeline {
    agent any

    tools {
        nodejs 'Node20'
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
                sh '''
                    set -eu

                    docker rm -f notes-app-jenkins-test-db >/dev/null 2>&1 || true

                    docker run -d \
  			--network container:jenkins \
  			--name notes-app-jenkins-test-db \
 			 mongo:8

                    cleanup() {
                      docker rm -f notes-app-jenkins-test-db >/dev/null 2>&1 || true
                    }
                    trap cleanup EXIT

                    ready=0
                    for i in $(seq 1 30); do
                      if docker exec notes-app-jenkins-test-db \
                        mongosh --quiet --eval "db.adminCommand('ping').ok" \
                        2>/dev/null | grep -q 1; then
                        ready=1
                        break
                      fi
                      sleep 2
                    done

                    if [ "$ready" -ne 1 ]; then
                      echo "Test MongoDB failed to start"
                      docker logs notes-app-jenkins-test-db
                      exit 1
                    fi

                    MONGODB_URI=mongodb://127.0.0.1:27017/notesapp_test \
                      npm test --prefix backend
                '''
            }
        }

        
        stage('Docker Build') {
            steps {
                sh '''
                docker build -t notes-app-backend:latest ./backend
                docker build -t notes-app-frontend:latest ./frontend
                '''
            }
        }   


        stage('Deploy') {
            steps {
                echo 'AWS EC2 deployment will be configured next.'
            }
        }
    }

    post {
        always {
            sh 'docker rm -f notes-app-jenkins-test-db >/dev/null 2>&1 || true'
        }
    }
}
