import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, runTransaction, updateDoc, where, } from "firebase/firestore"
import { serverTimestamp } from "firebase/firestore"
import userImg from '../assets/images/user.webp'
import HashLoader from "react-spinners/ClipLoader";

import { RiCloseFill } from "react-icons/ri";
import TopMenu from "./TopMenu"
import LateralMenu from "./LateralMenu"



const SendRequest = () => {

    const { user, loading, userData, setUserData } = useAuth()

    const [loadingData, setLoadingData] = useState(true)

    const [transferRecipient, setTransferRecipient] = useState("")
    const [transferAmount, setTransferAmount] = useState('')
    const [transferPurpose, setTransferPurpose] = useState('')
    const [transferMessage, setTransferMessage] = useState()
    const [recipientSnapshot, setRecipientSnapshot] = useState(null);


    //POPUP FOR SENT
    const [popup, setPopup] = useState(false)
    const [fundSent, setFundSent] = useState(false)

    const handlePopup = () => {
        setPopup(!popup)
    }

    const validateDataSend = async () => {
        if (!userData || userData.money < transferAmount) {
            setTransferMessage('Insufficient funds');
            return false;
        }

        if (transferAmount === '') {
            setTransferMessage('Amount is empty')
            return false
        }
        if (transferPurpose === '') {
            setTransferMessage('Purpose of shipment cannot be empty')
            return false
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


    /* const handleTransfer = async () => {
        const isValid = await validateDataSend();
        if (isValid) {
            const db = getFirestore();
            const userRef = doc(db, 'users', user.uid);
            const recipientDoc = recipientSnapshot.docs[0];
            const recipientData = recipientDoc.data();


            //me aseguro que sube un numero a firebase y no un string
            const transferAmountNumber = Number(transferAmount);

            const transfer = {
                purpose: transferPurpose,
                amount: transferAmountNumber,
                date: new Date().toISOString()
            };



            try {
                // Realizar la transferencia
                await updateDoc(userRef, {
                    money: userData.money - transferAmountNumber,
                });
                await updateDoc(recipientDoc.ref, {
                    money: recipientData.money + transferAmountNumber,
                });

                // Agrega la transferencia al array en Firebase
                await updateDoc(userRef, {
                    transactions: arrayUnion(transfer)
                });
                setTransferMessage('Successful transfer');
                setFundSent(true)
                handlePopup(false)
            } catch (error) {
                setTransferMessage('Transfer failed');
            }
        }
    }; */



    /*   const handleTransfer = async () => {
          const isValid = await validateDataSend();
          if (isValid) {
              const db = getFirestore();
              const userRef = doc(db, 'users', user.uid);
              const recipientDoc = recipientSnapshot.docs[0];
              const recipientData = recipientDoc.data();
  
              const transferAmountNumber = Number(transferAmount);
  
              const transfer = {
                  purpose: transferPurpose,
                  amount: transferAmountNumber,
                  date: new Date().toISOString()
              };
  
              try {
                  // Realizar las lecturas necesarias antes de la transacción
                  const userSnapshot = await getDoc(userRef);
                  const userData = userSnapshot.data();
                  const recipientSnapshot = await getDoc(recipientDoc.ref);
                  const recipientData = recipientSnapshot.data();
  
                  await runTransaction(db, async (transaction) => {
                      // Verificar fondos del remitente
                      if (userData.money < transferAmountNumber) {
                          throw new Error('Insufficient funds');
                      }
  
                      // Realizar la transferencia desde el remitente
                      transaction.update(userRef, { money: userData.money - transferAmountNumber });
  
                      // Realizar la transferencia al destinatario
                      const recipientRef = doc(db, 'users', recipientDoc.id);
                      const recipientMoney = recipientData.money + transferAmountNumber;
                      transaction.update(recipientRef, { money: recipientMoney });
  
                      // Agregar la transferencia al array del remitente
                      const userTransactions = userData.transactions || [];
                      transaction.update(userRef, { transactions: [...userTransactions, transfer] });
  
                      // Agregar la transferencia al array del destinatario
                      const recipientTransactions = recipientData.transactions || [];
                      transaction.update(recipientRef, { transactions: [...recipientTransactions, transfer] });
                  });
  
                  setTransferMessage('Successful transfer');
                  setFundSent(true);
                  handlePopup(false);
              } catch (error) {
                  console.log(error);
                  setTransferMessage('Transfer failed');
              }
          }
      };
   */

    /*  import { getFirestore, doc, updateDoc, runTransaction, arrayUnion, serverTimestamp } from 'firebase/firestore'; */

    const handleTransfer = async () => {
        const isValid = await validateDataSend();
        if (isValid) {
            const db = getFirestore();
            const userRef = doc(db, 'users', user.uid);
            const recipientDoc = recipientSnapshot.docs[0];
            const recipientData = recipientDoc.data();

            const transferAmountNumber = Number(transferAmount);

            const transfer = {
                id: db.collection('transactions').doc().id, // Generar un ID único
                purpose: transferPurpose,
                amount: transferAmountNumber,
                date: serverTimestamp() // Utilizar el timestamp del servidor
            };

            try {
                await runTransaction(db, async (transaction) => {
                    // Realizar las lecturas necesarias antes de la transacción
                    const userSnapshot = await transaction.get(userRef);
                    const userData = userSnapshot.data();
                    const recipientSnapshot = await transaction.get(recipientDoc.ref);
                    const recipientData = recipientSnapshot.data();

                    // Verificar fondos del remitente
                    if (userData.money < transferAmountNumber) {
                        throw new Error('Insufficient funds');
                    }

                    // Realizar la transferencia desde el remitente
                    transaction.update(userRef, { money: userData.money - transferAmountNumber });

                    // Realizar la transferencia al destinatario
                    const recipientRef = doc(db, 'users', recipientDoc.id);
                    const recipientMoney = recipientData.money + transferAmountNumber;
                    transaction.update(recipientRef, { money: recipientMoney });

                    // Agregar la transferencia al array del remitente
                    const userTransactions = userData.transactions || [];
                    transaction.update(userRef, { transactions: [...userTransactions, transfer] });

                    // Agregar la transferencia al array del destinatario
                    const recipientTransactions = recipientData.transactions || [];
                    transaction.update(recipientRef, { transactions: [...recipientTransactions, transfer] });
                });

                setTransferMessage('Successful transfer');
                setFundSent(true);
                handlePopup(false);
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
                        inputMode="numeric"
                        autoComplete="off"
                        id="amount"
                        value={transferAmount}
                        onKeyDown={(e) => {
                            const allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "Delete", "Backspace"];
                            if (!allowedKeys.includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            const decimalIndex = inputValue.indexOf('.');

                            if (decimalIndex !== -1 && inputValue.slice(decimalIndex + 1).length > 2) {
                                return;
                            }

                            if (decimalIndex !== -1) {
                                const decimalPart = inputValue.slice(decimalIndex + 1, decimalIndex + 3);
                                const roundedValue = inputValue.slice(0, decimalIndex + 1) + decimalPart;
                                setTransferAmount(roundedValue);
                            } else {
                                setTransferAmount(inputValue);
                            }
                        }}
                    />




                    {/* <input
                        className="flex min-w-full h-[44px] bg-gray-900 border border-gray-600 px-3 text-[22px] rounded-sm"
                        type="number"
                        id="amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(Number(e.target.value))}
                    /> */}


                </div>

                <div className="px-40 ">
                    <div htmlFor="recipient" className="text-[11px] font-semiBold uppercase mb-1 mt-11">Purpose of shipment (Required)</div>

                    <input
                        className="flex min-w-full h-[44px] bg-gray-900 border border-gray-600 px-3 text-[13px] rounded-sm"
                        type="text"
                        id="purpose"
                        value={transferPurpose}
                        onChange={(e) => setTransferPurpose(e.target.value)}
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

export default SendRequest