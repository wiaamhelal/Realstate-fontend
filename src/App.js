import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";

function ComingSoon() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ color: "#173c32", marginBottom: "12px" }}>Coming soon</h1>
        <p style={{ color: "#858981" }}>
          This page will be available in the next development step.
        </p>
      </div>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />
      <Route path="/login" element={<ComingSoon />} />
      <Route path="/add-property" element={<ComingSoon />} />
      <Route path="*" element={<ComingSoon />} />
    </Routes>
  );
}

export default App;
