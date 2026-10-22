param(
  [ValidateSet('web', 'app')][string]$Target = 'web',
  [switch]$Development,
  [string]$FlutterPath = $env:FLUTTER_ROOT
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
if ($Target -eq 'web') {
  Push-Location $projectRoot
  try {
    if ($Development) { & node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3000 }
    else {
      & node node_modules/next/dist/bin/next build
      if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
      & node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3000
    }
    exit $LASTEXITCODE
  }
  finally { Pop-Location }
}
$appRoot = Join-Path $projectRoot 'related-projects/Wada-Talk'
$flutterCommand = Get-Command flutter -ErrorAction SilentlyContinue
if ($FlutterPath) { $flutterCommand = Join-Path $FlutterPath 'bin/flutter.bat' }
elseif (-not $flutterCommand) {
  $configPath = Join-Path $appRoot '.dart_tool/package_config.json'
  if (Test-Path -LiteralPath $configPath) {
    $config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
    if ($config.flutterRoot) { $flutterCommand = Join-Path ([uri]$config.flutterRoot).LocalPath 'bin/flutter.bat' }
  }
}
if (-not $flutterCommand) { throw 'Set FLUTTER_ROOT or pass -FlutterPath with your Flutter SDK directory.' }
if (-not (Test-Path -LiteralPath (Join-Path $appRoot '.env.app.json'))) { throw 'Configure the public Supabase URL and anon key in the app .env.app.json first.' }
Push-Location $appRoot
try { & $flutterCommand run -d web-server --web-hostname 127.0.0.1 --web-port 3001 --dart-define-from-file=.env.app.json; exit $LASTEXITCODE }
finally { Pop-Location }
