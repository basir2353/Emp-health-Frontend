import { useContext } from "react";
import { Context } from "../../../Context";
import { useEditor } from "@craftjs/core";
import { ContainerSettings } from "./ContainerSettings";
import { Resizer } from "../Resizer";

// export type ContainerProps = {
//   background: Record<"r" | "g" | "b" | "a", number>;
//   color: Record<"r" | "g" | "b" | "a", number>;
//   flexDirection: string;
//   alignItems: string;
//   justifyContent: string;
//   fillSpace: string;
//   width: string;
//   height: string;
//   padding: string[];
//   margin: string[];
//   marginTop: number;
//   marginLeft: number;
//   marginBottom: number;
//   marginRight: number;
//   shadow: number;
//   children: React.ReactNode;
//   radius: number;
//   appendNewPageButton: Boolean;
//   customStyles: Record<string, string>;
// };

const defaultProps = {
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  fillSpace: "no",
  padding: ["0", "0", "0", "0"],
  margin: ["0", "0", "0", "0"],
  background: { r: 255, g: 255, b: 255, a: 1 },
  color: { r: 0, g: 0, b: 0, a: 1 },
  shadow: 0,
  radius: 0,
  width: "100%",
  height: "auto",
};

export const Container = ({ customStyles, ...props }) => {
  const {
    pages,
    setPages,
    selectedPage,
    setSelectedPage,
    defaultPage,
    readOnly,
  } = useContext(Context);

  const { actions, query } = useEditor();

  const {
    flexDirection,
    alignItems,
    justifyContent,
    fillSpace,
    background,
    color,
    padding,
    margin,
    shadow,
    radius,
    children,
  } = {
    ...defaultProps,
    ...props,
  };

  return (
    <>
      <div
        style={{
          ...customStyles,
          borderRadius: `${radius}px`,
          margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        }}
      >
        <Resizer
          resizeProps={{ maxWidth: 950, minWidth: 500, minHeight: 450 }}
          propKey={{ width: "width", height: "height" }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              overflow: "hidden",
              justifyContent,
              flexDirection,
              alignItems,
              background: `rgba(${Object.values(background)})`,
              color: `rgba(${Object.values(color)})`,
              padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
              boxShadow:
                shadow === 0
                  ? "none"
                  : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`,
              borderRadius: `${radius}px`,
              flex: fillSpace === "yes" ? 1 : "unset",
            }}
          >
            {children}
          </div>
        </Resizer>
      </div>
      {!readOnly && (
        <div
          className="mt-4 bg-white border-solid border-[1px] border-[#D9D9D9] rounded-[4px] h-[38px] flex justify-center items-center cursor-pointer select-none"
          style={{ width: props.width, padding: "0 15px"}}
          onClick={() => {
            const newPages = [...pages, defaultPage];
            newPages[selectedPage] = query.serialize();
            setSelectedPage(newPages.length - 1);
            setPages(newPages);
            try {
              actions.deserialize(newPages[newPages.length - 1]);
            } catch (error) {
              // console.error(error);
            }
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 7 0 C 3.1343739 0 0 3.1343739 0 7 C 0 10.865596 3.1343739 14 7 14 C 10.865596 14 14 10.865596 14 7 C 14 3.1343739 10.865596 0 7 0 z M 7 1.1875 C 10.209397 1.1875 12.8125 3.7906332 12.8125 7 C 12.8125 10.209397 10.209397 12.8125 7 12.8125 C 3.7906332 12.8125 1.1875 10.209397 1.1875 7 C 1.1875 3.7906332 3.7906332 1.1875 7 1.1875 z M 6.625 4 C 6.5562501 4 6.5 4.0562501 6.5 4.125 L 6.5 6.5 L 4.125 6.5 C 4.0562501 6.5 4 6.5562501 4 6.625 L 4 7.375 C 4 7.4437499 4.0562501 7.5 4.125 7.5 L 6.5 7.5 L 6.5 9.875 C 6.5 9.9437499 6.5562501 10 6.625 10 L 7.375 10 C 7.4437499 10 7.5 9.9437499 7.5 9.875 L 7.5 7.5 L 9.875 7.5 C 9.9437499 7.5 10 7.4437499 10 7.375 L 10 6.625 C 10 6.5562501 9.9437499 6.5 9.875 6.5 L 7.5 6.5 L 7.5 4.125 C 7.5 4.0562501 7.4437499 4 7.375 4 L 6.625 4 z " />
          </svg>
          <div className="ml-[10px]">Add New Page</div>
        </div>
      )}
    </>
  );
};

Container.craft = {
  displayName: "Container",
  props: defaultProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    toolbar: ContainerSettings(true, false),
  },
};
