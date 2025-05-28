import { useEditor } from "@craftjs/core";
import cx from "classnames";
import { useEffect, useContext, useRef } from "react";
import { Context } from "../../../Context";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Toolbox } from "./Toolbox";

export const Viewport = ({ children, readOnly, loadPages }) => {
  const {
    setPages,
    setSelectedPage,
    setReadOnly,
    readOnly: readOnlyFromContext,
  } = useContext(Context);

  const { enabled, connectors, actions } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const { setOptions } = actions;

  useEffect(() => {
    if (!window) {
      return;
    }

    window.requestAnimationFrame(() => {
      // Notify doc site
      window.parent.postMessage(
        {
          LANDING_PAGE_LOADED: true,
        },
        "*"
      );

      setTimeout(() => {
        setOptions((options) => {
          options.enabled = !readOnly;
        });
        setReadOnly(readOnly);
      }, 200);
    });
  }, [setOptions, readOnly]);

  useEffect(() => {
    if (loadPages) {
      setPages(loadPages);
      setSelectedPage(0);
      actions.deserialize(loadPages[0]);
    }
  }, [loadPages]);

  const header = useRef(null);

  return (
    <>
      <div ref={header}>{!readOnlyFromContext && <Header />}</div>
      <div
        className="viewport overflow-hidden"
        style={{
          height: `calc(100% - ${header.current?.clientHeight || 0}px)`,
        }}
      >
        <div
          className={cx(["flex overflow-hidden flex-row w-full h-full"])}
        >
          <Toolbox />
          <div className="page-container flex flex-1 h-full flex-col">
            <div
              className={cx([
                "craftjs-renderer flex-1 h-full w-full transition-craftjs pb-6 overflow-auto",
              ])}
              ref={(ref) =>
                connectors.select(connectors.hover(ref, null), null)
              }
            >
              <div className="relative flex-col flex items-center pt-8">
                {children}
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </>
  );
};
