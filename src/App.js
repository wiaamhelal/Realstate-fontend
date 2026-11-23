import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import AddProperty from "./pages/AddProperty";
import ProtectedRoute from "./componets/auth/ProtectedRoute";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/properties" element={<Properties />} />

      <Route path="/properties/:id" element={<PropertyDetails />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/add-property"
        element={
          <ProtectedRoute>
            <AddProperty />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
