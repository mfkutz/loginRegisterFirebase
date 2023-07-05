import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import HashLoader from "react-spinners/ClipLoader";


export function ProtectedRoute({ children }) {

  const { user, loading } = useAuth()

  if (loading)  return (
    <div className="bg-gray-900 text-gray-300 h-screen flex items-center justify-center">
      <h1 className="" ><HashLoader color="#eeeeee" /></h1>
    </div>
  )
  if (!user) return <Navigate to='/login' />

  return <>{children}</>

}

