Write-Output "[Script] Press Ctrl+C to exit"
Write-Output "[Script] Press R to reload the script"
# python ./utilities/watchClient.py
# Write-Output "Last exit code" $LASTEXITCODE
Do {
  Write-Output "" "[Script] Starting watchers"
  python ./utilities/watchClient.py
} While ($LASTEXITCODE -eq 7)
