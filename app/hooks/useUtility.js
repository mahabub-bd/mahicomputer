import { useState } from "react";

// Custom hook to calculate fee based on amount
function useUtility() {
  const [amountValue, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
 
  const [message, setmessage] = useState(false);

  const calculateFee = (event) => {
    const amount = parseFloat(amountValue);
    event.preventDefault();
    setmessage(true);

    if (amount >= 1 && amount <= 600) {
      setFee(6);
     
    } else if (amount >= 601 && amount <= 1000) {
      setFee(9);
      
    } else if (amount >= 1001 && amount <= 300000) {
      setFee(Math.min(amount * 0.01, 30));
 
    } else {
      setFee(0);
     // No fee if the value doesn't fall into any range
    }
  };

  return { amountValue, setAmount, fee, calculateFee, message };
}

export default useUtility;
