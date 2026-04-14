import os
import subprocess
import sys

def main():
    print("Welcome to effiCouncil!")
    print("Starting the Streamlit Server for the hackathon demo...")
    
    app_path = os.path.join(os.path.dirname(__file__), "frontend", "app.py")
    subprocess.run([sys.executable, "-m", "streamlit", "run", app_path])

if __name__ == "__main__":
    main()
