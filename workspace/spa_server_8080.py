#!/usr/bin/env python3
"""
Simple SPA Server for Angular
Serves index.html for all routes that don't correspond to actual files
"""

import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL path
        parsed_path = urlparse(self.path)
        path = parsed_path.path.lstrip('/')
        
        print(f"Request path: {self.path} -> {path}")
        
        # If no path, serve index.html
        if not path:
            print("Serving index.html for root")
            self.path = '/index.html'
            return super().do_GET()
        
        # Check if the file exists
        if os.path.exists(path) and os.path.isfile(path):
            print(f"File exists: {path}")
            return super().do_GET()
        
        # Check if it's a static asset (has file extension)
        if '.' in os.path.basename(path):
            print(f"File request but doesn't exist: {path}")
            return super().do_GET()
        
        # It's a route request (no file extension), serve index.html
        print(f"Route request, serving index.html for: {path}")
        self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    PORT = 8080
    os.chdir('/tmp/manishnithinreddy/codebridge-frontend/workspace/frontend/dist/codebridge-frontend/browser')
    
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"🚀 SPA Server running at http://localhost:{PORT}")
        print(f"📁 Serving: {os.getcwd()}")
        httpd.serve_forever()

