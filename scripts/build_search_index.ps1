# build_search_index.ps1
# Gera data/search-index.json a partir de historia-api.json + characters-api.json.
# Indice invertido: para cada termo normalizado (NFD + ASCII + lower), salva
# df (document frequency) + hits (por doc: tf + positions para highlighter).
# # 9.3 do plano Q4/2026 - search semantica por lore na Ctrl+K.
#
# Saida: UTF-8 sem BOM, ASCII puro no script (Licao 3a PS 5.1: sem acento sem BOM).
# Idempotente: rodar 2x produz mesmo output (ordenado por doc+termo).

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd('\')
# Licao: Encoding.UTF8 inclui BOM. UTF8Encoding($false) nao.
$utf8 = New-Object System.Text.UTF8Encoding($false)

# ---------- Fontes ----------
$historiaPath = Join-Path $root 'historia-api.json'
$charApiPath  = Join-Path $root 'characters-api.json'
$outPath      = Join-Path $root 'data\search-index.json'

if (-not (Test-Path -LiteralPath $historiaPath)) { throw "Fonte nao encontrada: historia-api.json (rode build_historia_api.ps1 antes)" }
if (-not (Test-Path -LiteralPath $charApiPath))  { throw "Fonte nao encontrada: characters-api.json (rode build_api_json.ps1 antes)" }

# ---------- Out dir ----------
$outDir = Split-Path -Parent $outPath
if (-not (Test-Path -LiteralPath $outDir)) { [void](New-Item -ItemType Directory -Path $outDir -Force) }

# ---------- Carrega ----------
$historia = [System.IO.File]::ReadAllText($historiaPath, $utf8) | ConvertFrom-Json
$charApi  = [System.IO.File]::ReadAllText($charApiPath,  $utf8) | ConvertFrom-Json

# ---------- Stopwords pt-BR (curtas) ----------
$stopwords = @(
  'a','as','o','os','um','uma','uns','umas','de','da','do','das','dos',
  'e','ou','mas','que','se','em','no','na','nos','nas','por','para',
  'com','sem','sob','ser','foi','sao','era','ter','tem','ha','mais',
  'muito','pode','este','esta','esse','essa','isso','isto','como','quando',
  'onde','aos','ate','ja','so','tambem','ainda','entre','sobre','apos',
  'sua','seu','suas','seus','me','te','lhe','nos','vos','ao','la','lo'
)
$stopSet = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($s in $stopwords) { [void]$stopSet.Add($s) }

# ---------- Tokenizer ----------
# Mesmo algoritmo do normText() do index.html (NFD + strip nao-ASCII pos-NFD + lower).
function Normalize-Term([string]$Text) {
  if ([string]::IsNullOrEmpty($Text)) { return $null }
  $t = $Text.Normalize([System.Text.NormalizationForm]::FormD)
  $sb = New-Object System.Text.StringBuilder
  for ($i = 0; $i -lt $t.Length; $i++) {
    $ch = $t[$i]
    $cat = [System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch)
    if ($cat -ne 'NonSpacingMark') { [void]$sb.Append($ch) }
  }
  $normalized = $sb.ToString().ToLower()
  # Mantem letras (com acento) + hifens/apostrofos/digitos. Resto vira espaco.
  $sb2 = New-Object System.Text.StringBuilder
  foreach ($ch in $normalized.ToCharArray()) {
    $ok = ($ch -ge 'a' -and $ch -le 'z') -or ($ch -ge '0' -and $ch -le '9') -or $ch -eq '-' -or $ch -eq "'"
    if ($ok) { [void]$sb2.Append($ch) } else { [void]$sb2.Append(' ') }
  }
  return $sb2.ToString()
}

function Tokenize([string]$Text) {
  if ([string]::IsNullOrEmpty($Text)) { return @() }
  $n = Normalize-Term $Text
  $tokens = @($n -split '\s+' | Where-Object { $_ -and $_.Length -ge 2 -and -not $stopSet.Contains($_) })
  return $tokens
}

# ---------- Acumula docs ----------
# docs: lista de objetos {id, type, title, href, sub, body (texto completo para snippet)}
# postings: hashtable termo -> lista de [docIdx, tf, positions]
$docs    = New-Object System.Collections.Generic.List[object]
$postings = @{}

function Add-Posting([string]$Term, [int]$DocIdx) {
  if (-not $postings.ContainsKey($Term)) {
    $postings[$Term] = New-Object System.Collections.Generic.Dictionary'[int,int]'  # docIdx -> count
  }
  if ($postings[$Term].ContainsKey($DocIdx)) {
    $postings[$Term][$DocIdx]++
  } else {
    $postings[$Term][$DocIdx] = 1
  }
}

function Index-Doc([string]$Id, [string]$Type, [string]$Title, [string]$Href, [string]$Sub, [string]$Body) {
  $docObj = [pscustomobject]@{
    id    = $Id
    type  = $Type
    title = $Title
    href  = $Href
    sub   = $Sub
    body  = $Body
  }
  $docIdx = $docs.Count
  $docs.Add($docObj)
  $tokens = Tokenize $Body
  foreach ($t in $tokens) { Add-Posting $t $docIdx }
  return $docIdx
}

# ---------- Regions (16) ----------
foreach ($r in $historia.regions) {
  $body = @($r.nome, $r.bioma, $r.descricao) -join ' '
  $sub  = "$($r.bioma)"
  if ($r.racas) { $sub += " . $($r.racas)" }
  $href = "Mapa_Aetheria.html#pin-region-$($r.id)"
  [void](Index-Doc "region:$($r.id)" "region" $r.nome $href $sub $body)
}

# ---------- Battles (5) ----------
foreach ($b in $historia.battles) {
  $ladosTxt = ($b.lados | ForEach-Object { ($_ -join ' vs ') }) -join ' vs '
  $body = @($b.nome, $b.resumo, $ladosTxt, $b.data) -join ' '
  $sub  = "$($b.data)"
  $href = "Mapa_Aetheria.html#pin-battle-$($b.id)"
  [void](Index-Doc "battle:$($b.id)" "battle" $b.nome $href $sub $body)
}

# ---------- Celes (5) ----------
foreach ($c in $historia.celes) {
  $body = @($c.nome, $c.descricao, $c.altitude) -join ' '
  $sub  = "$($c.altitude)"
  if ($c.racas) { $sub += " . $($c.racas)" }
  $href = "Mapa_Aetheria.html#pin-celeste-$($c.id)"
  [void](Index-Doc "celeste:$($c.id)" "celeste" $c.nome $href $sub $body)
}

# ---------- Races (22) ----------
foreach ($race in $historia.races) {
  # races tem `id` (folder) e `nome`; a lore pode estar em descricao ou resumo
  $body = @($race.nome, $race.descricao, $race.resumo) -join ' '
  $sub  = "Raca . $($race.id)"
  $href = "racas/$($race.id).html"
  [void](Index-Doc "race:$($race.id)" "race" $race.nome $href $sub $body)
}

# ---------- Rituais (10) ----------
foreach ($rit in $historia.rituais) {
  # rituais tem id, raca, titulo, estrofe, duracao_ms, estilo, icon
  $body = @($rit.titulo, $rit.estrofe, $rit.raca) -join ' '
  $sub  = "Ritual . $($rit.raca)"
  $href = "racas/$($rit.raca).html#ritual-$($rit.id)"
  [void](Index-Doc "ritual:$($rit.id)" "ritual" $rit.titulo $href $sub $body)
}

# ---------- Personagens (487 - apenas a descricao/historia original) ----------
foreach ($group in $charApi.groups) {
  foreach ($c in $group.characters) {
    $desc = $c.description
    if (-not $desc) { continue }
    $body = @($c.name, $c.title, $desc) -join ' '
    $sub  = "$($group.folder) . historia original"
    $href = "index.html#$($c.name)"
    [void](Index-Doc "char:$($c.name)" "char-lore" $c.name $href $sub $body)
  }
}

# ---------- Reorganiza postings para JSON enxuto ----------
# Formato final: { df, hits: [ { doc, tf, positions } ] }
# positions sao as primeiras 5 posicoes no doc (nao no posting) - para highlighter.
# Para calcular positions, precisamos re-tokenizar por doc e gravar onde cada termo aparece.

# Recalcula positions a partir de cada doc.body tokenizado
$tokenPositions = @{}  # "docIdx|term" -> lista de posicoes
for ($d = 0; $d -lt $docs.Count; $d++) {
  $bodyNorm = Normalize-Term $docs[$d].body
  $toks = @($bodyNorm -split '\s+' | Where-Object { $_ -and $_.Length -ge 2 -and -not $stopSet.Contains($_) })
  for ($i = 0; $i -lt $toks.Count; $i++) {
    $key = "$d|$($toks[$i])"
    if (-not $tokenPositions.ContainsKey($key)) { $tokenPositions[$key] = New-Object System.Collections.Generic.List[int] }
    [void]$tokenPositions[$key].Add($i)
  }
}

# ---------- Monta JSON final ----------
$outDocs = New-Object System.Collections.Generic.List[object]
foreach ($d in $docs) {
  $outDocs.Add([pscustomobject]@{
    id    = $d.id
    type  = $d.type
    title = $d.title
    href  = $d.href
    sub   = $d.sub
  })
}

$outPostings = @{}
foreach ($term in ($postings.Keys | Sort-Object)) {
  $hitsList = New-Object System.Collections.Generic.List[object]
  $docCounts = $postings[$term]
  foreach ($docIdx in ($docCounts.Keys | Sort-Object)) {
    $key = "$docIdx|$term"
    $positions = if ($tokenPositions.ContainsKey($key)) { @($tokenPositions[$key] | Select-Object -First 5) } else { @() }
    $hitsList.Add([pscustomobject]@{
      doc       = [int]$docIdx
      tf        = [int]$docCounts[$docIdx]
      positions = $positions
    })
  }
  $outPostings[$term] = [pscustomobject]@{
    df   = $hitsList.Count
    hits = $hitsList.ToArray()
  }
}

$outObj = [pscustomobject]@{
  version     = 1
  generatedAt = (Get-Date -Format 'yyyy-MM-dd')
  totals      = [pscustomobject]@{
    docs     = $outDocs.Count
    terms    = $outPostings.Count
  }
  docs        = $outDocs.ToArray()
  postings    = $outPostings
}

# ---------- Serializacao compacta ----------
# Licao: ConvertTo-Json com Depth 6 infla ~6x (4.7 MB vs 700 KB) por causa da
# indentacao Python-style de 4 espacos por nivel. E JavaScriptSerializer nao
# lida com PSCustomObject (reflexao acha "referencias circulares" em
# PSMethod). Solucao: serializar via Node (devDep ja presente para Playwright).
# 1) PS grava o objeto como JSON verbose
# 2) Node re-le, re-escreve denso (JSON.stringify sem indent) com ordem de chaves controlada
$tmpPath = [IO.Path]::GetTempFileName()
$jsonVerbose = ConvertTo-Json -InputObject $outObj -Depth 6 -Compress:$false
[System.IO.File]::WriteAllText($tmpPath, $jsonVerbose, $utf8)

# Ordem canonica das chaves (matches o que index.html espera)
$nodeScript = @'
const fs = require('fs');
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
// Reordena postings em ordem alfabetica ja vem do PS (Sort-Object).
// So re-stringifica denso.
process.stdout.write(JSON.stringify(data));
'@
$nodeScriptPath = [IO.Path]::GetTempFileName() + ".js"
[System.IO.File]::WriteAllText($nodeScriptPath, $nodeScript, $utf8)

# Roda Node para re-serializar denso
$nodeOut = & node $nodeScriptPath $tmpPath 2>&1
if ($LASTEXITCODE -ne 0) { throw "Node re-serialize falhou: $nodeOut" }

# CRLF -> LF (consistencia com build_historia_api.ps1)
$nodeOut = $nodeOut -replace "`r`n", "`n"
[System.IO.File]::WriteAllText($outPath, $nodeOut, $utf8)
Remove-Item $tmpPath -Force
Remove-Item $nodeScriptPath -Force

Write-Host "OK: search-index gerado em $outPath"
Write-Host ("    docs: {0}  termos: {1}  bytes: {2:N0}" -f $outDocs.Count, $outPostings.Count, (Get-Item $outPath).Length)
