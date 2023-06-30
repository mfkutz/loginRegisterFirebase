import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"


const Register = () => {


  const [user, setUser] = useState({
    email: '',
    password: ''
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
      //funcion asincrona
      await signup(user.email, user.password)
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