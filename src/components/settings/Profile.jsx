import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { doc, getFirestore, onSnapshot } from "firebase/firestore"
import HashLoader from "react-spinners/ClipLoader";
import TopMenu from "./../TopMenu"
import LateralMenu from "./../LateralMenu"
import SettingMenu from "../SettingMenu";
import userImg from '../../assets/images/user.webp'
import { RiStarLine } from "react-icons/ri";

const Profile = () => {

    const { user, loading, userData, setUserData } = useAuth()
    const [loadingData, setLoadingData] = useState(true)

    const [currency, setCurrency] = useState(false)

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

            {/* *************************  SETTINGS *************************** */}
            <div className="text-gray-300 ml-[14%] min-h-[100vh] pt-[6vh] bg-gray-900 flex text-sm ">
                <div className="px-[90px] pt-20 w-full">
                    <div className="text-[34px] font-bold uppercase">Settings</div>
                    <SettingMenu option={'Profile'} />

                    {/* /////PROFILE USER /////*/}
                    <div className="p-3 py-7 flex gap-6 border-b border-gray-700 ">

                        <div>
                            <img src={userImg} alt="user image" className="max-w-[100px] rounded-full" />
                        </div>

                        <div className="flex flex-col justify-start ">
                            <div className=" mt-4">
                                <div className=" text-[23px] font-bold ">{userData.name} {userData.lastName}</div>
                                <div className="flex mt-2">
                                    <div className="text-[25px]">
                                        <RiStarLine color="yellow" />
                                    </div>
                                    <div className=" text-[23px] font-bold mt-1 ml-1">{userData.calification}</div>
                                </div>
                                <div className=" text-[13px] mt-1 ">{userData.email}</div>
                            </div>
                        </div>

                        <div className="pt-3 ml-20">
                            <div>
                                <div className="font-bold ">User Name</div>
                                <div>NatyS</div>
                            </div>
                            <div className="mt-6">
                                <div className="font-bold ">Phone Number</div>
                                <div>+54 351 0000000</div>
                            </div>
                        </div>

                        <div className="pt-3 ml-20">
                            <div>
                                <div className="font-bold ">Date of birth day</div>
                                <div>01/01/1900</div>
                            </div>
                            <div>
                                {/* <div className="font-bold ">Phone Number</div>
                                <div>+54 351 0000000</div> */}
                            </div>
                        </div>


                    </div>


                    {/* //OPTIONS// */}
                    <div className="flex flex-col justify-center items-center mb-[5rem] pb-14 border-b border-gray-700">

                        <div className="flex flex-col mt-7">
                            <div className="text-[12px] font-semibold">
                                Currency
                            </div>
                            <select name="" id="" className="bg-gray-900 border w-[360px] h-12">
                                <option value="">Option1</option>
                                <option value="">Option2</option>
                                <option value="">Option3</option>
                                <option value="">Option4</option>
                            </select>

                        </div>

                        <div className="flex flex-col mt-7">
                            <div className="text-[12px] font-semibold">
                                Language
                            </div>
                            <select name="" id="" className="bg-gray-900 border w-[360px] h-12">
                                <option value="">Option1</option>
                                <option value="">Option2</option>
                                <option value="">Option3</option>
                                <option value="">Option4</option>
                            </select>

                        </div>

                        <div className="flex flex-col mt-7">
                            <div className="text-[12px] font-semibold">
                                Time zone
                            </div>
                            <select name="" id="" className="bg-gray-900 border w-[360px] h-12">
                                <option value="">Option1</option>
                                <option value="">Option2</option>
                                <option value="">Option3</option>
                                <option value="">Option4</option>
                            </select>

                        </div>

                    </div>



                </div>
            </div>
        </div>
    )
}

export default Profile