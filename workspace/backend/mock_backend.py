#!/usr/bin/env python3
"""
Mock Backend Server for CodeBridge Frontend Demo
This server provides mock API endpoints that the Angular frontend can connect to.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import uuid
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock data
mock_projects = [
    {
        "id": "proj-1",
        "name": "E-commerce API",
        "description": "REST API for online shopping platform",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-06-20T14:45:00Z",
        "status": "active",
        "collections_count": 5,
        "environments_count": 3
    },
    {
        "id": "proj-2", 
        "name": "User Management Service",
        "description": "Microservice for user authentication and authorization",
        "created_at": "2024-02-10T09:15:00Z",
        "updated_at": "2024-06-25T16:20:00Z",
        "status": "active",
        "collections_count": 3,
        "environments_count": 2
    },
    {
        "id": "proj-3",
        "name": "Payment Gateway Integration",
        "description": "API integration with multiple payment providers",
        "created_at": "2024-03-05T11:00:00Z",
        "updated_at": "2024-06-28T13:30:00Z",
        "status": "draft",
        "collections_count": 7,
        "environments_count": 4
    }
]

mock_collections = [
    {
        "id": "col-1",
        "project_id": "proj-1",
        "name": "Products API",
        "description": "Product catalog management endpoints",
        "requests_count": 12,
        "created_at": "2024-01-20T10:00:00Z"
    },
    {
        "id": "col-2",
        "project_id": "proj-1", 
        "name": "Orders API",
        "description": "Order processing and management",
        "requests_count": 8,
        "created_at": "2024-01-25T14:30:00Z"
    },
    {
        "id": "col-3",
        "project_id": "proj-2",
        "name": "Authentication",
        "description": "Login, logout, and token management",
        "requests_count": 6,
        "created_at": "2024-02-15T09:45:00Z"
    }
]

mock_environments = [
    {
        "id": "env-1",
        "project_id": "proj-1",
        "name": "Development",
        "base_url": "https://dev-api.ecommerce.com",
        "variables": {
            "api_key": "dev_key_123",
            "timeout": "5000",
            "version": "v1"
        }
    },
    {
        "id": "env-2",
        "project_id": "proj-1",
        "name": "Production",
        "base_url": "https://api.ecommerce.com",
        "variables": {
            "api_key": "prod_key_456",
            "timeout": "3000",
            "version": "v1"
        }
    }
]

mock_api_requests = [
    {
        "id": "req-1",
        "collection_id": "col-1",
        "name": "Get All Products",
        "method": "GET",
        "url": "/api/v1/products",
        "headers": {"Content-Type": "application/json"},
        "body": None,
        "tests": ["Status code is 200", "Response contains products array"]
    },
    {
        "id": "req-2",
        "collection_id": "col-1",
        "name": "Create Product",
        "method": "POST",
        "url": "/api/v1/products",
        "headers": {"Content-Type": "application/json"},
        "body": {"name": "New Product", "price": 99.99, "category": "electronics"},
        "tests": ["Status code is 201", "Response contains product ID"]
    }
]

mock_docker_containers = [
    {
        "id": "container-1",
        "name": "nginx-web",
        "image": "nginx:latest",
        "status": "running",
        "ports": ["80:8080"],
        "created": "2024-06-28T10:00:00Z"
    },
    {
        "id": "container-2", 
        "name": "postgres-db",
        "image": "postgres:13",
        "status": "running",
        "ports": ["5432:5432"],
        "created": "2024-06-28T09:30:00Z"
    },
    {
        "id": "container-3",
        "name": "redis-cache",
        "image": "redis:alpine",
        "status": "stopped",
        "ports": ["6379:6379"],
        "created": "2024-06-27T15:20:00Z"
    }
]

# API Routes

@app.route('/')
def home():
    return jsonify({
        "service": "CodeBridge Mock Backend",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "projects": "/api/projects",
            "collections": "/api/collections", 
            "environments": "/api/environments",
            "requests": "/api/requests",
            "docker": "/api/docker/containers",
            "health": "/health"
        }
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "uptime": "2h 15m 30s"
    })

# Projects API
@app.route('/api/projects', methods=['GET'])
def get_projects():
    return jsonify({
        "success": True,
        "data": mock_projects,
        "total": len(mock_projects)
    })

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    project = next((p for p in mock_projects if p['id'] == project_id), None)
    if project:
        return jsonify({"success": True, "data": project})
    return jsonify({"success": False, "error": "Project not found"}), 404

# Collections API
@app.route('/api/collections', methods=['GET'])
def get_collections():
    project_id = request.args.get('project_id')
    collections = mock_collections
    if project_id:
        collections = [c for c in mock_collections if c['project_id'] == project_id]
    
    return jsonify({
        "success": True,
        "data": collections,
        "total": len(collections)
    })

@app.route('/api/collections/<collection_id>', methods=['GET'])
def get_collection(collection_id):
    collection = next((c for c in mock_collections if c['id'] == collection_id), None)
    if collection:
        return jsonify({"success": True, "data": collection})
    return jsonify({"success": False, "error": "Collection not found"}), 404

# Environments API
@app.route('/api/environments', methods=['GET'])
def get_environments():
    project_id = request.args.get('project_id')
    environments = mock_environments
    if project_id:
        environments = [e for e in mock_environments if e['project_id'] == project_id]
    
    return jsonify({
        "success": True,
        "data": environments,
        "total": len(environments)
    })

# API Requests
@app.route('/api/requests', methods=['GET'])
def get_requests():
    collection_id = request.args.get('collection_id')
    requests_data = mock_api_requests
    if collection_id:
        requests_data = [r for r in mock_api_requests if r['collection_id'] == collection_id]
    
    return jsonify({
        "success": True,
        "data": requests_data,
        "total": len(requests_data)
    })

# Docker API
@app.route('/api/docker/containers', methods=['GET'])
def get_docker_containers():
    return jsonify({
        "success": True,
        "data": mock_docker_containers,
        "total": len(mock_docker_containers)
    })

@app.route('/api/docker/containers/<container_id>/start', methods=['POST'])
def start_container(container_id):
    container = next((c for c in mock_docker_containers if c['id'] == container_id), None)
    if container:
        container['status'] = 'running'
        return jsonify({
            "success": True,
            "message": f"Container {container['name']} started successfully",
            "data": container
        })
    return jsonify({"success": False, "error": "Container not found"}), 404

@app.route('/api/docker/containers/<container_id>/stop', methods=['POST'])
def stop_container(container_id):
    container = next((c for c in mock_docker_containers if c['id'] == container_id), None)
    if container:
        container['status'] = 'stopped'
        return jsonify({
            "success": True,
            "message": f"Container {container['name']} stopped successfully",
            "data": container
        })
    return jsonify({"success": False, "error": "Container not found"}), 404

# Authentication API
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')
    
    # Mock authentication
    if username and password:
        token = f"mock_jwt_token_{uuid.uuid4().hex[:16]}"
        return jsonify({
            "success": True,
            "data": {
                "token": token,
                "user": {
                    "id": "user-1",
                    "username": username,
                    "email": f"{username}@example.com",
                    "role": "developer"
                },
                "expires_at": (datetime.now() + timedelta(hours=24)).isoformat()
            }
        })
    
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

# Test execution API
@app.route('/api/test/execute', methods=['POST'])
def execute_test():
    data = request.get_json()
    request_data = data.get('request', {})
    
    # Simulate test execution
    execution_time = random.randint(100, 2000)  # ms
    status_code = random.choice([200, 201, 400, 404, 500])
    
    result = {
        "success": True,
        "data": {
            "execution_id": str(uuid.uuid4()),
            "status": "completed",
            "execution_time_ms": execution_time,
            "response": {
                "status_code": status_code,
                "headers": {"Content-Type": "application/json"},
                "body": {"message": "Mock response", "timestamp": datetime.now().isoformat()},
                "size_bytes": 156
            },
            "tests": [
                {"name": "Status code is 200", "passed": status_code == 200},
                {"name": "Response time < 2000ms", "passed": execution_time < 2000}
            ]
        }
    }
    
    return jsonify(result)

# Analytics/Dashboard data
@app.route('/api/analytics/dashboard', methods=['GET'])
def get_dashboard_data():
    return jsonify({
        "success": True,
        "data": {
            "total_projects": len(mock_projects),
            "total_collections": len(mock_collections),
            "total_requests": len(mock_api_requests),
            "active_containers": len([c for c in mock_docker_containers if c['status'] == 'running']),
            "recent_activity": [
                {"action": "Test executed", "timestamp": "2024-06-28T14:30:00Z", "project": "E-commerce API"},
                {"action": "Collection created", "timestamp": "2024-06-28T13:15:00Z", "project": "User Management Service"},
                {"action": "Container started", "timestamp": "2024-06-28T12:45:00Z", "container": "nginx-web"}
            ],
            "test_results": {
                "passed": 45,
                "failed": 3,
                "total": 48,
                "success_rate": 93.75
            }
        }
    })

if __name__ == '__main__':
    print("🚀 Starting CodeBridge Mock Backend Server...")
    print("📡 Server will be available at: http://localhost:8084")
    print("📋 API Documentation available at: http://localhost:8084")
    print("🔍 Health check: http://localhost:8084/health")
    app.run(host='0.0.0.0', port=8084, debug=True)

