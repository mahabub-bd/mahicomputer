import React from "react";

const Button = ({ styles,children }) => {
  return (
    <a href="#courses">
      <button
        type="button"
        href="../courses"
        className={`py-1 btn px-8 sm:text-center  font-poppins font-medium text-[22px] text-primary outline-none rounded-[10px] hover:opacity-95 ${styles}`}
      >
        {children}
      </button>
    </a>
  );
};

export default Button;
