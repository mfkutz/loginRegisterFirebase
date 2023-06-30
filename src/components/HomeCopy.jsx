
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { doc, getFirestore, onSnapshot } from "firebase/firestore"




const Home = () => {

  const { user, logout, loading } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loadingData, setLoadingData] = useState(true)


  const [transferAmount, setTransferAmount] = useState(0);
  const [transferRecipient, setTransferRecipient] = useState("");

  //LOGOUT
  const handleLogout = async () => {
    await logout()
  }


  //TRANSFERENCIAS
  const handleTransfer = async () => {
    if (userData && userData.money >= transferAmount) {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const recipientRef = doc(db, "users", transferRecipient);

      try {
        // Realizar la transferencia
        await updateDoc(userRef, {
          money: userData.money - transferAmount,
        });

        await updateDoc(recipientRef, {
          money: userData.money + transferAmount,
        });

        // Actualizar los datos del usuario actual
        const userSnapshot = await userRef.get();
        const userData = userSnapshot.data();
        setUserData(userData);
      } catch (error) {
        console.log("Error during transfer:", error);
      }
    }
  };


  useEffect(() => {
    if (user) {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserData(data)
          setLoadingData(false)
        }
      });

      return () => unsubscribe();
    }
  }, [user]);


  if (loading || loadingData) return <h1>Loading...</h1>


  return (
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
  )
}

export default Home