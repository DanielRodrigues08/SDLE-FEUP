#!/bin/bash

# Function to restart Nginx based on the operating system
restart_nginx() {
    # Detect the operating system
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo service nginx restart
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sudo brew services restart nginx
    else
        echo "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# Extract the conf-path variable value
nginx_conf_path=$(nginx -V 2>&1 | grep -oE --color=auto "conf-path=.*" | cut -d '=' -f 2)

if [ -z "$nginx_conf_path" ]; then
    echo "Nginx configuration file path not found."
    exit 1
fi

# Copy the Nginx configuration file to the appropriate directory
sudo cp nginx/nginx.conf "$nginx_conf_path"

# Restart Nginx
restart_nginx
