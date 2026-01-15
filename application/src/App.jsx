import { useState } from 'react'
import './App.css'
import LogIn from './components/LogIn'
import Register from './components/Register'
import LogOut from './components/LogOut'
import Home from './components/home'
import ShowUserInformation from './components/ShowUserInformation'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TodosList from './components/TodosList'
import PostsList from './components/PostsList'
import AlbumsList from './components/AlbumsList'
import CommentsList from './components/CommentsList'
import ActivePost from './components/ActivePost'
import ActiveAlbum from './components/ActiveAlbum'
import {AuthProvider} from './components/AuthContext'
function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/logIn" replace />} />
            <Route path="/logIn" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home/users/:userId" element={<Home />}>
              <Route path="logout" element={<LogOut />} />
              <Route path="info" element={<ShowUserInformation />} />
              <Route path="todos" element={<TodosList />} />
              <Route path="posts" element={<PostsList />} />
              <Route path="posts/:postId" element={<ActivePost />} >
                <Route path="comments" element={<CommentsList />} />
              </Route>
              <Route path="albums" element={<AlbumsList />} />
              <Route path="albums/:albumId/photos" element={<ActiveAlbum />} />
            </Route>
          </Routes>
        </BrowserRouter >
      </AuthProvider>
    </>
  )
}
export default App