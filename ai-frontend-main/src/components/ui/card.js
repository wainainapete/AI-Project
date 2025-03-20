import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-md transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default { Card, CardContent };