@echo off
cd /d "d:\1.web development\web club\QUIZ\website"
echo Removing nested website folder...
if exist "website" (
    rmdir /s /q "website"
    echo Folder deleted successfully
) else (
    echo No website folder found
)
echo.
echo Remaining files and folders:
dir /b
echo.
echo Done!
pause
