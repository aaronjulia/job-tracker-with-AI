import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import CreateAccount from "@/pages/CreateAccount";
import ApplicationsPage from "@/pages/applications/ApplicationsPage";
import ApplicationDetailPage from "@/pages/applications/detail/ApplicationDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<CreateAccount />} />
      <Route path="/applications" element={<ApplicationsPage />} />
      <Route path="/applications/:id" element={<ApplicationDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
