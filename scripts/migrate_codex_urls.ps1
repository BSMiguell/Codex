# migrate_codex_urls.ps1 — migra URLs antigas /Temporario para /Codex
# Uso: powershell -ExecutionPolicy Bypass -File scripts\migrate_codex_urls.ps1
# A alteracao e deliberadamente textual e limitada a arquivos do projeto.
$ErrorActionPreference = "Stop"

$root = (Split-Path -Parent $PSScriptRoot).TrimEnd('\')
$oldBase = "https://bsmiguell.github.io/Temporario"
$newBase = "https://bsmiguell.github.io/Codex"

$extensions = @("*.html", "*.xml", "*.json", "*.js", "*.ps1", "*.md", "*.webmanifest", "*.txt")
$files = foreach ($pattern in $extensions) {
    Get-ChildItem -Path $root -Recurse -File -Filter $pattern -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\\.git\\" }
}

$changed = 0
foreach ($file in ($files | Sort-Object FullName -Unique)) {
    $text = [IO.File]::ReadAllText($file.FullName)
    $updated = $text.Replace($oldBase, $newBase)

    # SEO da pagina inicial: a fonte atual de verdade e characters-api.json (487 personagens).
    if ($file.Name -eq "index.html") {
        $updated = $updated.Replace("489 personagens", "487 personagens")
        $updated = $updated.Replace("Códice de 489 Personagens", "Códice de 487 Personagens")
    }

    if ($updated -ne $text) {
        [IO.File]::WriteAllText($file.FullName, $updated, [Text.UTF8Encoding]::new($false))
        $changed++
        Write-Host "[OK] $($file.FullName.Substring($root.Length + 1))" -ForegroundColor Green
    }
}

Write-Host "[OK] Migração concluída: $changed arquivo(s) alterado(s)." -ForegroundColor Green
