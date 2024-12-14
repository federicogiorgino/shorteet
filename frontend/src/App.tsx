import { Route, Routes, useNavigate } from "react-router-dom";
import { setNavigate } from "./lib/navigation";
import { Login, Home, Register } from "./pages";
import { AuthLayout } from "./components/auth-layout";

function App() {
  const navigate = useNavigate();
  setNavigate(navigate);
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
