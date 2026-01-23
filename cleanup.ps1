# Cleanup script to remove nested website folder and commit changes
$repoPath = Get-Location
Write-Host "Current path: $repoPath"

# Remove the nested website folder
if (Test-Path "website") {
    Write-Host "Removing nested website folder..."
    Remove-Item -Path "website" -Recurse -Force
    Write-Host "Nested folder removed"
} else {
    Write-Host "No website folder found to remove"
}

# List files to verify
Write-Host "`nCurrent files:"
Get-ChildItem -Name

Write-Host "`nCleanup complete!"
