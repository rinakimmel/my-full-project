import { useState } from 'react'
import './App.css'
import LogIn from './components/LogIn'
import Register from './components/Register'
import Home from './components/home'
import GetItems from './components/GetItems'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/logIn" replace />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/users/:userId" element={<Home />}>
          <Route path="albums" element={<GetItems />} />
          <Route path="photos" element={<GetItems />} />
          <Route path="todos" element={<GetItems />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
