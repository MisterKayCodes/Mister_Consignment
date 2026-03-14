@echo off
echo [...] Creating Virtual Environment...
python -m venv venv
echo [v] Virtual Environment Created.

echo [...] Installing Dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
echo [v] Dependencies Installed.

echo [...] Initializing Database...
python -c "from data.repository import init_db; init_db()"
echo [v] Database Initialized.

echo.
echo Setup Complete! Use start_backend.bat to run the server.
pause
