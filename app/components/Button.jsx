import React from "react";

const Button = ({ styles,children }) => {
  return (
    <button
      type="button"
      className={`py-3 px-6 glow-on-hover bg-[#FFB802] sm:text-center font-poppins font-medium text-[18px] text-primary outline-none rounded-[10px] hover:opacity-95 ${styles}`}
    >
      {children}
    </button>
  );
};

export default Button;
