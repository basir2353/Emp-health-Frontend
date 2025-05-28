import { Input, Tooltip } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ReactNode } from "react";

interface NumericInputProps {
  style: React.CSSProperties;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  size?: SizeType;
  maxLength?: number;
  suffix?: ReactNode;
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

export const BaseNumberInput = (props: NumericInputProps) => {
  const { value, onChange, style, suffix, maxLength, size, placeholder } =
    props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    let valueTemp = value;
    if (value.charAt(value.length - 1) === "." || value === "-") {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, "$1"));
  };

  const title = value ? (
    <span className="numeric-input-title">
      {value !== "-" ? formatNumber(Number(value)) : "-"}
    </span>
  ) : (
    "Input a number"
  );

  return (
    <Tooltip
      trigger={["focus"]}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        {...props}
        size={size}
        style={style}
        maxLength={maxLength}
        suffix={suffix}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Tooltip>
  );
};
