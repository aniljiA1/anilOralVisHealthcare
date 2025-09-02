import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Upload from "./pages/Upload.jsx";
import Scans from "./pages/Scans.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function Layout({ children }) {
  const role = localStorage.getItem("role");
  return (
    <div style={{ maxWidth: 980, margin: "24px auto", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>OralVis Healthcare</h2>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Login</Link>
          <Link to="/upload">Technician Upload</Link>
          <Link to="/scans">Dentist Viewer</Link>
        </nav>
        <div style={{ marginLeft: "auto" }}>
          {role && <span style={{ marginRight: 12 }}>Role: <b>{role}</b></span>}
          <button onClick={() => { localStorage.clear(); window.location.href="/"; }}>Logout</button>
        </div>
      </header>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute role="Technician">
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scans"
          element={
            <ProtectedRoute role="Dentist">
              <Scans />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
