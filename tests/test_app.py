import urllib.request
import sys

def verify_app():
    url = "http://localhost:3000"
    try:
        response = urllib.request.urlopen(url)
        status_code = response.getcode()
        html = response.read().decode('utf-8')
        
        print(f"DEBUG: Status Code Received -> {status_code}")
        
        # Match the new futuristic HUD title
        if status_code == 200 and "Enterprise Container Monitoring HUD" in html:
            print("✅ Automated Test Passed: Container Monitoring HUD is live and operational!")
            sys.exit(0)
        else:
            print("❌ Automated Test Failed: Unexpected content or status code.")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Automated Test Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_app()