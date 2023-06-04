import { useState } from "react";

// Custom hook to calculate fee based on amount
function useCashByCode() {
  const [amountValue, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [vat, setVat] = useState(0);
  const [message, setmessage] = useState(false);

  const calculateFee = (event) => {
    const amount = parseFloat(amountValue);
    event.preventDefault();
    setmessage(true);

    if (amount >= 500 && amount <= 5000) {
      setFee(20);
      setVat(3);
    } else if (amount >= 5500 && amount <= 10000) {
      setFee(30);
      setVat(4.5);
    } else if (amount >= 10500 && amount <= 20000) {
      setFee(40);
      setVat(46);
    } else {
      setFee(0);
      setVat(0); // No fee if the value doesn't fall into any range
    }
  };

  return { amountValue, setAmount, fee, vat, calculateFee, message };
}

export default useCashByCode;
