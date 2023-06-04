import { useState } from "react";

// Custom hook to calculate fee based on amount
function useCreditcard() {
  const [amountValue, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [vat, setVat] = useState(0);
  const [message, setmessage] = useState(false);

  const calculateFee = (event) => {
    const amount = parseFloat(amountValue);
    event.preventDefault();
    setmessage(true);

    if (amount >= 0 && amount <= 20000) {
      setFee(20);
      setVat(3);
    } else if (amount >= 20001 && amount <= 200000) {
      setFee((amount * 0.1) / 100);
      setVat(((amount * 0.1) / 100) * 0.15);
    } else {
      setFee(0);
      setVat(0);
    }
  };

  return { amountValue, setAmount, fee,vat, calculateFee, message };
}

export default useCreditcard;
