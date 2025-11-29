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
import OrderRegister from "./components/OrderRegister/OrderRegister";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import ChangePswrd from "./components/ChangePswrd/ChangePswrd";
import Knowledge from "./components/OtherSites/Knowledge";
import Analitics from "./components/OtherSites/Analitics";
import Standards from "./components/OtherSites/Standards";
import ViewAllDataGuest from "./components/Views/GuestModule/ViewAllDataGuest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Starter />} />
        <Route path="change-pswrd" element={<ChangePswrd />} />


        <Route path="/app" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="add-data" element={<AddData />} />
          <Route path="view-all-data" element={<ViewAllData />} />
          <Route path="view-all-data-guest" element={<ViewAllDataGuest />} />
          <Route path="view-all-for-disposal" element={<ViewForDisposal />} />
          <Route path="dictionary" element={<Dictionary />} />
          <Route path="order-register" element={<OrderRegister />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="analitics" element={<Analitics />} />
          <Route path="standards" element={<Standards />} />
          <Route path="*" element={<NoPage />} />
        </Route>

        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>

  );
}
