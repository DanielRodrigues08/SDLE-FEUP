#!/bin/bash

# Step 1: Install OpenSSL
sudo apt-get update
sudo apt-get install -y openssl

# Step 2: Generate a Private Key
openssl genpkey -algorithm RSA -out private-key.pem

# Step 3: Generate a Certificate Signing Request (CSR)
openssl req -new -key private-key.pem -out csr.pem

# Step 4: Create a Self-Signed Certificate
openssl x509 -req -days 365 -in csr.pem -signkey private-key.pem -out certificate.crt

# Step 5: Add the Certificate to the System
sudo cp certificate.crt /usr/local/share/ca-certificates/certificate.crt
sudo update-ca-certificates

# Step 6: Verify the Certificate Installation
ls /etc/ssl/certs | grep certificate.crt

echo "Certificate creation and installation completed successfully."