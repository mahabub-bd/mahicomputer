import React from "react";

const Button = ({ styles }) => {
  return (
    <button
      type="button"
      className={`py-4 px-6  bg-[#FFB802] sm:text-center font-poppins font-medium text-[18px] text-primary outline-none rounded-[10px] hover:opacity-95 ${styles}`}
    >
      Get Started
    </button>
  );
};

export default Button;
