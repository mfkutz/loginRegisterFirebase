import { Route, Routes } from "react-router-dom"
import Home from '../src/components/Home'
import Login from "./components/Login"
import Register from "./components/Register"
import AuthContextProvider from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import EmailSent from "./components/EmailSent"
import SendRequest from "./components/SendRequest"
import Add from "./components/Add"
import Withdraw from "./components/Withdraw"
import History from "./components/History"
import Settings from "./components/Settings"



function App() {


  return (

    <div className="">
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path="/send-request" element={<ProtectedRoute> <SendRequest /> </ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute> <Add /> </ProtectedRoute>} />
          <Route path="/withdraw" element={<ProtectedRoute> <Withdraw /> </ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute> <History /> </ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute> <Settings /> </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email" element={<EmailSent />} />
        </Routes>
      </AuthContextProvider>
    </div>
  )
}

export default App
