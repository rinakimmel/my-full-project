import { useState } from 'react'
import './App.css'
import LogIn from './components/LogIn'
import Register from './components/Register'
import LogOut from './components/LogOut'
import Home from './components/home'
import GetItems from './components/GetItems'
import ShowUserInformation from './components/ShowUserInformation'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Todos from './components/Todos'
import Posts from './components/Posts'
import AlbumItem from './components/AlbumItem'
import AlbumsList from './components/AlbumsList'
import PhotosList from './components/PhotosList'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/logIn" replace />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home/users/:userId" element={<Home />}>
            <Route path="logout" element={<LogOut />} />
            <Route path="info" element={<ShowUserInformation />} />
            <Route path="todos" element={<Todos />} />
            <Route path="posts" element={<Posts />} />
            <Route path="albums" element={<AlbumsList />} />
            <Route path="albums/:albumId" element={<PhotosList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App