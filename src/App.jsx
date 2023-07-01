import { Route, Routes } from "react-router-dom"
import Home from '../src/components/Home'
import Login from "./components/Login"
import Register from "./components/Register"
import AuthContextProvider from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"



function App() {


  return (

    <div className="">
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>

              <Home />

            </ProtectedRoute>

          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthContextProvider>
    </div>
  )
}

export default App
