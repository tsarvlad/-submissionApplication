import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { themeSettings } from './theme'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import { Login } from '@mui/icons-material'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'

interface RootState {
  mode: string
  token: string
}

function App() {
  const mode = useSelector((state: RootState) => state.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const state = useSelector((state: RootState) => state.token)
  const isAuth = Boolean(useSelector((state: RootState) => state.token))

  return (
    <div className='app'>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          {/* <ThemeProvider theme={theme}> */}
          <Navbar />
          <Routes>
            <Route path='/' element={<Navigate to='/home' />}
            />
            <Route path='/register' element={
              isAuth ? <Navigate to='/home' /> : <RegisterPage />}
            />
            <Route path='/login' element={
              isAuth ? <Navigate to='/home' /> : <LoginPage />}
            />
            <Route path='/home' element={
              isAuth ? <HomePage /> : <Navigate to='/login' />}
            />
            <Route path='/user/profile/:id' element={
              isAuth ? <ProfilePage /> : <Navigate to='/login' />}
            />
            <Route path='/user/dashboard/:id' element={
              isAuth ? <DashboardPage /> : <Navigate to='/login' />}
            />
            <Route path='/user/about/:id' element={
              isAuth ? <AboutPage /> : <Navigate to='/login' />}
            />
          </Routes>
          {/* </ThemeProvider> */}
        </BrowserRouter>
      </LocalizationProvider>
    </div>
  );
}

export default App;
