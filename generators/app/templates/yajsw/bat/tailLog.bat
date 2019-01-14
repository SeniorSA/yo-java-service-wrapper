for /F "tokens=3" %f in ('find /c /v "" "../log/wrapper.log"') do set nbLines=%f
set /a nbSkippedLines=%nbLines%-10
# for /F "skip=%nbSkippedLines% delims=" %d in ("../log/wrapper.log") do echo %d
