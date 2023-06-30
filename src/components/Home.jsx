import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { collection, doc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore"

const Home = () => {
  const { user, logout, loading } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [transferAmount, setTransferAmount] = useState(0)
  const [transferRecipient, setTransferRecipient] = useState("")

  const [transferMessage, setTransferMessage] = useState()
  /* const [errorDest, setErrorDest] = useState()
  const [errorTransfer, setErrortransfer] = useState() */

  const handleLogout = async () => {
    await logout()
  }


  const handleTransfer = async () => {
    if (userData && userData.money >= transferAmount) {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const recipientRef = collection(db, "users");
      const recipientQuery = query(recipientRef, where("email", "==", transferRecipient));
      const recipientSnapshot = await getDocs(recipientQuery);

      if (!recipientSnapshot.empty) {
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

          // Actualizar los datos del usuario actual con los datos después de la transferencia
          setUserData((prevUserData) => ({
            ...prevUserData,
            money: prevUserData.money - transferAmount,
          }))
          setTransferMessage('Transferencia realizada')
        } catch (error) {
          setTransferMessage("Error en la transferencia:", error)
        }
      } else {

        setTransferMessage('Destinatario no encontrado')
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

  if (loading || loadingData) return <h1>Loading...</h1>

  return (
    <div>


      <div>
        <div>Home</div>
        <p>Welcome {user.email}</p>
        <p>Name: {userData.name}</p>
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

      </div>

      <div>
        <p>{transferMessage}</p>
      </div>
    </div>

  )
}

export default Home
