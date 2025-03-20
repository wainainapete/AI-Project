import React from "react";
import { Button as AntButton } from "antd";

export function Button({ children, type = "primary", onClick, icon, loading = false, className = "", shape = "default" }) {
  return (
    <AntButton 
      type={type} 
      icon={icon} 
      loading={loading} 
      shape={shape} 
      onClick={onClick} 
      className={className}
    >
      {children}
    </AntButton>
  );
}
