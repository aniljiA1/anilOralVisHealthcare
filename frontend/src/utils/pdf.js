import { jsPDF } from "jspdf";

async function urlToDataURL(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export async function downloadScanPdf(scan) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  doc.setFontSize(18);
  doc.text("OralVis Healthcare — Scan Report", margin, y); y += 28;

  doc.setFontSize(12);
  doc.text(`Patient Name: ${scan.patientName}`, margin, y); y += 16;
  doc.text(`Patient ID: ${scan.patientId}`, margin, y); y += 16;
  doc.text(`Scan Type: ${scan.scanType}`, margin, y); y += 16;
  doc.text(`Region: ${scan.region}`, margin, y); y += 16;
  doc.text(`Upload Date: ${new Date(scan.uploadDate).toLocaleString()}`, margin, y); y += 24;

  // Image
  try {
    const dataUrl = await urlToDataURL(scan.imageUrl);
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxW = pageWidth - margin * 2;
    const imgW = maxW;
    const imgH = 300;
    doc.addImage(dataUrl, "JPEG", margin, y, imgW, imgH);
    y += imgH + 16;
  } catch {
    doc.text("Image preview unavailable.", margin, y); y += 16;
  }

  doc.save(`scan_${scan.patientId}_${scan.id}.pdf`);
}
