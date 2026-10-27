# EC2 & AWS ECR Minimal Deployment Guide

This setup builds the Docker image, pushes it to **Amazon ECR**, creates the `.env` file on **EC2 at runtime**, and runs the container on **port 5010**.

---

## 1. Required GitHub Repository Secrets

Add these secrets in GitHub under **Settings** > **Secrets and variables** > **Actions**:

| Secret Name | Value Description | Example |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key (with ECR permissions) | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Key | `wJalrXUtnFEMI/K7MDENG/...` |
| `AWS_REGION` | AWS Region of your ECR repo | `ap-south-1` or `us-east-1` |
| `ECR_REPOSITORY` | Name of your ECR repository | `ecommerce-platform-api` |
| `EC2_HOST` | Public IP or DNS of your EC2 instance | `13.233.xx.xx` |
| `EC2_USER` | EC2 SSH username | `ubuntu` or `ec2-user` |
| `EC2_SSH_KEY` | Contents of your EC2 private key (`.pem`) | `-----BEGIN RSA PRIVATE KEY-----...` |
| `ENV_FILE` | Complete contents of your production `.env` file | *(See below)* |

### Example for `ENV_FILE` Secret
Paste your full production configuration directly into the `ENV_FILE` secret:
```env
NODE_ENV=production
PORT=5010
JWT_SECRET=your_jwt_secret_key
DB_DIALECT=mysql
DB_HOST=your-db-host
DB_NAME=ecom_prod
DB_USER=root
DB_PASSWORD=your_db_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Support <support@yourdomain.com>"
WEBSITE_URL=http://your-ec2-ip:5010
ADMIN_URL=http://your-ec2-ip:5010
```

---

## 2. One-Time EC2 Setup

On your EC2 instance, you only need Docker:

```bash
# Install Docker (Ubuntu)
sudo apt update && sudo apt install -y docker.io
sudo usermod -aG docker $USER
newgrp docker

# In AWS EC2 Security Group:
# Open Inbound Port 5010 (Custom TCP, 0.0.0.0/0)
# Open Inbound Port 22 (SSH)
```

---

## 3. How the Pipeline Works

On push to `main`:
1. **GitHub Actions** builds the Docker image and pushes it to your ECR repo.
2. **GitHub Actions** connects to your EC2 via SSH:
   - Writes the `.env` file at runtime from `secrets.ENV_FILE`.
   - Logs into AWS ECR.
   - Pulls the latest image.
   - Replaces the container:
     ```bash
     docker run -d --name ecommerce-api --restart unless-stopped -p 5010:5010 --env-file .env -v ~/uploads:/app/public/uploads <ECR_IMAGE>
     ```
