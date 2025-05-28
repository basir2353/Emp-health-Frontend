import { useEditor } from "@craftjs/core";
import { Layers } from "@craftjs/layers";
import { useState, useContext } from "react";
import { Context } from "../../../../Context";
import styled from "styled-components";

import { SidebarItem } from "./SidebarItem";

import { CustomizeSvg, LayerSvg } from "../../../Icons";
import { Toolbar } from "../../Toolbar";

export const SidebarDiv = styled.div`
  width: 280px;
  opacity: ${(props) => (props.enabled ? 1 : 0)};
  background: #fff;
  margin-right: ${(props) => (props.enabled ? 0 : -280)}px;
  border-left: 1px solid rgb(217, 217, 217);
`;

const Page = styled.div`
  width: 100%;
  height: 34px;
  display: flex;
  cursor: pointer;
  user-select: none;
  align-items: center;
  padding: 0 23px 0 27px;
  ${(props) => (props.selected ? "color: white;" : "")}
  ${(props) => (props.selected ? "background-color: #2680eb;" : "")}
  &:hover {
    background-color: ${(props) => (props.selected ? "#2680eb" : "#f1f1f1")};
  }
`;

export const Sidebar = () => {
  const { pages, setPages, selectedPage, setSelectedPage, defaultPage } =
    useContext(Context);

  const [layersVisible, setLayerVisible] = useState(true);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [pagesVisible, setPagesVisible] = useState(true);
  const { enabled, actions, query } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <SidebarDiv enabled={enabled} className="sidebar transition-craftjs bg-white w-2">
      <div className="flex flex-col h-full" style={{ minWidth: "280px" }}>
        <SidebarItem
          icon={LayerSvg}
          title="Pages"
          height={!pagesVisible ? "full" : "45%"}
          visible={pagesVisible}
          onChange={(val) => setPagesVisible(val)}
        >
          <div className="">
            {pages?.map((state, index) => (
              <Page
                key={index + Date.now().toString()}
                selected={selectedPage === index}
                onClick={() => {
                  if (selectedPage === index) return;

                  const newPages = [...pages];
                  newPages[selectedPage] = query.serialize();

                  setPages(newPages);
                  setSelectedPage(index);

                  try {
                    actions.deserialize(state);
                  } catch (error) {
                    console.error(error);
                    actions.deserialize(defaultPage);
                  }
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  Page {index + 1}
                  {pages.length > 1 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const newPages = [...pages];
                        newPages[selectedPage] = query.serialize();
                        newPages.splice(index, 1);

                        setPages(newPages);
                        const newSelectedPage = index - 1 < 0 ? 0 : index - 1;
                        setSelectedPage(newSelectedPage);

                        try {
                          actions.deserialize(newPages[newSelectedPage]);
                        } catch (error) {
                          console.error(error);
                          actions.deserialize(defaultPage);
                        }
                      }}
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  )}
                </div>
              </Page>
            ))}
          </div>
        </SidebarItem>
        <SidebarItem
          icon={CustomizeSvg}
          title="Customize"
          height={!layersVisible ? "full" : "55%"}
          visible={toolbarVisible}
          onChange={(val) => setToolbarVisible(val)}
        >
          <Toolbar />
        </SidebarItem>
        <SidebarItem
          icon={LayerSvg}
          title="Layers"
          height={!toolbarVisible ? "full" : "45%"}
          visible={layersVisible}
          onChange={(val) => setLayerVisible(val)}
        >
          <div className="">
            <Layers expandRootOnLoad={true} />
          </div>
        </SidebarItem>
      </div>
    </SidebarDiv>
  );
};
