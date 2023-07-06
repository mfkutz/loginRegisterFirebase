import { useState } from "react";
import { RiEyeLine } from "react-icons/ri";
import { RiEyeOffLine } from "react-icons/ri";
import { RiNotification2Line } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

const TopMenu = () => {

    const [iconEye, setIconEye] = useState(true)
    const { userData } = useAuth()

    const handleIconEye = () => {
        setIconEye(!iconEye)
    }
    return (
        <div className="bg-gray-900 ml-[14%] p-6 justify-between h-[10vh] flex items-center border-b border-gray-600">
            <div className="text-gray-300 text-[20px]">
                <RiNotification2Line />
            </div>

            <div className="text-[14px] text-gray-300 flex items-center">
                <div className={`text-[24px] cursor-pointer ${iconEye ? '' : 'hidden'}`} onClick={handleIconEye}>
                    <RiEyeLine />
                </div>
                <div className={`text-[24px] cursor-pointer ${iconEye ? 'hidden' : ''}`} onClick={handleIconEye}>
                    <RiEyeOffLine />
                </div>
                <span className="mx-2">Balance:</span>
                <div>${iconEye ? userData.money.toFixed(2) : '*****'} USD</div>
            </div>
        </div>
    )
}

export default TopMenu