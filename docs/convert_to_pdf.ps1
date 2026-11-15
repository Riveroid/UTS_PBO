$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = [Microsoft.Office.Interop.Word.WdAlertLevel]::wdAlertsNone

try {
    $scriptDir = $PSScriptRoot
    if ([string]::IsNullOrEmpty($scriptDir)) {
        $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    }

    # 1. Update & Export Laporan_Praktikum_MBG
    $docPath1 = Join-Path $scriptDir "Laporan_Praktikum_MBG.docx"
    $pdfPath1 = Join-Path $scriptDir "Laporan_Praktikum_MBG.pdf"
    
    Write-Host "Opening $docPath1..."
    $doc1 = $word.Documents.Open($docPath1)
    
    Write-Host "Updating dynamic fields (Table of Contents, Figures, Tables)..."
    $doc1.Fields.Update()
    
    Write-Host "Saving updated DOCX with rendered fields..."
    $doc1.Save()
    
    Write-Host "Exporting to PDF: $pdfPath1..."
    $doc1.SaveAs([ref]$pdfPath1, [ref]17) # 17 = wdFormatPDF
    $doc1.Close([ref]$false)
    Write-Host "Laporan PDF exported successfully!"

    # 2. Update & Export Naskah_Video_Presentasi_MBG
    $docPath2 = Join-Path $scriptDir "Naskah_Video_Presentasi_MBG.docx"
    $pdfPath2 = Join-Path $scriptDir "Naskah_Video_Presentasi_MBG.pdf"

    Write-Host "Opening $docPath2..."
    $doc2 = $word.Documents.Open($docPath2)
    $doc2.Fields.Update()
    $doc2.Save()
    
    Write-Host "Exporting to PDF: $pdfPath2..."
    $doc2.SaveAs([ref]$pdfPath2, [ref]17)
    $doc2.Close([ref]$false)
    Write-Host "Naskah PDF exported successfully!"
}
catch {
    Write-Error "Error during Word COM automation: $_"
}
finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
