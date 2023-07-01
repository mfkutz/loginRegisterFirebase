import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { collection, doc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore"

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
  )
}

export default Home
