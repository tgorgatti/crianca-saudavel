@echo off
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\tgorg\.verdent\verdent-projects\new-project"
git add .
git commit -m "feat: rename agenda save button; fix prescription save without file; 42 tests passing"
git push origin main
del "%~f0"
