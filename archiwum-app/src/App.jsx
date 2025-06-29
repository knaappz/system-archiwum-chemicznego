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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Starter />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/app/add-data" element={<AddData />} />
          <Route path="/app/view-all-data" element={<ViewAllData />} />
          <Route path="/app/view-all-for-disposal" element={<ViewForDisposal />} />
          <Route path="/app/dictionary" element={<Dictionary />} />
          <Route path="/app/order-register" element={<OrderRegister />} />
          <Route path="/app/admin" element={<AdminPanel />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
