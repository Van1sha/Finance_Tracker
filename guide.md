# Comprehensive AWS Deployment Guide (Jenkins in Docker + Webhooks)

This document provides all the necessary steps to deploy your Employee Management System on an AWS EC2 instance. We will run Jenkins **inside a Docker container**, which is an excellent best practice because it keeps your server clean, makes upgrades easy, and simplifies backups.

## Phase 1: Connect to your AWS EC2 Instance

1. Go to the AWS Console and launch an **Ubuntu 24.04 LTS** EC2 instance (t2.medium is recommended).
2. Configure the Security Group to allow inbound traffic on:
   - **Port 22** (SSH)
   - **Port 80/443** (HTTP/HTTPS for your app)
   - **Port 8080** (Jenkins Web UI)
3. Download the `.pem` key file during instance creation.
4. Open your local terminal, change permissions on your key file, and connect via SSH:

```bash
# Navigate to the folder where your key is downloaded (e.g., Downloads)
cd ~/Downloads

# Restrict permissions on your key file
chmod 400 your-key-pair.pem

# Connect to the EC2 instance
ssh -i "your-key-pair.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

---

## Phase 2: Install Docker on EC2

Since we are running Jenkins *in* Docker, we only need to install Docker and Docker Compose on the host machine. Run these commands on your EC2 instance:

```bash
# 1. Update the system
sudo apt update -y

# 2. Install Docker
sudo apt install docker.io -y

# 3. Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# 4. Install Docker Compose
sudo apt install docker-compose -y

# 5. Add your user ('ubuntu') to the docker group so you don't need 'sudo'
sudo usermod -aG docker ubuntu
```
*(Important: Type `exit` to log out of your EC2 instance, and then SSH back in so your `ubuntu` user picks up the new Docker permissions).*

---

## Phase 3: Run Jenkins inside Docker

To allow Jenkins to build your project's Docker containers, it needs access to the host's Docker socket and the Docker CLI. 

1. Create a custom Dockerfile for Jenkins. Run this command to create the file:
```bash
cat << 'EOF' > Dockerfile.jenkins
FROM jenkins/jenkins:lts
USER root
# Install Docker CLI and Docker Compose inside the Jenkins container
RUN apt-get update && apt-get install -y docker.io docker-compose
RUN usermod -aG docker jenkins
USER jenkins
EOF
```

2. Build the custom Jenkins image:
```bash
docker build -t custom-jenkins -f Dockerfile.jenkins .
```

3. Run the Jenkins container (Mounting the docker socket allows Jenkins to spin up containers on the EC2 host):
```bash
docker run -d \
  --name jenkins \
  --restart always \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  custom-jenkins
```

4. Retrieve the initial Administrator Password:
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
*(Copy this password for the next step).*

---

## Phase 4: Configure Jenkins via the Web UI

1. Open your web browser and navigate to: `http://16.171.9.72:8080`
2. Paste the password you copied in the previous step and click **Continue**.
3. Click **Install suggested plugins** and wait for the installation to finish.
4. Create your First Admin User when prompted.

### Install Additional Plugins
1. In Jenkins, go to **Manage Jenkins** -> **Plugins** -> **Available plugins**.
2. Search for and install:
   - **Docker Pipeline**
   - **Yet Another Docker** (Provides docker Cloud provisioning in jenkins)
3. Check the box to restart Jenkins after installation.

---

## Phase 5: Create the Jenkins Pipeline Job

1. Go to the Jenkins Dashboard and click **New Item**.
2. Enter a name (e.g., `EMS-Deployment`), select **Pipeline**, and click **OK**.
3. Under the **Build Triggers** section, check the box for:
   - **GitHub hook trigger for GITScm polling**
4. Under the **Pipeline** section:
   - Definition: Choose **Pipeline script from SCM**
   - SCM: Choose **Git**
   - Repository URL: Enter your GitHub repository URL (e.g., `https://github.com/yourusername/Management.git`)
   - Branch Specifier: `*/main` (or whichever branch you push to)
   - Script Path: `Jenkinsfile`
5. Click **Save**.

### Configure Environment Secrets in Jenkins
Since the application relies on environment variables (like `JWT_SECRET`, MongoDB URIs, etc.), you must inject these securely:
1. From the Jenkins Dashboard, go to **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials (unrestricted)**.
2. Click **Add Credentials**.
3. Set the **Kind** to **Secret file** (to upload a full `.env` file) or **Secret text**.
4. Enter or upload your secrets. *(Note: If your `JWT_SECRET` or any other secret contains a dollar sign `$`, remember to escape it with `$$` in your `docker-compose.yml` or Docker Compose will try to parse it!)*
5. Set an **ID** (e.g., `PROD_ENV_FILE`) and click **Create**.
6. Ensure your `Jenkinsfile` uses the `withCredentials` block to bind this secret into your build environment.

---

## Phase 6: Setup GitHub Webhooks

1. Go to your repository on GitHub.com.
2. Click on **Settings** -> **Webhooks** -> **Add webhook**.
3. **Payload URL:** Enter your Jenkins webhook URL:
   `http://<YOUR_EC2_PUBLIC_IP>:8080/github-webhook/`
   *(CRITICAL: Ensure you include the trailing slash `/` at the end)*
4. **Content type:** Select `application/json`.
5. **Which events would you like to trigger this webhook?** Select **Just the push event**.
6. Click **Add webhook**.

---

## Phase 7: Push the Code

A `Jenkinsfile` has been created in your project root. Once you commit and push your code to GitHub, the webhook will notify Jenkins, which will automatically run the pipeline to build and deploy your Docker containers using Docker Compose!

---

## Phase 8: Troubleshooting & Best Practices

During deployment, you may encounter resource or configuration issues. Here are common solutions:

1. **Memory Constraints (OOM Kills):** EC2 instances (like t2.micro or t2.medium) might run out of memory during Jenkins builds. Consider adding **Swap Space** to your instance to prevent the builds from crashing.
2. **Disk Space Issues:** Failed or frequent Docker builds can quickly consume all disk space. Regularly run `docker system prune -af` or set up a cron job to clean up unused images and containers.
3. **SSH Issues:** If SSH hangs or fails silently, verify your Security Group allows port 22 and your `.pem` key permissions are set to `400` (`chmod 400 your-key-pair.pem`).

For a detailed log of past issues and their resolutions, please refer to the [Troubleshooting Guide](TROUBLESHOOTING.md).