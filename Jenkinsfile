pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Pulling latest commit from GitHub...'
                checkout scm
            }
        }

        stage('2. Build & Deploy Container') {
           steps {
                echo 'Checking server.js content in workspace:'
                sh 'cat server.js'
                echo 'Building fresh Docker container...'
                sh 'docker rm -f node-container || true'
                sh 'docker build --no-cache -t node-app:latest .'
                sh 'docker run -d -p 3000:3000 --name node-container node-app:latest'
            }
        }

        stage('3. Configuration Management (Ansible)') {
            steps {
                echo 'Running Ansible Host Verification...'
                sh 'ansible-playbook ansible/deploy.yml || echo "Ansible execution skipped/completed"'
            }
        }

        stage('4. Automated Integration Testing') {
            steps {
                echo 'Executing Automated Verification Tests...'
                sh 'sleep 6' // Wait for Node.js container startup
                sh 'python3 tests/test_app.py'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully! Website updated on http://localhost:3000'
        }
        failure {
            echo '❌ Pipeline failed! Please inspect stage logs.'
        }
    }
}