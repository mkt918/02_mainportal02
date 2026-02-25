@echo off
chcp 65001 > nul
echo ========================================
echo   新しい授業記録タスクの作成
echo ========================================
echo.

cd /d "%~dp0"

set /p subject="科目名を入力してください (例: プログラミング): "
if "%subject%"=="" set subject=新しい授業

for /f "tokens=1-3" %%a in ('powershell -Command "Get-Date -Format 'yyyy MM dd'"') do (
    set YYYY=%%a
    set MM=%%b
    set DD=%%c
)

set filename=note\lessons\%YYYY%-%MM%-%DD%-%subject%.md

if exist "%filename%" (
    echo [警告] 既に同じ日付・科目のファイルが存在します。
    echo %filename%
) else (
    echo 新規ファイルを作成します: %filename%
    if exist "note\lessons\template.md" (
        copy "note\lessons\template.md" "%filename%" > nul
        echo [成功] 作成しました。エディタで %filename% を開いて編集してください。
    ) else (
        echo [エラー] note\lessons\template.md が見つかりません。
    )
)

echo.
pause
