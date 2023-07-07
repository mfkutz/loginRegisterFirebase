import { Route, Routes } from "react-router-dom"
import Home from '../src/components/Home'
import Login from "./components/Login"
import Register from "./components/Register"
import AuthContextProvider from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import EmailSent from "./components/EmailSent"
import SendRequest from "./components/SendRequest"



function App() {


  return (

    <div className="">
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path="/send-request" element={<ProtectedRoute> <SendRequest /> </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email" element={<EmailSent />} />
        </Routes>
      </AuthContextProvider>
    </div>
  )
}

export default App
