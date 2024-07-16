import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import VerifyEmail from './components/VerifyEmail'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ForgotPassword from './components/ForgotPassword'
import PrivateRoute from './components/PrivateRoute';
import Resetpassword from './components/ResetPassword'
import SignupSuccessful from './components/SignupSuccessful'
import EditProfile from './components/EditProfile'
//import CreateProduct from './components/CreateProduct'
//import UpdateProduct from './components/UpdateProduct'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import CreateStudent from './components/CreateStudent'
import UpdateStudent from './components/UpdateStudent'

const App = () => {
  return (
    <div>
    <BrowserRouter>   
      <Routes>
        <Route path='/' element={<PrivateRoute><VerifyEmail /></PrivateRoute>}></Route>
        <Route path='/verify-email/:email' element={<PrivateRoute><Signup /></PrivateRoute>}></Route>
        <Route path='/signup-success' element={<PrivateRoute><SignupSuccessful /></PrivateRoute>}></Route>
        <Route path='/login' element={<PrivateRoute><Login /></PrivateRoute>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/forgot-password" element={<PrivateRoute><ForgotPassword /></PrivateRoute>}></Route>
        <Route path="/reset-password/:id/:token" element={<PrivateRoute><Resetpassword /></PrivateRoute>}></Route>
        
        <Route path='/create' element={<CreateStudent/>}></Route>
        <Route path='/update/:id' element={<UpdateStudent/>}></Route>
        

      </Routes>
    </BrowserRouter>
      
    </div>
  )
}

export default App
