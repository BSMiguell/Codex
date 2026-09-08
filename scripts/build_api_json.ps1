# build_api_json.ps1
# Gera o characters-api.json a partir das fichas .md de cada pasta.
# Pipeline de imagens: WebP e PNG sao descobertos de forma independente.
# Regra de saida: WebP em imageWebp; PNG em image quando existir; se nao houver PNG,
# image usa o WebP como fallback. Assim personagens somente-WebP nao sao perdidos.

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd('\')
$codex = Join-Path $root 'codex'
$utf8 = [System.Text.Encoding]::UTF8
$fallbackDescription = 'Nenhuma descrição disponível para este personagem.'

function Normalize-Name {
  param([string]$Value)
  if ([string]::IsNullOrWhiteSpace($Value)) { return '' }
  $clean = $Value.ToLowerInvariant()
  $clean = $clean -replace '[-_ ]?v[-_ ]?\d+$', ''
  $clean = $clean -replace '[-_ ]?version[-_ ]?\d*$', ''
  $clean = $clean -replace '[^a-z0-9]+', ''
  return $clean
}

$labelPatterns = [ordered]@{
  description = 'Hist[oó]ria\s+Original'
  race        = '(?:Raç[ao]|Classe)(?:\s*/\s*(?:Categoria|Ordem|Tipo|Classe))?(?:\s+(?:Mutag[êe]nica|Demon[íi]aca|Mutante))?'
  dna         = 'DNA\s*&\s*Raio-X\s*Visual'
  physical    = 'F[íi]sico\s*&\s*Postura'
  faceAndHair = '(?:Rosto\s*&\s*(?:Anatomia|Cabelo)|Anatomia\s*&\s*Detalhes)'
  outfit      = 'Vestu[áa]rio'
  palette     = 'Paleta\s*de\s*Cores'
  equipment   = '(?:Acess[óo]rios(?:\s*&\s*Equipamento)?|Atributos\s*[ÚÚuú]nicos)'
}
$attrKeys = @('race', 'physical', 'faceAndHair', 'outfit', 'palette', 'equipment')

function Get-Sections {
  param([string]$Content)
  return [regex]::Matches($Content, '(?ms)^(?:##\s*)?\d+\.\s+.+?(?=^(?:##\s*)?\d+\.\s+|\z)')
}

function Find-LabeledValue {
  param(
    [string[]]$Lines,
    [string]$LabelPattern
  )
  for ($i = 0; $i -lt $Lines.Count; $i++) {
    $line = $Lines[$i]
    if (-not ($line -match ('^\s*(?:[-*]\s+)?(?:\*\*\s*)?' + $LabelPattern + '\s*\*{0,2}\s*:\s*\*{0,2}\s*(.*)$'))) { continue }
    $value = ($Matches[1].Trim() -replace '^\*\*\s*', '')
    if (-not [string]::IsNullOrWhiteSpace($value)) {
      return ($value -replace '\s+', ' ')
    }
    $collector = New-Object System.Collections.Generic.List[string]
    for ($j = $i + 1; $j -lt $Lines.Count; $j++) {
      $next = $Lines[$j].Trim()
      if ([string]::IsNullOrWhiteSpace($next)) {
        if ($collector.Count -gt 0) { break }
        continue
      }
      if ($next -match '^(?:#{1,6}\s+|\d+\.\s+)') { break }
      $isOtherLabel = $false
      foreach ($p in $labelPatterns.Values) {
        if ($next -match ('^\s*(?:[-*]\s+)?(?:\*\*\s*)?' + $p + '\s*\*{0,2}\s*:')) { $isOtherLabel = $true; break }
      }
      if ($isOtherLabel) { break }
      $collector.Add(($next -replace '^[-*]\s+', '' -replace '\*\*', ''))
    }
    if ($collector.Count -gt 0) {
      return ((($collector -join ' ') -replace '\s+', ' ').Trim())
    }
    return ''
  }
  return $null
}

function Get-CharacterFields {
  param([string]$SectionBody)
  $lines = $SectionBody -split "\r?\n"
  $fields = @{}
  foreach ($key in $labelPatterns.Keys) {
    $value = Find-LabeledValue -Lines $lines -LabelPattern $labelPatterns[$key]
    if ($null -ne $value -and -not [string]::IsNullOrWhiteSpace($value)) {
      $fields[$key] = $value
    }
  }
  return $fields
}

function Find-ImageFile {
  # Matching estrito: exato -> normalizado -> prefixo com separador.
  # Recebe uma colecao de um unico formato e nunca reutiliza o mesmo arquivo.
  param(
    [System.IO.FileInfo[]]$Files,
    [string]$BaseName,
    [string]$NormalizedName,
    [System.Collections.Generic.HashSet[string]]$UsedImages
  )
  foreach ($file in $Files) {
    if (-not $UsedImages.Contains($file.Name) -and $file.BaseName -ieq $BaseName) { return $file }
  }
  foreach ($file in $Files) {
    if (-not $UsedImages.Contains($file.Name) -and $NormalizedName -and (Normalize-Name $file.BaseName) -eq $NormalizedName) { return $file }
  }
  foreach ($file in $Files) {
    if (-not $UsedImages.Contains($file.Name) -and $BaseName -and $file.BaseName -match ('^' + [regex]::Escape($BaseName) + '[\-_ ]')) { return $file }
  }
  return $null
}

if (-not (Test-Path -LiteralPath $codex)) {
  throw ("Pasta 'codex' nao encontrada em '{0}'. As pastas numeradas vivem em codex/." -f $root)
}

$strayDirs = @(Get-ChildItem -LiteralPath $root -Directory |
  Where-Object { $_.Name -match '^\d{2}_' })
if ($strayDirs.Count -gt 0) {
  Write-Warning ('SINCRONIZACAO: {0} pasta(s) numerada(s) reapareceram NA RAIZ: {1}' -f $strayDirs.Count, (($strayDirs | ForEach-Object { $_.Name }) -join ', '))
  Write-Warning 'Rode: powershell -File scripts\absorb_sync.ps1'
}

$dirs = @(Get-ChildItem -LiteralPath $codex -Directory |
  Where-Object { $_.Name -match '^\d{2}_' } |
  Sort-Object Name)

$groups = New-Object System.Collections.Generic.List[object]
$allCharacters = New-Object System.Collections.Generic.List[object]
$foldersWithoutSheet = New-Object System.Collections.Generic.List[string]

foreach ($d in $dirs) {
  $md = Get-ChildItem -LiteralPath $d.FullName -File -Filter 'Aetheria_Codex_de_*.md' | Select-Object -First 1
  if (-not $md) {
    $webpCount = @(Get-ChildItem -LiteralPath $d.FullName -File -Filter '*.webp').Count
    $pngCount = @(Get-ChildItem -LiteralPath $d.FullName -File -Filter '*.png').Count
    $foldersWithoutSheet.Add("$($d.Name) ($webpCount WebP, $pngCount PNG, nenhuma ficha)")
    Write-Warning ("Pasta '{0}' tem {1} WebP(s) e {2} PNG(s) mas NENHUM arquivo Aetheria_Codex_de_*.md - personagens sem ficha ficam fora do site." -f $d.Name, $webpCount, $pngCount)
    continue
  }

  $content = [System.IO.File]::ReadAllText($md.FullName, $utf8)
  $webpFiles = @(Get-ChildItem -LiteralPath $d.FullName -File -Filter '*.webp')
  $pngFiles = @(Get-ChildItem -LiteralPath $d.FullName -File -Filter '*.png')
  $usedWebp = New-Object System.Collections.Generic.HashSet[string]
  $usedPng = New-Object System.Collections.Generic.HashSet[string]

  $characterItems = New-Object System.Collections.Generic.List[object]
  foreach ($section in (Get-Sections -Content $content)) {
    $body = $section.Value
    $firstLineEnd = $body.IndexOf("`n")
    $headerLine = if ($firstLineEnd -ge 0) { ($body.Substring(0, $firstLineEnd) -replace '\r', '').Trim() } else { $body.Trim() }
    $title = ($headerLine -replace '^(?:##\s*)?\d+\.\s*', '').Trim()
    $baseName = ($title -replace ',.*$', '').Trim()
    $normalizedName = Normalize-Name $baseName
    $number = [int]($headerLine -replace '^(?:##\s*)?(\d+)\..*$', '$1')

    $fields = Get-CharacterFields -SectionBody $body

    # Os formatos sao procurados INDEPENDENTEMENTE.
    # Isso elimina a dependencia antiga de PNG para descobrir o personagem.
    $webp = Find-ImageFile -Files $webpFiles -BaseName $baseName -NormalizedName $normalizedName -UsedImages $usedWebp
    $png = Find-ImageFile -Files $pngFiles -BaseName $baseName -NormalizedName $normalizedName -UsedImages $usedPng

    $imageWebp = $null
    $imagePng = $null
    $image = $null

    if ($webp) {
      $imageWebp = ('codex/' + $d.Name + '/' + $webp.Name) -replace '\\', '/'
      [void]$usedWebp.Add($webp.Name)
    }
    if ($png) {
      $imagePng = ('codex/' + $d.Name + '/' + $png.Name) -replace '\\', '/'
      [void]$usedPng.Add($png.Name)
    }

    # Contrato de compatibilidade:
    # image = PNG quando disponivel; caso contrario, WebP.
    # imageWebp = WebP quando disponivel.
    # Assim consumidores antigos continuam funcionando e o acervo WebP-only tambem.
    if ($imagePng) { $image = $imagePng }
    elseif ($imageWebp) { $image = $imageWebp }
    else {
      Write-Warning ("SEM IMAGEM: '$baseName' em '$($d.Name)' - ficha mantida na API com image=null")
    }

    $attributes = [ordered]@{}
    foreach ($key in $attrKeys) {
      if ($fields.ContainsKey($key)) { $attributes[$key] = $fields[$key] }
    }

    $character = [ordered]@{
      number      = $number
      title       = $title
      name        = $baseName
      id          = $baseName
      slug        = ($d.Name + '_' + $baseName)
      file        = $md.Name
      folder      = $d.Name
      image       = $image
      imageWebp   = $imageWebp
      description = if ($fields.ContainsKey('description')) { $fields['description'] } else { $fallbackDescription }
      attributes  = $attributes
    }
    $characterItems.Add([pscustomobject]$character)
    $allCharacters.Add([pscustomobject]$character)
  }

  $groups.Add([pscustomobject]([ordered]@{
    folder     = $d.Name
    file       = $md.Name
    count      = $characterItems.Count
    characters = $characterItems
  }))
}

$api = [ordered]@{
  project             = 'Aetheria Codex'
  generatedAt         = (Get-Date).ToString('yyyy-MM-dd')
  totalGroups         = $groups.Count
  totalCharacters     = $allCharacters.Count
  foldersWithoutSheet = $foldersWithoutSheet
  groups              = $groups
}

$json = $api | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText((Join-Path $root 'characters-api.json'), $json, (New-Object System.Text.UTF8Encoding($false)))
Write-Host ("characters-api.json gerado: $($groups.Count) grupos, $($allCharacters.Count) personagens.")