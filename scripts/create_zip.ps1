$source = "C:\Users\Admin\.gemini\antigravity\scratch\prediction-gecko"
$dest = "C:\Users\Admin\.gemini\antigravity\scratch\temp_build_zone"
$zip = "C:\Users\Admin\.gemini\antigravity\scratch\prediction-gecko\polyhawk-source.zip"

Write-Host "Creating temp directory..."
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$exclude = @("node_modules", ".next", ".git", ".vercel", "temp_packet", "polyhawk-source.zip")

Write-Host "Copying files..."
Get-ChildItem -Path $source | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Write-Host "Copying $($_.Name)..."
    Copy-Item -Path $_.FullName -Destination $dest -Recurse
}

Write-Host "Compressing..."
Compress-Archive -Path "$dest\*" -DestinationPath $zip -Force

Write-Host "Cleaning up..."
Remove-Item -Path $dest -Recurse -Force

Write-Host "Done! Zip created at $zip"
