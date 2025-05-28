import { Switch } from "antd";
import { useState } from "react";

const InputWithSwitch = ({
  leftText,
  rightText,
}: {
  leftText: string;
  rightText: string;
}) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span> {leftText}</span> <Switch style={{ margin: "0px 5px" }} />
      <span>{rightText}</span>
    </div>
  );
};

export default InputWithSwitch;
