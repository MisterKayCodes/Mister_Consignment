import subprocess, sys, os

def run_inspector():
    print("[...] Running Architecture Inspector...")
    result = subprocess.run([sys.executable, "scripts/architecture_inspector.py"])
    return result.returncode == 0

def start_dev():
    print("[...] Starting Development Server...")
    try:
        from watchfiles import run_process
        run_process("./", target="python main.py")
    except ImportError:
        print("[!] watchfiles not found. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "watchfiles"])
        try:
            from watchfiles import run_process
            run_process("./", target="python main.py")
        except ImportError:
            print("[!] Could not start watchfiles. Running main.py directly.")
            subprocess.run([sys.executable, "main.py"])

if __name__ == "__main__":
    if run_inspector():
        if os.path.exists("main.py"):
            start_dev()
        else:
            print("[✓] Architecture check passed. Create main.py to start the app.")
    else:
        print("[!] Architecture inspector failed. Please fix issues before running.")
        sys.exit(1)
