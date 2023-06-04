"use client";
import React, { useState } from "react";
import CCCalculate from "./CCCalculate";
import FTCalculate from "./FTCalculate";
import CashByCode from "./CashByCode";
import MobileRecharge from "./MobileRecharge";
import Bkash from "./Bkash";
import Utility from "./Utility";
import DthBill from "./DthBill";
import QrPayment from "./QrPayment";

const options = [
  { value: "fundtransfer", label: "Fund Transfer" },
  { value: "creditcardbill", label: "Credit Card Bill Payment" },
  { value: "cashbycode", label: "Cash By Code" },
  { value: "bkashcashin", label: "Bkash Cash In" },
  { value: "mobilerecharge", label: "Mobile Recharge" },
  { value: "qrpayment", label: "Bangla QR Payment" },
  { value: "utility", label: "Utility Bill Payment" },
  { value: "dthbill", label: "Akash DTH Bill" },
];

const componentMap = {
  fundtransfer: <FTCalculate />,
  creditcardbill: <CCCalculate />,
  cashbycode: <CashByCode />,
  bkashcashin: <Bkash />,
  mobilerecharge: <MobileRecharge />,
  qrpayment: <QrPayment/>,
  utility: <Utility />,
  dthbill: <DthBill />,
};

function FeeCalculator() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="bg-white shadow-lg rounded  px-6 py-6 m-4 sm:min-w-[70vw] lg:min-w-[60vw] h-min-[50vh]  ">
      <form>
        <label>
          Choose Qpay Service to Calculate Your Charges:
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className="shadow appearance-none border-qpaytwo rounded w-full my-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value=""> Select Service </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </form>

      {selectedOption && componentMap[selectedOption]}
    </div>
  );
}

export default FeeCalculator;
