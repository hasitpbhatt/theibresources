Add-Type -AssemblyName System.Drawing
$w = 1200
$h = 630
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'ClearTypeGridFit'

$paper = [System.Drawing.ColorTranslator]::FromHtml('#fbf7f0')
$ink = [System.Drawing.ColorTranslator]::FromHtml('#241a14')
$accent = [System.Drawing.ColorTranslator]::FromHtml('#b4543c')
$accentDeep = [System.Drawing.ColorTranslator]::FromHtml('#8a3a27')
$rule = [System.Drawing.ColorTranslator]::FromHtml('#e2d6c5')
$muted = [System.Drawing.ColorTranslator]::FromHtml('#6d5a4c')
$moss = [System.Drawing.ColorTranslator]::FromHtml('#4f6b4a')

$g.Clear($paper)
$rulePen = New-Object System.Drawing.Pen($rule, 1)
for ($y = 34; $y -lt $h; $y += 34) { $g.DrawLine($rulePen, 0, $y, $w, $y) }

$accentBrush = New-Object System.Drawing.SolidBrush($accent)
$g.FillRectangle($accentBrush, 0, 0, 14, $h)

$markPen = New-Object System.Drawing.Pen($accent, 4)
$markPen.StartCap = 'Round'
$markPen.EndCap = 'Round'
$g.DrawLine($markPen, 96, 150, 160, 150)
$outer = @(
  (New-Object System.Drawing.Point(108, 150)),
  (New-Object System.Drawing.Point(108, 112)),
  (New-Object System.Drawing.Point(128, 96)),
  (New-Object System.Drawing.Point(148, 112)),
  (New-Object System.Drawing.Point(148, 150))
)
$g.DrawLines($markPen, $outer)
$innerPen = New-Object System.Drawing.Pen($accent, 3.4)
$inner = @(
  (New-Object System.Drawing.Point(119, 150)),
  (New-Object System.Drawing.Point(119, 134)),
  (New-Object System.Drawing.Point(137, 134)),
  (New-Object System.Drawing.Point(137, 150))
)
$g.DrawLines($innerPen, $inner)

$fBrand = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold)
$fBrandLight = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Regular)
$fBig = New-Object System.Drawing.Font('Segoe UI', 30, [System.Drawing.FontStyle]::Bold)
$fMono = New-Object System.Drawing.Font('Consolas', 15, [System.Drawing.FontStyle]::Regular)

$inkBrush = New-Object System.Drawing.SolidBrush($ink)
$deepBrush = New-Object System.Drawing.SolidBrush($accentDeep)
$mutedBrush = New-Object System.Drawing.SolidBrush($muted)
$mossBrush = New-Object System.Drawing.SolidBrush($moss)

$g.DrawString('Fieldnotes', $fBrand, $inkBrush, 94, 188)
$g.DrawString('Science', $fBrandLight, $deepBrush, 94, 230)
$g.DrawString('Field-ready notes for', $fBig, $inkBrush, 94, 328)
$g.DrawString('environmental systems and biology.', $fBig, $inkBrush, 94, 370)
$g.DrawString('ORIGINAL NOTES  ·  TEACHER TOOLS  ·  NO ACCOUNT', $fMono, $mutedBrush, 96, 468)
$g.FillRectangle($mossBrush, 96, 514, 132, 4)

$out = Join-Path 'C:\Users\Lenovo\.copilot\copilot-worktrees\theibresources\hasitpbhatt-fluffy-meme\public' 'og.png'
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output ("wrote {0}" -f $out)
