#!/usr/bin/env python3
"""
API Communication Test for CodeBridge Frontend-Backend Integration
Tests the data flow between Angular frontend and Python backend
"""

import requests
import json
import time
from datetime import datetime

def test_endpoint(url, description, expected_keys=None):
    """Test a single API endpoint"""
    print(f"\n🔍 Testing: {description}")
    print(f"📡 URL: {url}")
    
    try:
        start_time = time.time()
        response = requests.get(url, timeout=10)
        end_time = time.time()
        
        response_time = round((end_time - start_time) * 1000, 2)
        
        print(f"⏱️  Response Time: {response_time}ms")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"✅ JSON Response: Valid")
                
                # Check expected keys if provided
                if expected_keys:
                    missing_keys = []
                    for key in expected_keys:
                        if key not in data:
                            missing_keys.append(key)
                    
                    if missing_keys:
                        print(f"⚠️  Missing keys: {missing_keys}")
                    else:
                        print(f"🔑 All expected keys present: {expected_keys}")
                
                # Show data summary
                if 'data' in data and isinstance(data['data'], list):
                    print(f"📋 Records returned: {len(data['data'])}")
                elif 'total' in data:
                    print(f"📋 Total records: {data['total']}")
                
                return True, data, response_time
                
            except json.JSONDecodeError:
                print(f"❌ Invalid JSON response")
                return False, None, response_time
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            return False, None, response_time
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False, None, 0

def main():
    """Test all API endpoints"""
    
    print("🚀 CodeBridge API Communication Test")
    print("=" * 60)
    print(f"🕐 Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Backend base URL
    backend_url = "http://localhost:8084"
    
    # Test cases
    test_cases = [
        (f"{backend_url}/health", "Health Check", ["status", "timestamp"]),
        (f"{backend_url}/", "API Info", ["service", "version", "endpoints"]),
        (f"{backend_url}/api/projects", "Projects API", ["success", "data", "total"]),
        (f"{backend_url}/api/collections", "Collections API", ["success", "data", "total"]),
        (f"{backend_url}/api/environments", "Environments API", ["success", "data", "total"]),
        (f"{backend_url}/api/docker/containers", "Docker Containers API", ["success", "data", "total"]),
        (f"{backend_url}/api/analytics/dashboard", "Dashboard Analytics", ["success", "data"]),
    ]
    
    # Run tests
    results = []
    total_time = 0
    
    for url, description, expected_keys in test_cases:
        success, data, response_time = test_endpoint(url, description, expected_keys)
        results.append((description, success, response_time))
        total_time += response_time
        time.sleep(0.5)  # Small delay between tests
    
    # Summary
    print(f"\n{'='*60}")
    print("📊 TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = sum(1 for _, success, _ in results if success)
    total = len(results)
    
    print(f"✅ Tests Passed: {passed}/{total}")
    print(f"⏱️  Total Response Time: {round(total_time, 2)}ms")
    print(f"📈 Average Response Time: {round(total_time/total, 2)}ms")
    
    print(f"\n📋 Detailed Results:")
    for description, success, response_time in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {status} | {description:<25} | {response_time:>6}ms")
    
    # Test CORS (Cross-Origin Resource Sharing)
    print(f"\n🌐 Testing CORS (Cross-Origin Resource Sharing)")
    try:
        headers = {'Origin': 'http://localhost:4200'}
        response = requests.get(f"{backend_url}/api/projects", headers=headers)
        cors_headers = response.headers.get('Access-Control-Allow-Origin', 'Not Set')
        print(f"🔒 CORS Header: {cors_headers}")
        if cors_headers == '*' or 'localhost:4200' in cors_headers:
            print("✅ CORS properly configured for frontend")
        else:
            print("⚠️  CORS may need configuration")
    except Exception as e:
        print(f"❌ CORS test failed: {e}")
    
    # Sample data preview
    print(f"\n📄 Sample API Response (Projects):")
    try:
        response = requests.get(f"{backend_url}/api/projects")
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and len(data['data']) > 0:
                sample_project = data['data'][0]
                print(json.dumps(sample_project, indent=2))
    except Exception as e:
        print(f"❌ Could not fetch sample data: {e}")
    
    print(f"\n🎯 Integration Test Complete!")
    print(f"🔗 Frontend: http://localhost:4200")
    print(f"🔗 Backend:  http://localhost:8084")

if __name__ == "__main__":
    main()

