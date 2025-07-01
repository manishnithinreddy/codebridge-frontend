#!/usr/bin/env python3
"""
SPA Server for Angular Applications
Serves index.html for all routes that don't correspond to actual files
"""

import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash
        if path.startswith('/'):
            path = path[1:]
        
        # If path is empty, serve index.html
        if not path:
            path = 'index.html'
        
        # Check if the requested file exists
        if os.path.exists(path) and os.path.isfile(path):
            # File exists, serve it normally
            return super().do_GET()
        else:
            # File doesn't exist, check if it's a potential route
            # For Angular routes, serve index.html
            if not '.' in os.path.basename(path):
                # This looks like a route (no file extension), serve index.html
                self.path = '/index.html'
                return super().do_GET()
            else:
                # This looks like a missing file, return 404
                return super().do_GET()

def run_spa_server(port=4200, directory=None):
    if directory:
        os.chdir(directory)
    
    with socketserver.TCPServer(("", port), SPAHandler) as httpd:
        print(f"🚀 SPA Server running at http://localhost:{port}")
        print(f"📁 Serving directory: {os.getcwd()}")
        print("✅ Angular routing enabled - all routes will serve index.html")
        httpd.serve_forever()

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4200
    directory = sys.argv[2] if len(sys.argv) > 2 else None
    run_spa_server(port, directory)

