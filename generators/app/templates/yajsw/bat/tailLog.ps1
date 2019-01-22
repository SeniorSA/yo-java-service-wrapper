function Get-WrapperRootDirectory {
    return Split-Path -Path $PSScriptRoot -Parent
}

function Get-LogFilePath {
    $WrapperDir = Get-WrapperRootDirectory
    return "$($WrapperDir)\log\wrapper.log"
}

$LogFilePath = Get-LogFilePath

Get-Content $LogFilePath -Wait -Tail 30
