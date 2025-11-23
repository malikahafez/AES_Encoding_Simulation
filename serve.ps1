# Simple static file server for the current folder using HttpListener
# Usage: powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8000
param(
    [int]$Port = 8000
)

Add-Type -AssemblyName System.Web

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving HTTP on port $Port (http://localhost:$Port). Press Ctrl+C to stop." -ForegroundColor Green

function Get-ContentType($path) {
    switch ([System.IO.Path]::GetExtension($path).ToLower()) {
        '.html' { 'text/html; charset=utf-8' }
        '.htm' { 'text/html; charset=utf-8' }
        '.js' { 'application/javascript; charset=utf-8' }
        '.css' { 'text/css; charset=utf-8' }
        '.png' { 'image/png' }
        '.jpg' { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.gif' { 'image/gif' }
        '.svg' { 'image/svg+xml' }
        '.json' { 'application/json' }
        '.wasm' { 'application/wasm' }
        default { 'application/octet-stream' }
    }
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $rawUrl = $req.Url.AbsolutePath
        if ($rawUrl -eq '/') { $rawUrl = '/index.html' }
        # decode and remove leading '/'
        $localPath = [System.Web.HttpUtility]::UrlDecode($rawUrl).TrimStart('/')
        $fsPath = Join-Path (Get-Location) $localPath
        
        Write-Host "$($req.HttpMethod) $rawUrl" -ForegroundColor Cyan
        
        if (Test-Path $fsPath -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($fsPath)
                $res.ContentType = Get-ContentType $fsPath
                $res.ContentLength64 = $bytes.Length
                $res.StatusCode = 200
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                Write-Host "Error serving ${fsPath}: $_" -ForegroundColor Red
                $res.StatusCode = 500
                $msg = [System.Text.Encoding]::UTF8.GetBytes("Internal server error")
                $res.ContentLength64 = $msg.Length
                $res.OutputStream.Write($msg,0,$msg.Length)
            }
        } else {
            Write-Host "Not found: $fsPath" -ForegroundColor Yellow
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $rawUrl")
            $res.ContentLength64 = $msg.Length
            $res.OutputStream.Write($msg,0,$msg.Length)
        }
        $res.OutputStream.Close()
    }
} catch {
    Write-Host "Server error: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
    Write-Host "Server stopped." -ForegroundColor Yellow
}
