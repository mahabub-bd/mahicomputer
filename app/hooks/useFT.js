import { useState } from "react";

// Custom hook to calculate fee based on amount
function useFT() {
  const [amountValue, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [vat, setVat] = useState(0);
  const [message, setmessage] = useState(false);

  const calculateFee = (event) => {
    const amount = parseFloat(amountValue);
    event.preventDefault();
    setmessage(true);

    if (amount >= 500 && amount <= 5000) {
      setFee(10);
      setVat(1.5);
    } else if (amount >= 5001 && amount <= 10000) {
      setFee(15);
      setVat(2.25);
    } else if (amount >= 10001 && amount <= 20000) {
      setFee(20);
      setVat(3);
    } else if (amount >= 20001 && amount <= 50000) {
      setFee(35);
      setVat(5.25);
    } else if (amount >= 50001 && amount <= 100000) {
      setFee(45);
      setVat(6.75);
    } else {
      setFee(0);
    }
  };

  return { amountValue, setAmount, fee, vat, calculateFee, message };
}

export default useFT;
