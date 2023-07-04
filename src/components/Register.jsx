import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'
import logo from '../assets/images/logo3.png'
import Footer from "./Footer"
import { sendEmailVerification, signOut } from "firebase/auth"
import { auth } from "../assets/firebase/config"


const Register = () => {

  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    lastName: ''
  })

  const [button, setButton] = useState(true)

  const { signup } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const [emailCheck, setEmailCheck] = useState(true)
  const [formCheck, setFormCheck] = useState(false)


  const handleChange = ({ target: { name, value } }) => {
    //aqui mantenemos lo que tiene user con el operador de propagacion ..., luego creo una nueva propiedad
    //dentro del objeto 
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')



    try {
      const userCredential = await signup(user.email, user.password)

      const { uid } = userCredential.user
      const db = getFirestore()
      const userRef = doc(collection(db, 'users'), uid)
      const userData = {
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        money: 0,
        transactions: '',
        calification: 0

      }

      await setDoc(userRef, userData)
      await sendEmailVerification(userCredential.user)
      signOut(auth)

      /* navigate('/email') */
      setEmailCheck(false)
      setFormCheck(true)

    } catch (error) {
      console.log(error.code)
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
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use')
      }
      /* setError(error.message) */
    }
  }

  function handleBoxChange() {
    setButton(!button)
  }


  return (

    <div className="bg-gray-900 relative">
      <div className="w-[190px] absolute top-11 left-20 ">
        <img src={logo} alt="" />
      </div>


      <div className="bg-gray-900 h-screen flex flex-col justify-center items-center gap-11 ">

        <div className="flex justify-center items-center gap-11">




          <div className="flex justify-center items-center gap-11">

            <div className={`text-[13px] text-gray-300 ${emailCheck ? 'hidden' : ''}`}>
              An email was sent to you, please check it before logging in.
              <Link to={'/login'} className="bg-blue-500 flex w-full justify-center h-[34px] items-center mt-8">Login</Link >
            </div>
            <form onSubmit={handleSubmit} className={`${formCheck ? 'hidden' : ''}`}>

              <h1 className="text-gray-300 font-bold text-[38px] pb-3 ">Sign Up</h1>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-300 pb-1">First Name</label>
                <input
                  type="text"
                  name="name"
                  /* placeholder="Tu nombre y apellido" */
                  onChange={handleChange}
                  className="w-[320px] h-[38px] px-2 bg-gray-900 border text-gray-300 "
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-300 pb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  /* placeholder="Tu nombre y apellido" */
                  onChange={handleChange}
                  className="w-[320px] h-[38px] px-2 bg-gray-900 border text-gray-300 "
                />
              </div>

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
                <label htmlFor="password" className="text-gray-300 pb-1" >Password</label>
                <input
                  type="password"
                  name='password'
                  id="password"
                  /* placeholder="******" */
                  onChange={handleChange}
                  className="w-[320px] h-[38px] px-2 bg-gray-900 border text-gray-300 mb-4"
                />
              </div>

              <div className="text-[12px] pl-4 flex gap-1 text-blue-300 ">
                <input type="checkbox" name='terms' required onChange={handleBoxChange} />
                <span className="text-gray-300">I have read and accept the</span> <Link> User Agreement.</Link>
              </div>
              <button className={` ${button ? 'bg-gray-500' : 'bg-blue-500'} flex w-full justify-center h-[34px] items-center mt-8`} disabled={button ? true : false} >Register</button>
              {error && <p className="text-red-500 text-[12px]">{error}</p>}
              <div className="text-blue-300 text-[14px] items-center flex justify-center gap-1 mt-4">
                <span className="text-gray-300 ">Already have an account?</span> <Link to={'/login'}>Log in</Link>
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

    </div >
  )
}

export default Register