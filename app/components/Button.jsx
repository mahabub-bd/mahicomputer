import React from "react";

const Button = ({ styles,children }) => {
  return (
    <a href="#courses">
      <button
        type="button"
        className={`py-3 px-6 glow-on-hover bg-slate-800 text-white sm:text-center font-poppins font-medium text-[22px] text-primary outline-none rounded-[10px] hover:opacity-95 ${styles}`}
      >
        {children}
      </button>
    </a>
  );
};

export default Button;
