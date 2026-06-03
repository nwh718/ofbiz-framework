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

title Apache OFBiz - Quick Start Script
color 0E

echo.
echo ============================================================
echo              Apache OFBiz - Quick Start Script
echo ============================================================
echo.

rem 步骤 1: 检查 JAVA_HOME 是否设置
echo [1/5] 检查 Java 环境...
if not defined JAVA_HOME (
    echo ERROR: JAVA_HOME 环境变量未设置！
    echo 请确保已安装 JDK 17 并正确配置 JAVA_HOME。
    echo.
    pause
    exit /b 1
)

if not exist "%JAVA_HOME%\bin\java.exe" (
    echo ERROR: JAVA_HOME 指向的路径无效: %JAVA_HOME%
    echo 未找到 %JAVA_HOME%\bin\java.exe
    echo.
    pause
    exit /b 1
)

echo OK: Java 环境检查通过 - %JAVA_HOME%
echo.

rem 确保脚本在项目根目录运行
cd /d "%~dp0"

rem 步骤 2: 运行 init-gradle-wrapper
echo [2/5] 初始化 Gradle Wrapper...
call init-gradle-wrapper.bat
if errorlevel 1 (
    echo ERROR: 初始化 Gradle Wrapper 失败！
    echo.
    pause
    exit /b 1
)

echo OK: Gradle Wrapper 初始化完成
echo.

rem 步骤 3: 检查 gradlew.bat 是否存在
if not exist "gradlew.bat" (
    echo ERROR: 未找到 gradlew.bat 文件！
    echo.
    pause
    exit /b 1
)

rem 步骤 4: 执行 cleanAll 和 loadAll
echo [3/5] 清理系统并加载 OFBiz 完整数据...
echo 注意: 此步骤可能需要较长时间，请耐心等待...
echo.
call gradlew.bat cleanAll loadAll
if errorlevel 1 (
    echo ERROR: 数据加载失败！
    echo.
    pause
    exit /b 1
)

echo OK: 数据加载完成
echo.

rem 步骤 5: 显示启动信息
echo [4/5] 即将启动 Apache OFBiz...
echo.
echo ============================================================
echo OFBiz 访问地址:
echo - Order Back Office:    https://localhost:8443/ordermgr
echo - Accounting Back Office: https://localhost:8443/accounting
echo - Administrator interface: https://localhost:8443/webtools
echo.
echo 默认登录信息:
echo - 用户名: admin
echo - 密码: ofbiz
echo.
echo 提示: 首次登录后建议修改默认密码
echo ============================================================
echo.
echo [5/5] 正在启动 OFBiz 服务器...
echo.

rem 启动 OFBiz
call gradlew.bat ofbiz

rem 如果 OFBiz 停止，显示信息
echo.
echo OFBiz 服务器已停止。
echo.
pause
