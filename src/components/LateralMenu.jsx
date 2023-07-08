import logo from '../assets/images/logo3.png'
import { RiStarLine } from "react-icons/ri";
import { RiHome8Line } from "react-icons/ri";
import { RiSettings3Line } from "react-icons/ri";
import { RiExchangeDollarLine } from "react-icons/ri";
import { RiSendPlane2Line } from "react-icons/ri";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BiHelpCircle } from "react-icons/bi";
import { BiHistory } from "react-icons/bi";
import { GiReceiveMoney } from "react-icons/gi";
import { Link } from "react-router-dom"
import userImg from '../assets/images/user.webp'
import { useAuth } from '../context/AuthContext';


const LateralMenu = () => {

    const { user, logout, loading, userData, setUserData, handleLogout } = useAuth()

    if (loading) return (
        <div className="bg-gray-900 text-gray-300 h-screen flex items-center justify-center">
            <h1 className="" ><HashLoader color="#eeeeee" /></h1>
        </div>
    )

    return (
        <div className="fixed bg-gray-900 min-h-screen w-[14%] border-r border-gray-600" >


            <div className="overflow-y-auto h-screen">
                {/* ******************** CABECERA MENU ******************* */}
                <div className="border-b border-gray-600 p-5">

                    <div className="flex justify-center">
                        <img src={logo} alt="logo interlan" className="w-[110px]" />
                    </div>

                    <div className="mt-3 flex items-center">
                        <img src={userImg} alt="user logo" className="rounded-full w-[34px]" />
                        <p className="text-[14px] text-gray-300 pl-1"> {userData.name} {userData.lastName}</p>
                    </div>

                    <div className="justify-center flex items-center gap-1 mt-2 text-gray-300 text-[18px]">
                        <RiStarLine />
                        <div className="text-[13px]">
                            {userData.calification}
                        </div>
                    </div>
                </div>

                {/* ****************** MENU OPTIONS *********************** */}
                <div className="flex flex-col justify-between  h-[75%]">

                    <div className="flex flex-col ">

                        {/* ********************MENU ONE******************* */}
                        <div className=" border-gray-600 p-5 min-h-[30vh] flex flex-col gap-2 ">

                            <Link to={'/'} className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                                <RiHome8Line />
                                <div className="text-[13px]">
                                    Home
                                </div>
                            </Link>

                            <Link to={'/add'} className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                                <GiReceiveMoney />
                                <div className="text-[13px]">
                                    Add Money (P2P)
                                </div>
                            </Link>

                            <Link to={'/withdraw'} className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                                <BiMoneyWithdraw />
                                <div className="text-[13px]">
                                    Withdraw (P2P)
                                </div>
                            </Link>

                            <Link to={'/send-request'} className="flex items center text-gray-300 text-[21px] gap-1 mb-3" >
                                <RiSendPlane2Line />
                                <div className="text-[13px]">
                                    Send Money
                                </div>
                            </Link>

                            <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                                <RiExchangeDollarLine />
                                <div className="text-[13px]">
                                    Accept Transactions
                                </div>
                            </Link>

                            <Link to={'/history'} className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                                <BiHistory />
                                <div className="text-[13px]">
                                    History
                                </div>
                            </Link>

                        </div>


                        {/* ********************MENU TWO******************* */}
                        <div className="border-b border-gray-600 p-5 gap-2 flex flex-col">

                            <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                                <BiHelpCircle />
                                <div className="text-[13px]">
                                    Support
                                </div>
                            </Link>

                            <Link to={'/settings'} className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                                <RiSettings3Line />
                                <div className="text-[13px]">
                                    Settings
                                </div>
                            </Link>

                        </div>
                    </div>
                    {/* ********************MENU THREE******************* */}
                    <div className=" border-t border-gray-600 p-5 ">

                        <div className="flex items center text-gray-300 text-[21px] gap-1 cursor-pointer" onClick={handleLogout}>
                            <RiLogoutBoxRLine />
                            <div className="text-[13px]">
                                Log Out
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LateralMenu