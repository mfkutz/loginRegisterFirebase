import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { doc, getFirestore, onSnapshot } from "firebase/firestore"
import HashLoader from "react-spinners/ClipLoader";
import construction from '../../assets/images/illustration-stay-productive.png'

import TopMenu from "./../TopMenu"
import LateralMenu from "./../LateralMenu"
import { Link } from "react-router-dom";

const Profile = () => {

    const { user, loading, setUserData } = useAuth()

    const [loadingData, setLoadingData] = useState(true)

    const [selectedOption, setSelectedOption] = useState('Profile')

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
            <div className="text-gray-300 ml-[14%] h-[90vh] bg-gray-900 flex text-sm ">
                <div className="px-[90px] pt-20 w-full">
                    <div className="text-[34px] font-bold uppercase">Settings</div>
                    <div className="flex flex-row mt-7 gap-6 text-gray-500 border-b-[1px] border-gray-500">
                        <Link
                            className={`uppercase hover:text-gray-300 cursor-pointer btn py-1 ${selectedOption === 'Profile' ? 'selected' : ''}`}
                            onClick={() => setSelectedOption('Profile')}
                        >Profile
                        </Link>
                        <Link
                            className={`uppercase hover:text-gray-300 cursor-pointer btn py-1  ${selectedOption === 'Methods' ? 'selected' : ''}`}
                            onClick={() => setSelectedOption('Methods')}
                        >Methods
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Profile