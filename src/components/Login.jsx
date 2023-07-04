import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import logo from '../assets/images/logo3.png'
import Footer from "./Footer"

const Login = () => {

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const { login, user: currentUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [verificationError, setVerificationError] = useState(false)

  useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      setVerificationError(true)
    }
  }, [currentUser])

  const handleChange = ({ target: { name, value } }) => {
    //aqui mantenemos lo que tiene user con el operador de propagacion ..., luego creo una nueva propiedad
    //dentro del objeto 
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setVerificationError(false)
    try {
      //funcion asincrona
      await login(user.email, user.password)
      navigate('/')
    } catch (error) {
      console.log('catch error', error.code)
      /* setVerificationError(false) */

      if (error.code === 'auth/weak-password') {
        setError('Password error')
      }
      if (error.code === 'auth/user-not-found') {
        setError('User not found')
      }
      if (error.code === 'auth/wrong-password') {
        setError('Wrong password')
      }
      if (error.code === 'auth/missing-password') {
        setError('Missing password')
      }
      if (error.code === 'auth/invalid-email') {
        setError('Invalid-email and password')
      }
      /* setError(error.message) */
    }
  }

  return (
    <div className="bg-gray-900 relative">



      <div className="w-[190px] absolute top-11 left-20 ">
        <img src={logo} alt="" />
      </div>
      <div className="bg-gray-900 h-screen flex flex-col justify-center items-center gap-11">

        <div className="flex justify-center items-center gap-11">

          <div className="flex justify-center items-center gap-11">
            <form onSubmit={handleSubmit}>


              <h1 className="text-gray-300 font-bold text-[38px] pb-3 ">Login</h1>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-300 pb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  /* placeholder="youremail@company.ltd" */
                  onChange={handleChange}
                  className="w-[320px] h-[38px] px-2 bg-gray-900 border text-gray-300 "
                />
              </div>



              <div className="flex flex-col">
                <label htmlFor="password" className="text-gray-300 pt-3 pb-1">Password</label>
                <input
                  type="password"
                  name='password'
                  id="password"
                  /* placeholder="******" */
                  onChange={handleChange}
                  className="text-gray-300 w-[320px] h-[38px] px-2 bg-gray-900 border "
                />
              </div>
              <div className="text-blue-300 text-[14px] pt-1">
                Forgot password?
              </div>
              <button className="bg-blue-500 flex w-full justify-center h-[34px] items-center mt-8">Login</button>
              {verificationError && (
                <p className="text-red-500 text-[12px]">
                  Please check your email before logging in.
                </p>
              )}
              {error && <p className="text-red-500 text-[12px]">{error}</p>}
              <div className="text-blue-300 text-[14px] items-center flex justify-center gap-1 mt-4">
                <span className="text-gray-300 ">Don't have an account yet?</span> <Link to={'/register'}>Register</Link>
              </div>
            </form>

            <div className=" bg-gray-950 max-w-[320px] p-6 text-gray-300 text-[12px] rounded-lg">
              <h2 className="text-[16px] font-semibold mb-2">Swift & Secure Global Money Transfers</h2>
              "Fast, secure, and reliable money transfers.
              Send funds internationally with ease and peace of mind.
              Our platform ensures your transactions are swift, protected, and hassle-free."
            </div>

          </div>


        </div>


        <Footer />

      </div>
    </div>
  )
}

export default Login