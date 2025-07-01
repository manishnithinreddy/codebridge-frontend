#!/usr/bin/env python3
"""
Screenshot tool for CodeBridge Frontend Demo
Takes screenshots of the running Angular application
"""

import subprocess
import time
import os

def take_screenshot(url, output_file, width=1920, height=1080, wait_time=5):
    """Take a screenshot of a web page using headless Chrome"""
    
    # Start Xvfb (virtual display)
    xvfb_cmd = f"Xvfb :99 -screen 0 {width}x{height}x24"
    xvfb_process = subprocess.Popen(xvfb_cmd.split(), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Set display environment variable
    env = os.environ.copy()
    env['DISPLAY'] = ':99'
    
    time.sleep(2)  # Wait for Xvfb to start
    
    try:
        # Chrome command for taking screenshot
        chrome_cmd = [
            'chromium',
            '--headless',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-images',
            '--disable-javascript',  # Disable JS for faster loading
            f'--window-size={width},{height}',
            f'--screenshot={output_file}',
            url
        ]
        
        print(f"📸 Taking screenshot of {url}...")
        print(f"💾 Saving to {output_file}")
        
        # Take screenshot
        result = subprocess.run(chrome_cmd, env=env, capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print(f"✅ Screenshot saved successfully!")
            if os.path.exists(output_file):
                file_size = os.path.getsize(output_file)
                print(f"📊 File size: {file_size} bytes")
                return True
            else:
                print("❌ Screenshot file not found")
                return False
        else:
            print(f"❌ Chrome failed with return code: {result.returncode}")
            print(f"Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Screenshot timed out")
        return False
    except Exception as e:
        print(f"❌ Error taking screenshot: {e}")
        return False
    finally:
        # Clean up Xvfb
        xvfb_process.terminate()
        xvfb_process.wait()

def main():
    """Take screenshots of the CodeBridge application"""
    
    print("🚀 CodeBridge Frontend Screenshot Tool")
    print("=" * 50)
    
    # URLs to screenshot
    urls = [
        ("http://localhost:4200", "frontend_home.png"),
        ("http://localhost:4200/login", "frontend_login.png"),
        ("http://localhost:4200/dashboard", "frontend_dashboard.png"),
        ("http://localhost:4200/projects", "frontend_projects.png"),
        ("http://localhost:4200/docker-containers", "frontend_docker.png"),
    ]
    
    success_count = 0
    
    for url, filename in urls:
        print(f"\n📷 Screenshot {len([f for f in os.listdir('.') if f.endswith('.png')]) + 1}")
        if take_screenshot(url, filename):
            success_count += 1
        time.sleep(2)  # Wait between screenshots
    
    print(f"\n🎯 Summary: {success_count}/{len(urls)} screenshots taken successfully")
    
    # List all PNG files created
    png_files = [f for f in os.listdir('.') if f.endswith('.png')]
    if png_files:
        print("\n📁 Screenshots created:")
        for png_file in png_files:
            file_size = os.path.getsize(png_file)
            print(f"  • {png_file} ({file_size} bytes)")

if __name__ == "__main__":
    main()

