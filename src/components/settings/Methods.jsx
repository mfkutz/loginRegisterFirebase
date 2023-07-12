import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { doc, getFirestore, onSnapshot } from "firebase/firestore"
import HashLoader from "react-spinners/ClipLoader";
import construction from '../../assets/images/illustration-stay-productive.png'

import { RiAddLine } from "react-icons/ri";


import TopMenu from "./../TopMenu"
import LateralMenu from "./../LateralMenu"
import { Link } from "react-router-dom";
import SettingMenu from "../SettingMenu";
import binanceUsdtLogo from '../../assets/images/methods/binancelogo.png'

const Methods = () => {
    const { user, loading, setUserData } = useAuth()

    const [loadingData, setLoadingData] = useState(true)

    const [popupSelected, setPopupSelected] = useState(false)

    function handleMetod(e) {

        console.log('clic');
    }

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

            {/* *************************  Methods *************************** */}
            <div className="text-gray-300 ml-[14%] min-h-[100vh] pt-[6vh] bg-gray-900 flex text-sm ">
                <div className="px-[90px] pt-20 w-full">
                    <div className="text-[34px] font-bold uppercase">Settings</div>
                    <SettingMenu option={'Methods'} />

                    {/* /////PROFILE USER /////*/}
                    <div className="mt-11 z-0 ">
                        <div className="flex flex-wrap gap-4 justify-start">
                            {/* ************ ADD METHOD ************* */}
                            <div className="cursor-pointer border-b border-l border-r border-gray-700 min-w-[140px] flex flex-col justify-center items-center py-3" >
                                <div className="text-[40px]"><RiAddLine /></div>
                                <p className="text-blue-500">Add new</p>
                            </div>

                            {/* ************ METHOD ADDED ************* */}
                            <div
                                className="cursor-pointer border-b border-l border-r border-gray-700 min-w-[140px] flex flex-col justify-center items-center py-3"
                                onClick={handleMetod}
                            >
                                <img src={binanceUsdtLogo} alt="binance usdt" className="w-[45px]" />
                                <p className="text-[13px]">Binance Pay</p>
                                <p className="text-[13px]">(USDT)</p>
                            </div>



                            {/* POPUP */}
                            <div className="bg-blue-900 absolute w-[500px] h-[450px] -top-[] left-1/2 transform -translate-x-1/2 -translate-y-1/3  ">
                                POPUP
                            </div>


                        </div>


                    </div>
                </div>

            </div>

        </div>
    )
}

export default Methods