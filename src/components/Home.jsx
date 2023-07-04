import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { collection, doc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore"

import logo from '../assets/images/logo3.png'
import userImg from '../assets/images/user.webp'
import { RiStarLine } from "react-icons/ri";
import { RiSettings3Line } from "react-icons/ri";
import { RiExchangeDollarLine } from "react-icons/ri";
import { RiSendPlane2Line } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BiHelpCircle } from "react-icons/bi";
import { BiHistory } from "react-icons/bi";
import { GiReceiveMoney } from "react-icons/gi";
import { Link } from "react-router-dom"

const Home = () => {
  const { user, logout, loading } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [transferAmount, setTransferAmount] = useState('')
  const [transferRecipient, setTransferRecipient] = useState("")
  const [transferMessage, setTransferMessage] = useState()

  const handleLogout = async () => {
    await logout()
  }

  const handleTransfer = async () => {


    console.log("userData.money:", userData.money);
    console.log("transferAmount:", transferAmount);


    if (userData && userData.money >= transferAmount) {
      const db = getFirestore()
      const userRef = doc(db, "users", user.uid)
      const recipientRef = collection(db, "users")
      const recipientQuery = query(recipientRef, where("email", "==", transferRecipient))
      const recipientSnapshot = await getDocs(recipientQuery)

      if (!recipientSnapshot.empty) {
        const recipientDoc = recipientSnapshot.docs[0]
        const recipientData = recipientDoc.data()
        const recipientId = recipientDoc.id

        if (recipientId === user.uid) {
          setTransferMessage(`You can't send money to yourself`)
          return
        }

        try {
          // Realizar la transferencia
          await updateDoc(userRef, {
            money: userData.money - transferAmount,
          })

          await updateDoc(recipientDoc.ref, {
            money: recipientData.money + transferAmount,
          })

          setTransferMessage('Transferencia realizada')
        } catch (error) {
          setTransferMessage('Error en la transferencia')
        }

      } else {
        setTransferMessage('Destinatario no encontrado')
      }
    }
    else {
      setTransferMessage('Fondos insuficientes')
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

  if (loading || loadingData) return <h1>Loading...</h1>

  return (
    <div>

      <div className="fixed bg-gray-900 min-h-screen w-[14%] " >


        <div className="overflow-y-auto h-screen">
          {/* ********************CABECERA******************* */}
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

          {/* ****************** ALL MENU *********************** */}
          <div className="flex flex-col justify-between  h-[75%]">

            <div className="flex flex-col ">

              {/* ********************MENU ONE******************* */}
              <div className=" border-gray-600 p-5 min-h-[30vh] flex flex-col gap-2 ">

                <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                  <GiReceiveMoney />
                  <div className="text-[13px]">
                    Add money (P2P)
                  </div>
                </Link>

                <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                  <BiMoneyWithdraw />
                  <div className="text-[13px]">
                    Whitdraw (P2P)
                  </div>
                </Link>

                <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                  <RiSendPlane2Line />
                  <div className="text-[13px]">
                    Send Money
                  </div>
                </Link>

                <Link className="flex items center text-gray-300 text-[21px] gap-1 mb-3">
                  <RiExchangeDollarLine />
                  <div className="text-[13px]">
                    Accept transactions
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
                <BiMoneyWithdraw />
                <div className="text-[13px]">
                  Log Out
                </div>
              </div>

            </div>

          </div>

        </div>



      </div>

      <div className=" bg-gray-400 ml-[14%]">
        <div>Home</div>
        <p>Welcome {userData.name} {userData.lastName}!</p>
        <p>Email: {userData.email}</p>
        <p>Money: ${userData.money}</p>

        <h2>Transfer Money</h2>
        <label htmlFor="recipient">Recipient:</label>
        <input
          type="text"
          id="recipient"
          value={transferRecipient}
          onChange={(e) => setTransferRecipient(e.target.value)}
        />

        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(Number(e.target.value))}
        />

        <button onClick={handleTransfer}>Transfer</button>
        <button onClick={handleLogout}>Logout</button>

        <div>
          <p>{transferMessage}</p>
        </div>
      </div>

    </div>

  )
}

export default Home
