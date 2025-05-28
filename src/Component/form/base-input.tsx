import { Input } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import React from "react";

interface InputProps {
  style?: React.CSSProperties;
  size?: SizeType;
  placeholder?: string;
  value: string;
  target?: any;
  onChange: (value: string) => void;
}

const BaseInput: React.FC<InputProps> = ({
  placeholder,
  size,
  style,
  onChange,
  value,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    onChange(inputValue);
  };

  return (
    <Input
      value={value}
      size={size}
      placeholder={placeholder}
      style={style}
      onChange={handleChange}
    />
  );
};

export default BaseInput;
