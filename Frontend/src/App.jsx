import './App.css';
import React, { useEffect } from 'react'
import { BrowserRouter as Browser, Route, Routes } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Home from './pages/Home'
import Cashier from './pages/Cashier'
import Users from './pages/Users'
import Items from './pages/Items'
import Reports from './pages/Report'
import Login from './pages/Login'
import Title from './components/title'
import Register from './pages/Register'
import EditProfile from './pages/EditUser/EditProfile'
import EditPassword from './pages/EditUser/EditPassword'
import EditPP from './pages/EditUser/EditPP'
import DeleteUser from './pages/EditUser/DeleteUser'
import AddItem from './pages/Item/AddItem';
import Sales from './pages/ReportPage/Sales'
import BestSales from './pages/ReportPage/BestSales'
import PreviousReceipt from './pages/ReportPage/PreviousReceipt'
import Receipt from './pages/ReportPage/Receipt'

function App() {
  return (
    <Browser>
        <Routes>
          <Route path="*" element={<Title />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/store/home" element={<Home />} />
          <Route path="/store/cashier" element={<Cashier />} />
          <Route path="/store/items" element={<Items />} />
          <Route path="/store/reports" element={<Reports />} />
          <Route path="/store/users" element={<Users />} />
          <Route path="/store/users/edit_profile" element={<EditProfile />} />
          <Route path='/store/users/edit_password' element={<EditPassword/>}/>
          <Route path='/store/users/edit_promptpay' element={<EditPP/>}/>
          <Route path='/store/users/delete_profile' element={<DeleteUser/>}/>
          <Route path='/store/items/additem' element={<AddItem/>}/>
          <Route path='/store/reports/sales' element={<Sales/>} />
          <Route path='/store/reports/best_seller' element={<BestSales/>} />
          <Route path='/store/reports/receipt' element={<PreviousReceipt/>} />
          <Route path="/receipt/id/:id" element={<Receipt />} />
        </Routes>
      </Browser>
  );
}

export default App;
