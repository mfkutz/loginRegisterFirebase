import { createContext, useContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../assets/firebase/config'


//create context
export const authContext = createContext()


//esta funcion optimiza el codigo para no llamar a useContext e importar 2 cosas en otro lado
export const useAuth = () => {
    const context = useContext(authContext)
    return context
}


//esta funcion envuelve App 
const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)

    const [userData, setUserData] = useState(null)

    //close sesion
    const handleLogout = async () => {
        await logout()
    }

    const logout = () => signOut(auth)

    //con esta funcion creamos el usuario en firebase, prestar atencion al retorno (implicito), para controlar el try catch en register
    const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password)


    const login = async (email, password) => {
        const { user } = await signInWithEmailAndPassword(auth, email, password)

        //al eliminar o comentar esta linea de codigo, se puede ingresar sin verificar el correo
        if (!user.emailVerified) {
            throw new Error("email not verified")
        }
        setUser(user)
    }



    useEffect(() => {
        onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setLoading(false)
        })
    }, [])

    return (
        <authContext.Provider value={{
            signup,
            login,
            user,
            logout,
            loading,
            userData,
            setUserData,
            handleLogout,
           
        }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthContextProvider