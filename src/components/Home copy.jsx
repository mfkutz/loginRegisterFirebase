import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { collection, doc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import userImg from '../assets/images/user.webp'
import HashLoader from "react-spinners/ClipLoader";

import { RiCloseFill } from "react-icons/ri";
import TopMenu from "./TopMenu"
import LateralMenu from "./LateralMenu"


const Home = () => {

  const { user, logout, loading, userData, setUserData, handleLogout } = useAuth()

  const [loadingData, setLoadingData] = useState(true)

  /*  const [transferAmount, setTransferAmount] = useState('')
   const [transferRecipient, setTransferRecipient] = useState("")
   const [transferMessage, setTransferMessage] = useState()
   const [recipientSnapshot, setRecipientSnapshot] = useState(null); */


  //POPUP FOR SENT
  /* const [popup, setPopup] = useState(false)
  const [fundSent, setFundSent] = useState(false) */

  /*    const handlePopup = () => {
       setPopup(!popup)
     } */

  /*     const validateDataSend = async () => {
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
     }  */

  /*  const handleTransfer = async () => {
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
   }; */


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
      <div className="text-gray-300 ml-[14%] h-[90vh] bg-gray-900">Home</div>

    </div>

  )
}

export default Home
