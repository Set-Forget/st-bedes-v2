import React from "react";

const Container = ({ children, className,...props }: {
  children: React.ReactNode;
  className: string;
}) => {
  const containerClass = `mx-auto max-w-[1440px] md:px-5 ${className || ""}`;

  return (
    <div className={containerClass} {...props}>
      {children}
    </div>
  );
};

export default Container;