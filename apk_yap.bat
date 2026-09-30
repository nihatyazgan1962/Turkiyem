@echo off
color 0A
title TURKIYEM APK Olusturucu
echo ========================================================
echo   TURKIYEM APK Olusturucu Baslatiliyor...
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0apk_yap.ps1"
