@echo off
echo ===================================================
echo   Poly Hawk Deployment: polyhawk-web
echo ===================================================
echo.
echo Deploying updates to: https://polyhawk-web.vercel.app/
echo.
echo Running 'npx vercel --prod'...
echo You may need to log in if asked.
echo.

call npx vercel --prod --name polyhawk-web --yes

echo.
echo Deployment command finished.
pause
