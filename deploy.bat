@echo off
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\tgorg\.verdent\verdent-projects\new-project"
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run deploy
