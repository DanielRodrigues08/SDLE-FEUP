import http.server
import socketserver
import ssl

print("Yass")
# Set the path to the directory you want to serve
directory_to_serve = "."

# Set the port for your HTTPS server
port = 8080

# Specify the SSL/TLS certificate and key files
certfile = "certificate.crt"
keyfile = "private-key.pem"

# Create a custom handler to use the SSL context


class MyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=directory_to_serve, **kwargs)


# Create an SSL context
ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(certfile=certfile, keyfile=keyfile)

# Create the HTTPS server
with socketserver.TCPServer(("", port), MyHandler) as httpd:
    httpd.socket = ssl_context.wrap_socket(httpd.socket, server_side=True)
    print(f"Serving directory at https://localhost:{port}")
    httpd.serve_forever()
