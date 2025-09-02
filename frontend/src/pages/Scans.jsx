import { useEffect, useState } from "react";
import api from "../api";
import { downloadScanPdf } from "../utils/pdf";

export default function Scans() {
  const [scans, setScans] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/scans");
        setScans(data);
      } catch (e) {
        setErr(e?.response?.data?.error || "Failed to load scans");
      }
    })();
  }, []);

  return (
    <div>
      <h3>Dentist — Scan Viewer</h3>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16
      }}>
        {scans.map(s => (
          <div key={s.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ height: 160, overflow: "hidden", borderRadius: 8, marginBottom: 8 }}>
              <img src={s.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.4 }}>
              <div><b>{s.patientName}</b> ({s.patientId})</div>
              <div>Type: {s.scanType}</div>
              <div>Region: {s.region}</div>
              <div>Date: {new Date(s.uploadDate).toLocaleString()}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <a href={s.imageUrl} target="_blank" rel="noreferrer">
                <button>View Full Image</button>
              </a>
              <button onClick={() => downloadScanPdf(s)}>Download PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
