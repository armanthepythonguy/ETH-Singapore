import "./App.css";
import { Route, Routes } from "react-router-dom";
import MetaLogin from "./pages/MetaLogin/MetaLogin";
import Login from "./pages/Login/Login";
import Model from "./pages/Model/Model";
import DevModel from "./pages/DevModel/DevModel";
import UserCart from "./pages/UserCart/UserCart";
import Portfolio from "./pages/Portfolio/Portfolio";

function App() {
  return (
    <Routes>
     <Route path="/portfolio" element={<Portfolio />} />
       <Route path="/userCart" element={<UserCart />} />
       <Route path="/devmodel" element={<DevModel />} />
         <Route path="/model" element={<Model />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MetaLogin />} />
    </Routes>
  );
}
export default App;
