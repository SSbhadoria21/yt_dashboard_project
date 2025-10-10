import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import Layout from './components/Layout/Layout.jsx'
import Home from './components/Home/Home.jsx'
// import Login from './components/Login/Login.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Profile from './components/Profile/Profile.jsx'
import { AuthProvider } from './components/context/AuthContext.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    
   <>
   
        <Route path='/' element={<Layout/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='login' element={<Login/>}>
        </Route>
        <Route path='register' element={<Register/>}/>
        <Route path='profile' element={<Profile/>}/>
        
        <Route path='dashboard/:id' element={<Dashboard/>}/>
      </Route>
    
      
   </>
    
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>

  <AuthProvider>
     <RouterProvider router={router}/>
  </AuthProvider>
  </StrictMode>,
)
