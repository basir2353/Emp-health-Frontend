import { createContext, useState } from "react";

export const Context = createContext();

export function ContextProvider({ children }) {
  const [pages, setPages] = useState([""]);
  const [selectedPage, setSelectedPage] = useState(0);
  const [defaultPage, setDefaultPage] = useState("");
  const [readOnly, setReadOnly] = useState(true);

  return (
    <Context.Provider
      value={{
        pages,
        setPages,
        selectedPage,
        setSelectedPage,
        defaultPage,
        setDefaultPage,
        readOnly,
        setReadOnly,
      }}
    >
      {children}
    </Context.Provider>
  );
}
