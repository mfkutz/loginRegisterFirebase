import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"




const Home = () => {

  const { user, logout, loading } = useAuth()


  console.log('in home', user);

 /*  const navigate = useNavigate() */

  const handleLogout = async () => {
    await logout()
   /*  navigate('/login') */
  }

  if (loading) return <h1>Loading...</h1>


  return (
    <>
      < div > Home</div>
      <p>Welcome {user.email}</p>
      <button onClick={handleLogout} >Logout</button>
    </>
  )
}

export default Home