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
nginx_conf_path=$(nginx -V 2>&1 | grep -oE "conf-path=[^ ]*" | cut -d '=' -f 2)
echo "$nginx_conf_path"
if [ -z "$nginx_conf_path" ]; then
    echo "Nginx configuration file path not found."
    exit 1
fi

# Copy the Nginx configuration file to the appropriate directory
sudo cp backup.conf "$nginx_conf_path"
if [ $? -ne 0 ]; then
    echo "Error copying Nginx configuration file."
    exit 1
fi

# Display the contents of the copied configuration file
cat "$nginx_conf_path"

# Restart Nginx
restart_nginx
