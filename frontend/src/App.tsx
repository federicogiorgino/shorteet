import { Route, Routes, useNavigate } from "react-router-dom";
import { setNavigate } from "./lib/navigation";
import { Login, Home, Register } from "./pages";
import { AuthLayout } from "./components/auth-layout";
import { VerifyEmail } from "./pages/verify-email";

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
      <Route path="/email/verify/:code" element={<VerifyEmail />} />
    </Routes>
  );
}

export default App;
