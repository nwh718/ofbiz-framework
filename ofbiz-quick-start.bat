@echo off
setlocal EnableExtensions

cd /d "%~dp0"

echo === Apache OFBiz Windows Quick Start ===
echo.

if not defined JAVA_HOME (
    echo [ERROR] JAVA_HOME 未设置。请先安装 JDK 17 并设置 JAVA_HOME。
    echo.
    pause
    exit /b 1
)

if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] JAVA_HOME 指向的目录无效: "%JAVA_HOME%"
    echo.
    pause
    exit /b 1
)

echo [INFO] JAVA_HOME=%JAVA_HOME%
echo [INFO] 正在执行 init-gradle-wrapper...
call init-gradle-wrapper.bat
if errorlevel 1 (
    echo.
    echo [ERROR] init-gradle-wrapper 执行失败，请检查 PowerShell 7 和执行策略配置。
    echo.
    pause
    exit /b 1
)

echo.
echo [INFO] 正在执行 gradlew cleanAll loadAll...
call gradlew.bat cleanAll loadAll
if errorlevel 1 (
    echo.
    echo [ERROR] gradlew cleanAll loadAll 执行失败。
    echo.
    pause
    exit /b 1
)

echo.
echo [INFO] 正在启动 OFBiz...
start "Apache OFBiz" cmd /k "call gradlew.bat ofbiz"
if errorlevel 1 (
    echo.
    echo [ERROR] 无法启动 OFBiz 进程。
    echo.
    pause
    exit /b 1
)

echo [INFO] 正在等待 OFBiz 启动完成，请稍候...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$deadline=(Get-Date).AddMinutes(10); while((Get-Date) -lt $deadline){ try { $client=New-Object Net.Sockets.TcpClient; $iar=$client.BeginConnect('127.0.0.1',8443,$null,$null); if($iar.AsyncWaitHandle.WaitOne(2000,$false) -and $client.Connected){ $client.EndConnect($iar); $client.Close(); exit 0 }; $client.Close() } catch {}; Start-Sleep -Seconds 5 }; exit 1"
if errorlevel 1 (
    echo.
    echo [ERROR] OFBiz 在预期时间内未启动成功，请查看新打开的窗口日志。
    echo.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] OFBiz 已启动成功。
echo [URL] Order Back Office: https://localhost:8443/ordermgr
echo [URL] Accounting Back Office: https://localhost:8443/accounting
echo [URL] Administrator: https://localhost:8443/webtools
echo [LOGIN] 用户名: admin
echo [LOGIN] 密码: ofbiz
echo.
pause
exit /b 0
