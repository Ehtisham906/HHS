import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home' 
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PrivateRoute from './components/PrivateRoute' 
import Contact from './pages/Contact' 
import Footer from './components/Footer'
import Services from './pages/Services'
import ServicesFrom from './pages/ServicesFrom'
import Expertise from './pages/Expertise'
import Navbar from './components/Navbar'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/services' element={<Services />} />
        <Route path='/about' element={<About />} />
        <Route path='/contactus' element={<Contact />} />
        <Route path='/expertise' element={<Expertise />} />
        
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/services-form' element={<ServicesFrom />} /> 
        </Route>

      </Routes>
      <Footer className='fixed bottom-0' />
    </BrowserRouter>
  )
}
