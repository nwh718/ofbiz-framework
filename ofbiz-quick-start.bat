@echo off
rem #####################################################################
rem Licensed to the Apache Software Foundation (ASF) under one
rem or more contributor license agreements.  See the NOTICE file
rem distributed with this work for additional information
rem regarding copyright ownership.  The ASF licenses this file
rem to you under the Apache License, Version 2.0 (the
rem "License"); you may not use this file except in compliance
rem with the License.  You may obtain a copy of the License at
rem
rem http://www.apache.org/licenses/LICENSE-2.0
rem
rem Unless required by applicable law or agreed to in writing,
rem software distributed under the License is distributed on an
rem "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
rem KIND, either express or implied.  See the License for the
rem specific language governing permissions and limitations
rem under the License.
rem #####################################################################

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo   Apache OFBiz - Quick Start Script (Windows)
echo ============================================================
echo.

rem Step 1: Check JAVA_HOME
echo [Step 1/4] Checking JAVA_HOME environment variable...
echo.

if not defined JAVA_HOME (
    echo [ERROR] JAVA_HOME is not set.
    echo.
    echo Please set the JAVA_HOME environment variable to your JDK 17 installation directory.
    echo For example: set JAVA_HOME=C:\Program Files\Java\jdk-17
    echo.
    echo You can download JDK 17 from: https://adoptopenjdk.net/
    echo.
    pause
    exit /b 1
)

echo JAVA_HOME = %JAVA_HOME%

if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] java.exe not found at "%JAVA_HOME%\bin\java.exe"
    echo Please verify your JAVA_HOME setting points to a valid JDK 17 installation.
    echo.
    pause
    exit /b 1
)

echo Java version:
"%JAVA_HOME%\bin\java.exe" -version 2>&1
echo.
echo [OK] JAVA_HOME is correctly configured.
echo.

rem Step 2: Initialize Gradle wrapper
echo [Step 2/4] Initializing Gradle wrapper...
echo.

call init-gradle-wrapper
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to initialize Gradle wrapper (error code: %ERRORLEVEL%).
    echo.
    echo If you see "Powershell is not recognized", please visit:
    echo   https://s.apache.org/vdcv8
    echo.
    echo You may also need to adjust PowerShell execution policy. See:
    echo   https://s.apache.org/urnju
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [OK] Gradle wrapper initialized successfully.
echo.

rem Step 3: Clean system and load complete OFBiz data
echo [Step 3/4] Cleaning system and loading complete OFBiz data...
echo This may take a long time on first run as dependencies need to be downloaded.
echo Please be patient...
echo.

call gradlew.bat cleanAll loadAll
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to clean and load OFBiz data (error code: %ERRORLEVEL%).
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [OK] OFBiz data loaded successfully.
echo.

rem Step 4: Start OFBiz
echo [Step 4/4] Starting OFBiz...
echo The progress indicator may stay at a certain percentage - this is normal.
echo OFBiz will continue running until you press Ctrl+C to stop it.
echo.
echo ============================================================
echo   Once startup is complete, visit OFBiz in your browser:
echo.
echo   Order Back Office  : https://localhost:8443/ordermgr
echo   Accounting         : https://localhost:8443/accounting
echo   Administrator      : https://localhost:8443/webtools
echo.
echo   Default login:
echo     Username: admin
echo     Password: ofbiz
echo.
echo   Press Ctrl+C to stop the OFBiz server.
echo ============================================================
echo.

call gradlew.bat ofbiz

endlocal