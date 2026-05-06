pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'finance-tracker-app'
        CONTAINER_NAME = 'finance-tracker-container'
        PORT = '80' // Host port where the app will be accessible
    }

    stages {
        stage('Checkout') {
            steps {
                // Pulls code from GitHub (based on the SCM configuration in your Jenkins job)
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image..."
                    // Build the Docker image from the Dockerfile
                    // Note: If Jenkins is running directly on Windows, replace 'sh' with 'bat'
                    sh "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }
        
        stage('Deploy and Run Application') {
            steps {
                script {
                    echo "Deploying Docker Container..."
                    
                    // Stop and remove the existing container if it exists
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                    
                    // Run the newly built container
                    sh "docker run -d -p ${PORT}:80 --name ${CONTAINER_NAME} ${DOCKER_IMAGE}:latest"
                }
            }
        }
    }
    
    post {
        success {
            echo "CI/CD Pipeline executed successfully! The application is running on port ${PORT}."
        }
        failure {
            echo "Pipeline failed. Please check the logs."
        }
    }
}
