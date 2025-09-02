import { useState } from "react";
import api from "../api";

export default function Upload() {
  const [form, setForm] = useState({
    patientName: "",
    patientId: "",
    scanType: "RGB",
    region: "Frontal",
    image: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Uploading...");
    try {
      const formData = new FormData();
      formData.append("image", form.image);
      formData.append("patientName", form.patientName);
      formData.append("patientId", form.patientId);
      formData.append("scanType", form.scanType);
      formData.append("region", form.region);

      const res = await api.post("/scans", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload success:", res.data);
      setStatus("Upload successful!");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      setStatus((err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="patientName"
        placeholder="Patient Name"
        value={form.patientName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="patientId"
        placeholder="Patient ID"
        value={form.patientId}
        onChange={handleChange}
        required
      />
      <select name="scanType" value={form.scanType} onChange={handleChange}>
        <option value="RGB">RGB</option>
        <option value="XRay">XRay</option>
      </select>
      <select name="region" value={form.region} onChange={handleChange}>
        <option value="Frontal">Frontal</option>
        <option value="Side">Side</option>
      </select>
      <input type="file" name="image" onChange={handleChange} required />
      <button type="submit">Submit</button>
      <p>{status}</p>
    </form>
  );
}
