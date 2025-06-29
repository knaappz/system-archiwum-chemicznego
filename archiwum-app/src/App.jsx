import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import AddData from "./components/AddData/AddData";
import Home from "./components/Home/Home";
import ViewAllData from "./components/Views/ViewAllData";
import ViewForDisposal from "./components/Views/ViewForDisposal";
import NoPage from "./components/NoPage";
import Layout from "./components/Layout/Layout";
import Dictionary from "./components/Dictionary/Dictionary";
import Starter from "./components/Starter/Starter";
import OrderRegister from "./components/OrgerRegister/OrderRegister";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import ChangePswrd from "./components/ChangePswrd/ChangePswrd";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Starter />} />

        {/* Wyjątek: dostępna bez Layout i autoryzacji */}
        <Route path="/app/change-pswrd" element={<ChangePswrd />} />

        {/* Wszystko inne z Layoutem (i opcjonalnie zabezpieczeniami) */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="add-data" element={<AddData />} />
          <Route path="view-all-data" element={<ViewAllData />} />
          <Route path="view-all-for-disposal" element={<ViewForDisposal />} />
          <Route path="dictionary" element={<Dictionary />} />
          <Route path="order-register" element={<OrderRegister />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="*" element={<NoPage />} />
        </Route>

        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>

  );
}
