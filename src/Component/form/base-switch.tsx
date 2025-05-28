import { Switch } from "antd";
import React from "react";

interface SwitchProps {
  style?: React.CSSProperties;
  value?: string;
  leftText?: string;
  rightText?: string;
  defaultChecked?: boolean;
  onChange: (value: boolean) => void;
}

const BaseSwitch = (props: SwitchProps) => {
  const { style, onChange, defaultChecked, leftText, rightText } = props;

  const handleChange = (checked: boolean) => {
    onChange(checked);
  };

  return (
    <div style={style}>
      <span> {leftText}</span>
      <Switch
        defaultChecked={defaultChecked}
        onChange={handleChange}
        style={style}
      />
      <span>{rightText}</span>
    </div>
  );
};

export default BaseSwitch;
