import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { doc, getFirestore, onSnapshot } from "firebase/firestore"
import HashLoader from "react-spinners/ClipLoader";
import construction from '../assets/images/illustration-stay-productive.png'

import TopMenu from "./TopMenu"
import LateralMenu from "./LateralMenu"

const History = () => {
    const { user, loading, setUserData } = useAuth()

    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        if (user) {
            const db = getFirestore()
            const userRef = doc(db, "users", user.uid)
            const unsubscribe = onSnapshot(userRef, (docSnapshot) => {

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data()
                    setUserData(data)
                    setLoadingData(false)
                }
            })

            return () => unsubscribe()
        }
    }, [user, setUserData])

    useEffect(() => {
        if (!loadingData) {
            const db = getFirestore()
            const userRef = doc(db, "users", user.uid)
            const unsubscribe = onSnapshot(userRef, (docSnapshot) => {

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data()
                    setUserData(data)
                }
            })

            return () => unsubscribe()
        }
    }, [loadingData, user, setUserData])

    if (loading || loadingData) return (
        <div className="bg-gray-900 text-gray-300 h-screen flex items-center justify-center">
            <h1 className="" ><HashLoader color="#eeeeee" /></h1>
        </div>
    )
    return (
        <div className="relative">

            {/* ******************** LATERAL MENU******************* */}
            <LateralMenu />

            {/* *************************** BALANCE MENU TOP ****************************/}
            <TopMenu />

            {/* *************************  HOME  *************************** */}
            <div className="text-gray-300 ml-[14%] min-h-[100vh] pt-[10vh] bg-gray-900 flex flex-col justify-center items-center text-sm">
                <img src={construction} alt="" className="max-w-[500px]" />
                <div className="mt-11">
                    History in construction
                </div>
            </div>

        </div>
    )
}

export default History