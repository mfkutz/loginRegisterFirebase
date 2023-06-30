import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'


const Register = () => {


  const [user, setUser] = useState({
    email: '',
    password: '',
    name: ''
  })

  const { signup } = useAuth()
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

      const userCredential = await signup(user.email, user.password)
      console.log('datos de userCredential', userCredential);
      const { uid } = userCredential.user

      /* await signup(user.email, user.password) */
      const db = getFirestore()
      const userRef = doc(collection(db, 'users'), uid)
      const userData = {
        email: user.email,
        name: user.name,
        money: 0
      }

      await setDoc(userRef, userData)
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

    <div>

      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>

        <label htmlFor="email">Nombre</label>
        <input
          type="text"
          name="name"
          placeholder="Tu nombre y apellido"
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="youremail@company.ltd"
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name='password'
          id="password"
          placeholder="******"
          onChange={handleChange}
        />

        <button>Register</button>

      </form>
    </div>
  )
}

export default Register