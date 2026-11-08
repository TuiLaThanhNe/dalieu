@echo off
chcp 65001 >nul
echo ============================================================================
echo   DR. FOX DA LIEU LAB - CAP NHAT DU LIEU BAI GIANG TU THU MUC MARKDOWN
echo ============================================================================
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
python scripts/build_data.py
python scripts/build_quiz_bank.py
echo.
echo Da cap nhat xong! Ban co the mo lai trang web de xem noi dung moi.
pause
