import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="bg-white text-indigo-600 px-6 py-3 text-lg font-semibold rounded-full shadow-lg hover:bg-gray-200 transition"
    >
      {children}
    </button>
  );
};

export default Button;
