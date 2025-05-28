import { useNode, useEditor } from "@craftjs/core";
import cx from "classnames";
import { useId } from "react";
import styled from "styled-components";

import { PollSettings } from "./PollSettings";

import { Text } from "../Text";

// type ButtonProps = {
//   background?: Record<"r" | "g" | "b" | "a", number>;
//   color?: Record<"r" | "g" | "b" | "a", number>;
//   buttonStyle?: string;
//   margin?: any[];
//   text?: string;
//   textComponent?: any;
//   options?: string[];
//   gap?: number;
// };

const StyledButton = styled.button`
  background: ${(props) =>
    props.buttonStyle === "full"
      ? `rgba(${Object.values(props.background)})`
      : "transparent"};
  border: 2px solid transparent;
  border-color: ${(props) =>
    props.buttonStyle === "outline"
      ? `rgba(${Object.values(props.background)})`
      : "transparent"};
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  margin: ${({ margin }) =>
    `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`};
  display: flex;
  flex-direction: column;
  width: 100%;
  row-gap: ${({ gap }) => gap + "px"};
`;

export const Poll = (props) => {
  const {
    connectors: { connect },
    setProp,
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const id = useId();

  const { text, textComponent, color, options, margin, gap, ...otherProps } =
    props;
  return (
    <Wrapper ref={connect} margin={margin} gap={gap}>
      <Text {...textComponent} text={text} margin={[0, 0, 0, 20]} />
      {options.map((option, index) => (
        <StyledButton
          className={cx([
            "rounded w-full px-4 py-2",
            {
              // "shadow-lg": props.buttonStyle === "full",
            },
          ])}
          {...otherProps}
          onClick={(e) => {
            if (!enabled) e.currentTarget.querySelector("input").checked = true;
          }}
        >
          <input
            type="radio"
            style={{
              width: "20px",
              height: "20px",
              marginRight: "15px",
              colorScheme: "light",
              accentColor: "gray",
            }}
            name={id}
            value={index}
            disabled={enabled}
          />
          <Text
            {...textComponent}
            width="calc(100% - 64px)"
            text={option}
            color={props.color}
            textAlign="left"
            setme={["options", index]}
            connectRef={false}
          />
          {options.length > 2 && enabled && (
            <svg
              style={{ width: "22px", height: "20px", marginLeft: "12px" }}
              viewBox="0 0 20 20"
              onClick={() => {
                setProp((prop) => prop.options.splice(index, 1));
              }}
              fill={`rgba(${Object.values(props.color)})`}
            >
              <path d="M13.8702 6.47008C13.8702 6.37186 13.7899 6.2915 13.6917 6.2915L12.2184 6.2982L9.99969 8.94329L7.78317 6.30043L6.30772 6.29374C6.20951 6.29374 6.12915 6.37186 6.12915 6.47231C6.12915 6.51472 6.14478 6.5549 6.17156 6.58838L9.07558 10.0482L6.17156 13.5058C6.14459 13.5385 6.12962 13.5795 6.12915 13.6219C6.12915 13.7201 6.20951 13.8004 6.30772 13.8004L7.78317 13.7937L9.99969 11.1486L12.2162 13.7915L13.6894 13.7982C13.7876 13.7982 13.868 13.7201 13.868 13.6196C13.868 13.5772 13.8524 13.537 13.8256 13.5036L10.926 10.046L13.83 6.58615C13.8568 6.5549 13.8702 6.51249 13.8702 6.47008Z" />
              <path d="M10 0C4.47768 0 0 4.47768 0 10C0 15.5223 4.47768 20 10 20C15.5223 20 20 15.5223 20 10C20 4.47768 15.5223 0 10 0ZM10 18.3036C5.41518 18.3036 1.69643 14.5848 1.69643 10C1.69643 5.41518 5.41518 1.69643 10 1.69643C14.5848 1.69643 18.3036 5.41518 18.3036 10C18.3036 14.5848 14.5848 18.3036 10 18.3036Z" />
            </svg>
          )}
        </StyledButton>
      ))}
      {options.length < 5 && enabled && selected && (
        <StyledButton
          className={cx([
            "rounded w-full px-4 py-2",
            {
              // "shadow-lg": props.buttonStyle === "full",
            },
          ])}
          style={{ justifyContent: "center" }}
          {...otherProps}
          onClick={() => {
            setProp((prop) => {
              prop.options.push("Option " + (prop.options.length + 1));
            });
          }}
        >
          <svg
            style={{ width: "40px", height: "19px" }}
            viewBox="0 0 21 20"
            fill={`rgba(${Object.values(props.color)})`}
          >
            <path d="M14.607 9.28676H11.2141V5.8939C11.2141 5.79569 11.1338 5.71533 11.0355 5.71533H9.96411C9.8659 5.71533 9.78554 5.79569 9.78554 5.8939V9.28676H6.39268C6.29447 9.28676 6.21411 9.36712 6.21411 9.46533V10.5368C6.21411 10.635 6.29447 10.7153 6.39268 10.7153H9.78554V14.1082C9.78554 14.2064 9.8659 14.2868 9.96411 14.2868H11.0355C11.1338 14.2868 11.2141 14.2064 11.2141 14.1082V10.7153H14.607C14.7052 10.7153 14.7855 10.635 14.7855 10.5368V9.46533C14.7855 9.36712 14.7052 9.28676 14.607 9.28676Z" />
            <path d="M10.5 0C4.97768 0 0.5 4.47768 0.5 10C0.5 15.5223 4.97768 20 10.5 20C16.0223 20 20.5 15.5223 20.5 10C20.5 4.47768 16.0223 0 10.5 0ZM10.5 18.3036C5.91518 18.3036 2.19643 14.5848 2.19643 10C2.19643 5.41518 5.91518 1.69643 10.5 1.69643C15.0848 1.69643 18.8036 5.41518 18.8036 10C18.8036 14.5848 15.0848 18.3036 10.5 18.3036Z" />
          </svg>
          <Text
            {...textComponent}
            text={"Add Choice"}
            color={props.color}
            allwaysDisabled={true}
            connectRef={false}
            width="auto"
          />
        </StyledButton>
      )}
    </Wrapper>
  );
};

Poll.craft = {
  displayName: "Poll",
  props: {
    background: { r: 141, g: 218, b: 255, a: 1 },
    color: { r: 30, g: 30, b: 30, a: 1 },
    buttonStyle: "full",
    text: "Type Poll Question Here",
    margin: ["5", "0", "5", "0"],
    textComponent: {
      ...Text.craft.props,
    },
    options: ["Option 1", "Option 2"],
    gap: 8,
  },
  related: {
    toolbar: PollSettings,
  },
};
