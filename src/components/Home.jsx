import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { collection, doc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore"

import logo from '../assets/images/logo3.png'
import userImg from '../assets/images/user.webp'
import { RiStarLine } from "react-icons/ri";
import { RiSettings3Line } from "react-icons/ri";
import { RiExchangeDollarLine } from "react-icons/ri";
import { RiSendPlane2Line } from "react-icons/ri";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BiHelpCircle } from "react-icons/bi";
import { BiHistory } from "react-icons/bi";
import { GiReceiveMoney } from "react-icons/gi";
import { Link } from "react-router-dom"


import HashLoader from "react-spinners/ClipLoader";

import { RiCloseFill } from "react-icons/ri";
import TopMenu from "./TopMenu"



const Home = () => {
  const { user, logout, loading } = useAuth()

  
  const [userData, setUserData] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [transferAmount, setTransferAmount] = useState('')
  const [transferRecipient, setTransferRecipient] = useState("")
  const [transferMessage, setTransferMessage] = useState()
  const [recipientSnapshot, setRecipientSnapshot] = useState(null);


  //POPUP FOR SENT
  const [popup, setPopup] = useState(false)
  const [fundSent, setFundSent] = useState(false)

  const handlePopup = () => {
    setPopup(!popup)
  }


  const handleLogout = async () => {
    await logout()
  }

  const validateDataSend = async () => {
    if (!userData || userData.money < transferAmount) {
      setTransferMessage('Insufficient funds');
      return false;
    }
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    const recipientRef = collection(db, 'users');
    const recipientQuery = query(recipientRef, where('email', '==', transferRecipient));
    const recipientSnapshot = await getDocs(recipientQuery);

    if (recipientSnapshot.empty) {
      setTransferMessage('Recipient not found');
      return false;
    }
    const recipientDoc = recipientSnapshot.docs[0];
    const recipientId = recipientDoc.id;
    if (recipientId === user.uid) {
      setTransferMessage(`You can't send money to yourself`);
      return false;
    }
    setRecipientSnapshot(recipientSnapshot);
    handlePopup()
    return true;
  }

  const handleTransfer = async () => {
    const isValid = await validateDataSend();
    if (isValid) {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      const recipientDoc = recipientSnapshot.docs[0];
      const recipientData = recipientDoc.data();
      try {
        // Realizar la transferencia
        await updateDoc(userRef, {
          money: userData.money - transferAmount,
        });
        await updateDoc(recipientDoc.ref, {
          money: recipientData.money + transferAmount,
        });
        setTransferMessage('Successful transfer');
        setFundSent(true)
        handlePopup(false)
      } catch (error) {
        setTransferMessage('Transfer failed');
      }
    }
  };


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
  }, [user])

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
  }, [loadingData, user])

  if (loading || loadingData) return (
    <div className="bg-gray-900 text-gray-300 h-screen flex items-center justify-center">
      <h1 className="" ><HashLoader color="#eeeeee" /></h1>
    </div>
  )

  return (
    <div className="relative">




      {/* ******************** LATERAL MENU******************* */}
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

                <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                  <GiReceiveMoney />
                  <div className="text-[13px]">
                    Add Money (P2P)
                  </div>
                </Link>

                <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                  <BiMoneyWithdraw />
                  <div className="text-[13px]">
                    Whitdraw (P2P)
                  </div>
                </Link>

                <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3" >
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

                <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
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

                <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
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

      {/* *************************** BALANCE MENU TOP ****************************/}
      <TopMenu userData={userData} />



      {/* *************************  SEND MONEY   *************************** */}
      <div className={`text-gray-300 ml-[14%] h-[90vh] bg-gray-900 ${fundSent ? 'hidden' : ''}`}>
        <div className="text-gray-300 uppercase text-[34px] font-bold px-40 pt-20" >Send funds</div>
        <div className="text-gray-300 uppercase text-[12px] font-bold px-40 mb-8" >Internal transfer</div>


        <div className="px-40 ">
          <div htmlFor="recipient" className="text-[11px] font-semiBold uppercase mb-1">Transfer with E-mail user</div>

          <input
            className="flex min-w-full h-[44px] bg-gray-900 border border-gray-600 px-3 text-[13px] rounded-sm"
            type="text"
            id="recipient"
            value={transferRecipient}
            onChange={(e) => setTransferRecipient(e.target.value)}
          />
        </div>

        <div className="px-40 ">
          <div htmlFor="recipient" className="text-[11px] font-semiBold uppercase mb-1 mt-11">Funds to send</div>

          <input
            className="flex min-w-full h-[44px] bg-gray-900 border border-gray-600 px-3 text-[22px] rounded-sm"
            type="number"
            id="amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(Number(e.target.value))}
          />
        </div>

        <div className="px-40 ">
          <div htmlFor="recipient" className="text-[11px] font-semiBold uppercase mb-1 mt-11">Purpose of shipment (Required)</div>

          <input
            className="flex min-w-full h-[44px] bg-gray-900 border border-gray-600 px-3 text-[13px] rounded-sm"
            type="text"
            id="amount"
          /* value={transferAmount} */
          /* onChange={(e) => setTransferAmount(Number(e.target.value))} */
          />

          <p className="text-[13px] mt-1 font-bold text-red-600">{transferMessage}</p>

        </div>

        <div className="flex justify-center">
          <button onClick={validateDataSend} className="bg-blue-500 w-[100px] flex justify-center h-[34px] items-center mt-8 rounded-sm">Send</button>
        </div>

      </div>

      {/* **************************** POPUP SEND  ********************************* */}

      <div className={`border rounded-sm border-gray-600 specialShadow absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-gray-300 w-[510px] h-[350px] z-40 ${popup ? '' : 'hidden'}`}>
        <div className="text-[24px] justify-end flex p-2">
          <RiCloseFill onClick={handlePopup} className="cursor-pointer" />
        </div>
        <div className="flex justify-center uppercase font-bold text-[23px]">
          Confirm shipment
        </div>
        <div className="text-xs flex justify-center">(Final action)</div>
        <div className="text-sm flex justify-center mt-4">Funds to send</div>
        <div className="text-4xl font-extrabold flex justify-center mt-2">${transferAmount}</div>
        <div className="text-sm flex justify-center mt-4">to</div>
        <div className="text-xl flex justify-center mt-4">{transferRecipient}</div>

        <div className="flex items-center justify-evenly ">
          <button onClick={handlePopup} className="bg-red-500 w-[100px] flex justify-center h-[34px] items-center mt-8 rounded-sm">Cancel</button>
          <button onClick={handleTransfer} className="bg-blue-500 w-[100px] flex justify-center h-[34px] items-center mt-8 rounded-sm">Send</button>
        </div>
      </div>

      {/* ****************************  SENT  ********************************* */}
      <div className={`ml-[14%] h-[90vh] bg-gray-900 text-gray-300 px-40 ${fundSent ? '' : 'hidden'}`}>

        <div className="text-[34px] font-bold pt-20">
          {transferMessage}
        </div>

        <div className="mt-9 flex items-center " >
          <img src={userImg} alt="user image" className="w-[70px] rounded-full" />
          <p className="ml-3">{transferRecipient}</p>
        </div>

        <div className="flex justify-center text-[40px] font-bold">${transferAmount}</div>

        <div className="uppercase text-sm border-b border-gray-600 pb-2">
          Details
        </div>

        <div className="text-[18px] font-bold mt-3">Details of transaction</div>
        <div className="mt-3 flex justify-between">
          <div className="text-[12px]">
            <div>Funds sent to:</div>
            <div>Date completed</div>
            <div>ID of transaction</div>
          </div>

          <div className="text-[12px]">
            <div>{transferRecipient}</div>
            <div>Date completed</div>
            <div>ID of transaction</div>
          </div>

        </div>
      </div>
    </div>

  )
}

export default Home
