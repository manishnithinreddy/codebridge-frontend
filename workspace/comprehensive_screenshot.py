#!/usr/bin/env python3
"""
🎯 CodeBridge Frontend Comprehensive Screenshot Tool
==================================================
Captures screenshots of all implemented features and services
"""

import os
import time
import subprocess
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

def setup_driver():
    """Setup Chrome driver with headless configuration"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument('--disable-plugins')
    chrome_options.add_argument('--disable-images')
    chrome_options.add_argument('--disable-javascript')
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"❌ Failed to setup Chrome driver: {e}")
        return None

def take_screenshot(driver, url, filename, description):
    """Take a screenshot of a specific URL"""
    try:
        print(f"\n🎯 {description}")
        print(f"📸 Taking screenshot of {url}...")
        print(f"💾 Saving to {filename}")
        
        driver.get(url)
        time.sleep(3)  # Wait for page to load
        
        # Take screenshot
        driver.save_screenshot(filename)
        
        # Get file size
        file_size = os.path.getsize(filename)
        print(f"✅ Screenshot saved successfully!")
        print(f"📊 File size: {file_size} bytes")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to take screenshot: {e}")
        return False

def main():
    """Main function to capture all screenshots"""
    print("🚀 CodeBridge Frontend Comprehensive Screenshot Tool")
    print("=" * 60)
    
    # Start virtual display
    print("\n🖥️  Starting virtual display...")
    display_process = subprocess.Popen(['Xvfb', ':99', '-screen', '0', '1920x1080x24'], 
                                     stdout=subprocess.DEVNULL, 
                                     stderr=subprocess.DEVNULL)
    os.environ['DISPLAY'] = ':99'
    time.sleep(2)
    
    # Setup driver
    driver = setup_driver()
    if not driver:
        print("❌ Failed to setup driver. Exiting.")
        display_process.terminate()
        return
    
    base_url = "http://localhost:4200"
    screenshots_taken = 0
    total_screenshots = 0
    
    # Define all routes to capture
    routes = [
        # Core Pages
        ("", "latest_home.png", "🏠 Home/Dashboard Page"),
        ("/dashboard", "latest_dashboard.png", "📊 Dashboard View"),
        ("/login", "latest_login.png", "🔐 Login Page"),
        
        # Main Services
        ("/api-test", "latest_api_test_list.png", "🧪 API Testing - Test List"),
        ("/api-test/manual", "latest_api_test_manual.png", "🧪 API Testing - Manual Tester"),
        ("/api-test/create", "latest_api_test_create.png", "🧪 API Testing - Create Test"),
        
        ("/server", "latest_server_dashboard.png", "🖥️  Server Dashboard"),
        
        ("/docker", "latest_docker_dashboard.png", "🐳 Docker Management"),
        
        ("/git", "latest_git_manager.png", "📂 GitLab Repository Manager"),
        
        # Project Management
        ("/projects", "latest_projects_list.png", "📁 Projects List"),
        ("/projects/new", "latest_projects_create.png", "📁 Create New Project"),
        
        # Environment Management
        ("/environments", "latest_environments_list.png", "🌍 Environments List"),
        ("/environments/new", "latest_environments_create.png", "🌍 Create New Environment"),
        
        # Collections
        ("/collections", "latest_collections_list.png", "📚 Collections List"),
        ("/collections/new", "latest_collections_create.png", "📚 Create New Collection"),
        
        # Teams/Organization
        ("/organization", "latest_organization.png", "👥 Teams/Organization Management"),
        
        # AI DB Agent (Audit Logs)
        ("/audit-logs", "latest_ai_db_agent.png", "🤖 AI DB Agent (Audit Logs)"),
        
        # Auth Profile
        ("/auth/profile", "latest_user_profile.png", "👤 User Profile"),
    ]
    
    total_screenshots = len(routes)
    
    # Take screenshots
    for route, filename, description in routes:
        url = f"{base_url}{route}"
        success = take_screenshot(driver, url, filename, description)
        if success:
            screenshots_taken += 1
        time.sleep(1)  # Brief pause between screenshots
    
    # Cleanup
    driver.quit()
    display_process.terminate()
    
    # Summary
    print(f"\n🎯 Summary: {screenshots_taken}/{total_screenshots} screenshots taken successfully")
    
    if screenshots_taken > 0:
        print(f"\n📁 Screenshots created:")
        for route, filename, description in routes:
            if os.path.exists(filename):
                file_size = os.path.getsize(filename)
                print(f"  • {filename} ({file_size} bytes)")
    
    print(f"\n✨ All screenshots saved in current directory!")
    print(f"🚀 Ready to showcase your CodeBridge implementation!")

if __name__ == "__main__":
    main()

