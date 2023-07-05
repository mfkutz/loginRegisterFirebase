  /*   
    const handleTransfer = async () => {
  
  
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
            setTransferMessage('Successful transfer')
          } catch (error) {
            setTransferMessage('Transfer failed')
          }
  
        } else {
          setTransferMessage('Recipient not found')
        }
      }
      else {
        setTransferMessage('Insufficient funds')
      }
    }; */