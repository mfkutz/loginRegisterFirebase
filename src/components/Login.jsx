import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import logo from '../assets/images/logo3.png'
import image1 from '../assets/images/mc.svg'
import image2 from '../assets/images/visa.svg'

const Login = () => {

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const handleChange = ({ target: { name, value } }) => {
    //aqui mantenemos lo que tiene user con el operador de propagacion ..., luego creo una nueva propiedad
    //dentro del objeto 
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      //funcion asincrona
      await login(user.email, user.password)
      navigate('/')
    } catch (error) {
      console.log(error.code)
      //ejemplo de como hacer los mensajes personalizados segun el tipo de error
      /*  if (error.code === 'auth/weak-password') {
         setError('error de contraseña')
       } */
      setError(error.message)
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
              {error && <p className="text-red-500 text-[12px]">{error}</p>}
              <div className="text-blue-300 text-[14px] items-center flex justify-center gap-1 mt-4">
                <span className="text-gray-300 ">Don't have an account yet?</span> Register
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
        <div className=" flex w-full items-center justify-evenly mt-11 text-gray-300 text-[13px]">
          <div className="max-w-[400px] text-[13px]">
            Your solution for fast, secure, and convenient money transfers. Send and receive funds instantly with Interlan Transfers.
             - Interlan currently is in development, soon to be operational.
            Experience the future of seamless fund transfers with our intuitive and reliable platform, coming soon."
          </div>
          <div className="flex gap-3">

            <div className="flex flex-col ">
              <p className="mb-3 text-[12px] hover:text-blue-500 cursor-pointer">Cookies Policy</p>
              <img src={image1} alt="mastercard" />
            </div>

            <div className="flex flex-col">
              <p className="mb-3 text-[12px] hover:text-blue-500 cursor-pointer">Terms and conditions</p>
              <img src={image2} alt="visa" />
            </div>

          </div>
          {/* © Interlan 2023 */}
        </div>
        {/* /////////////////////////FOOTER//////////////////////////////// */}
      </div>
    </div>
  )
}

export default Login