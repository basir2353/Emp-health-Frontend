import { Button } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";

interface BaseButtonProps {
  type?: "primary" | "dashed" | "link" | "text" | "default";
  size?: SizeType;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  size,
  style,
  type,
  children,
  onClick,
}) => {
  return (
    <Button type={type} size={size} style={style} onClick={onClick}>
      {children}
    </Button>
  );
};
