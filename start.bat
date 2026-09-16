@echo off
cd /d %~dp0
echo Long Long Man local server
echo Open http://localhost:5173
python -m http.server 5173
