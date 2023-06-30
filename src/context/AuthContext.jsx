import { createContext, useContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../assets/firebase/config'

//creo el contexto
export const authContext = createContext()


//esta funcion optimiza el codigo para no llamar a useContext e importar 2 cosas en otro lado
export const useAuth = () => {
    const context = useContext(authContext)
    return context
}


//esta funcion envuelve App 
const AuthContextProvider = ({ children }) => {

    //iniciamos el estado del usuario para luego poder acceder a sus datos
    const [user, setUser] = useState(null)

    //debo iniciar un loading por que el user esta en null al comienzo
    const [loading, setLoading] = useState(true)

    //con esta funcion creamos el usuario en firebase, prestar atencion al retorno (implicito), para controlar el try catch en register
    const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password)

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password)

    const logout = () => signOut(auth)


    useEffect(() => {
        console.log('auth provider loaded');
        onAuthStateChanged(auth, currentUser => {
            console.log('in context', currentUser);
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
            loading
        }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthContextProvider