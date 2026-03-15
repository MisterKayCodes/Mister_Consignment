
import requests
import sys

def test_admins_endpoint(base_url, username, password):
    print(f"[*] Testing connection to {base_url}")
    
    # 1. Login to get token
    login_url = f"{base_url}/api/auth/login"
    try:
        resp = requests.post(login_url, data={"username": username, "password": password})
        if resp.status_code != 200:
            print(f"[!] Login failed: {resp.status_code} - {resp.text}")
            return
        
        token = resp.json().get("access_token")
        is_super = resp.json().get("is_super_admin")
        print(f"[+] Login successful. Token obtained. is_super_admin: {is_super}")
        
        # 2. Call admins list
        admins_url = f"{base_url}/api/admins/"
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(admins_url, headers=headers)
        
        if resp.status_code == 200:
            admins = resp.json()
            print(f"[+] Successfully fetched {len(admins)} admins:")
            for a in admins:
                print(f"    - {a['username']} (Super: {a['is_super_admin']})")
        else:
            print(f"[!] Failed to fetch admins: {resp.status_code} - {resp.text}")
            
    except Exception as e:
        print(f"[!] Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python api_test.py <base_url> <username> <password>")
    else:
        test_admins_endpoint(sys.argv[1], sys.argv[2], sys.argv[3])
