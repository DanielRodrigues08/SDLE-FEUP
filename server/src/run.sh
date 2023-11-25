
num_instances=$1
base_port=4000


node_servers=()

for ((i=0; i<num_instances; i++)); do
  node_servers+=("http://localhost:$((base_port + i))")
done


echo "Starting main server on port 3000"
node server.js $num_instances "${node_servers[@]}"&

sleep 1

# Specify the number of instances you want to run

# Loop through the instances and run the servers
for ((i=0; i<num_instances; i++)); do
  current_port=$((base_port + i))
  echo "Starting node instance $i on port $current_port"
  # Replace the following command with the command to start your server
  node node.js $current_port $i $num_instances "${node_servers[@]}"&
done

# Wait for background processes to finish
wait
echo "All server instances have started"