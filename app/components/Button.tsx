import React from "react";

interface ButtonProps {
  styles?: string;
  children: React.ReactNode;
}

const Button = ({ styles, children }: ButtonProps) => {
  return (
    <a href="#courses">
      <button
        type="button"
        className={`py-1 btn px-8 sm:text-center  font-poppins font-medium text-[22px] text-primary outline-hidden rounded-[10px] hover:opacity-95 ${styles}`}
      >
        {children}
      </button>
    </a>
  );
};

export default Button;
