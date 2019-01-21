@echo off

:: ==================================================================== ::
:: Prints the last lines of the log file to standard output and
:: keep tracking the log file appending new content to the output.
::
:: Author: Luiz Nazari
:: ==================================================================== ::

:: From 'service-wrapper' root folder.
SET __log_file=..\log\wrapper.log
SET __lines_read_at_start=30
SET __tail_check_interval_in_seconds=1

:: Count total number of lines in the log
FOR /F "tokens=3" %%f in ('find /c /v "" %__log_file%') do SET __total_log_lines=%%f

:: Log last '__lines_read_at_start' lines
IF /I %__lines_read_at_start% LEQ %__total_log_lines% (
    SET /a __skipped_lines_at_start=%__total_log_lines%-%__lines_read_at_start%
    FOR /F "usebackq skip=%__skipped_lines_at_start% delims=" %%d in (%__log_file%) do ECHO %%d
) ELSE (
    FOR /F "usebackq delims=" %%d in (%__log_file%) do ECHO %%d
)

SET __last_tailed_line=%__total_log_lines%
SET /a __tail_check_interval_in_seconds=%__tail_check_interval_in_seconds%+1

:: Continuously keep tracking new lines to log.
:LOOP
    :: Hack to simunate a sort of 'sleep' command.
    :: The ping command execute every 1 second at localhost for n-1 iterations in option '-n'.
    ping 127.0.0.1 -n %__tail_check_interval_in_seconds% > nul

    :: Count total number of lines in the log
    FOR /F "tokens=3" %%f in ('find /c /v "" %__log_file%') do SET __total_log_lines=%%f

    IF /I %__last_tailed_line% LEQ %__total_log_lines% (
        IF /I %__last_tailed_line% NEQ %__total_log_lines% GOTO TAIL_NEW_LINES
    )
GOTO LOOP

:TAIL_NEW_LINES
    FOR /F "usebackq skip=%__last_tailed_line% delims=" %%d in (%__log_file%) do echo %%d
    SET __last_tailed_line=%__total_log_lines%
    GOTO LOOP

:: ==================================================================== ::

:: Log first 9 lines of file, the first characters of each line are the line number.
REM findstr /n "." wrapper.log | findstr "^.:"
REM
REM Get all the content of the log.
REM type "../log/wrapper.log"
REM
REM Get all the content of the log, paginated.
REM more /e "../log/wrapper.log" P 10

:: Get log file's real path.
REM PUSHD .
REM CD ../
REM SET __wrapper_root_dir=%cd%
REM POPD
REM
REM SET __log_file=%__wrapper_root_dir%%__log_file%
