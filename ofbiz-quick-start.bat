@echo off
title OFBiz Quick Start
color 0A

echo =========================================
echo       OFBiz Quick Start Script
echo =========================================
echo.

:: 1. Check JAVA_HOME
echo [*] Checking JAVA_HOME environment variable...
if "%JAVA_HOME%"=="" (
    echo [ERROR] JAVA_HOME is not set! Please install JDK 17 and set the JAVA_HOME environment variable.
    pause
    exit /b 1
)
echo [OK] JAVA_HOME is set to %JAVA_HOME%.
echo.

:: 2. Run init-gradle-wrapper
echo [*] Initializing Gradle wrapper...
call init-gradle-wrapper
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to run init-gradle-wrapper.
    pause
    exit /b %ERRORLEVEL%
)
echo [OK] Gradle wrapper initialized.
echo.

:: 3. Execute gradlew cleanAll loadAll
echo [*] Cleaning system and loading complete OFBiz data...
echo     (This may take a long time, please be patient)
call gradlew cleanAll loadAll
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to clean system and load data.
    pause
    exit /b %ERRORLEVEL%
)
echo [OK] System cleaned and data loaded successfully.
echo.

:: 4. Print access info before starting the server
echo =========================================
echo        OFBiz is ready to start!
echo =========================================
echo.
echo After the server starts successfully, you can access OFBiz at:
echo.
echo - Order Back Office : https://localhost:8443/ordermgr
echo - Accounting        : https://localhost:8443/accounting
echo - Administrator     : https://localhost:8443/webtools
echo.
echo Default Login Credentials:
echo - Username : admin
echo - Password : ofbiz
echo.
echo Note: Ignore the %% progress indicator because this task does not end as long as OFBiz is running.
echo.

:: 5. Start OFBiz
echo [*] Starting OFBiz...
call gradlew ofbiz
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] OFBiz stopped unexpectedly or failed to start.
    pause
    exit /b %ERRORLEVEL%
)

pause
