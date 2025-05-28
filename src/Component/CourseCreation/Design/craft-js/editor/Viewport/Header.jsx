import { useEditor } from "@craftjs/core";
import { Tooltip } from "@material-ui/core";
import cx from "classnames";
import styled from "styled-components";

import { CheckmarkSvg, CustomizeSvg, RedoSvg, UndoSvg } from "../../Icons";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../../Context";
import { ArrowLeftOutlined, CloseCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";

import { toPng } from "html-to-image";
import { Button, Input } from "antd";

import Upload from "./Upload";

const { TextArea } = Input;

const HeaderDiv = styled.div`
  width: 100%;
  // height: 45px;
  // z-index: 99999;
  // position: relative;
  padding: 0px 10px;
  background: #f5f5f5;
  display: flex;
  border-bottom: 1px solid rgb(217, 217, 217);
`;

const Btn = styled.a`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 3px;
  color: #fff;
  font-size: 13px;
  svg {
    margin-right: 6px;
    width: 12px;
    height: 12px;
    fill: #fff;
    opacity: 0.9;
  }
`;

const Item = styled.a`
  margin-right: 10px;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
    fill: #707070;
  }
  ${(props) =>
    props.disabled &&
    `
    opacity:0.5;
    cursor: not-allowed;
  `}
`;

export const Header = () => {
  const { enabled, canUndo, canRedo, actions, state, query } = useEditor(
    (state, query) => ({
      state,
      enabled: state.options.enabled,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    })
  );

  const { pages, setPages, selectedPage, setSelectedPage, setDefaultPage } =
    useContext(Context);

  useEffect(() => {
    setDefaultPage(query.serialize());
  }, []);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (data)
      (async function () {
        const { newPages, endpoint } = data;
        try {
          const root =
            document.getElementsByClassName("craftjs-renderer")[0].children[0]
              .children[0].children[0];

          const dataUrl = await toPng(root);
          console.log({ pages: newPages, preview: dataUrl });

          // const link = document.createElement("a");
          // link.download = "my-image-name.png";
          // link.href = dataUrl;
          // link.click();
        } catch (error) {
          console.log(error);
        } finally {
          actions.setOptions((options) => (options.enabled = true));
          actions.deserialize(newPages[selectedPage]);
          setData(null);
        }
      })();
  }, [data]);

  const [templateModal, setTemplateModal] = useState(false);
  const [saveSidebar, setSaveSidebar] = useState(false);
  const [createBadge, setCreateBadge] = useState(false);

  const badges = ["trophy.png", "reward.png", "gem.png", "medal.png"];
  const genders = ["all", "male", "female"];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const sidebar = useRef(null);

  useEffect(() => {
    if (!saveSidebar)
      setTimeout(() => (sidebar.current.style.visibility = "hidden"), 500);
  }, [saveSidebar]);

  return (
    <>
      <div
        className="transition duration-500"
        style={{
          zIndex: 3,
          width: "100%",
          height: "100%",
          display: "flex",
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          overflow: "hidden",
          ...(templateModal
            ? { backgroundColor: "rgba(0,0,0,0.4)" }
            : { pointerEvents: "none" }),
        }}
      >
        <div
          className="transition duration-300"
          style={{
            background: "white",
            borderRadius: "4px",
            opacity: templateModal ? "1" : "0",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              padding: "10px 20px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span className="text-lg font-bold">Save as Template</span>
            <CloseCircleOutlined
              className="cursor-pointer"
            
              onClick={() => {
                setTemplateModal(false);
              }}
            />
          </div>
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #F0F0F0",
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <Input
              style={{ width: "400px" }}
              placeholder="Name your template"
            />
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 20px",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <Button
              className="transition cursor-pointer bg-white"
              onClick={() => {
                setTemplateModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="transition cursor-pointer bg-black text-white border-black"
              onClick={() => {
                // send data to /publish endpoint
                const newPages = [...pages];
                newPages[selectedPage] = query.serialize();

                actions.deserialize(newPages[0]);
                actions.setOptions((options) => (options.enabled = false));

                setPages(newPages);
                setData({ newPages, endpoint: "publish" });
              }}
            >
              Save Template
            </Button>
          </div>
        </div>
      </div>

      <div
        className="transition duration-500"
        style={{
          zIndex: 3,
          width: "100%",
          height: "100%",
          display: "flex",
          position: "absolute",
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundColor: "transparent",
          overflow: "hidden",
          ...(saveSidebar
            ? { backgroundColor: "rgba(0,0,0,0.4)" }
            : { pointerEvents: "none" }),
        }}
      >
        <div
          ref={sidebar}
          className="transition duration-500"
          style={{
            width: "400px",
            minWidth: "400px",
            height: "100%",
            background: "white",
            overflow: "auto",
            ...(saveSidebar ? {} : { transform: "translate(400px)" }),
          }}
        >
          <div
            style={{
              padding: "20px 15px 15px 15px",
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CloseCircleOutlined 
                className="cursor-pointer mr-2 w-4 h-4"
                onClick={() => {
                  (createBadge ? setCreateBadge : setSaveSidebar)(false);
                }}
              />
              <span className="text-lg font-bold">
                {createBadge ? "Create Badge" : "Publish Course"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                className="transition cursor-pointer bg-white"
                onClick={() => {
                  (createBadge ? setCreateBadge : setSaveSidebar)(false);
                }}
              >
                {createBadge ? "Discard" : "Cancel"}
              </Button>
              <Button
                className="transition cursor-pointer bg-black text-white border-black"
                onClick={() => {
                  if (createBadge) {
                    // upload badge to server
                  } else {
                    // send data to /save-as-template endpoint
                    const newPages = [...pages];
                    newPages[selectedPage] = query.serialize();

                    actions.deserialize(newPages[0]);
                    actions.setOptions((options) => (options.enabled = false));

                    setPages(newPages);
                    setData({ newPages, endpoint: "template" });
                  }
                }}
              >
                {createBadge ? "Save Badge" : "Publish"}
              </Button>
            </div>
          </div>
          {!createBadge ? (
            <div style={{ padding: "20px 15px" }}>
              <Input placeholder="Course name" className="mb-3" />
              <TextArea
                className="mb-4"
                placeholder="Add your course description"
                autoSize={{ minRows: 5, maxRows: 5 }}
              />
              <div className="flex justify-between mb-1">
                <span className="text-lg font-bold">Award Badges</span>
                <Button
                  className="transition cursor-pointer bg-white"
                  onClick={() => {
                    setCreateBadge(true);
                  }}
                >
                  Create badge
                </Button>
              </div>
              <p className="mb-3">Select or upload your own</p>
              <div className="flex flex-wrap gap-8 mb-3">
                {badges.map((badge) => (
                  <img
                    className="cursor-pointer w-16 h-16"
                    src={"/badges/" + badge}
                  />
                ))}
              </div>
              <Input placeholder="Award Points" className="mb-4" />
              <span className="text-lg font-bold">Gender Specific</span>
              <div className="flex flex-wrap gap-8">
                {genders.map((gender) => (
                  <div className="flex">
                    <input type="radio" id={gender} name="gender" />
                    <label htmlFor={gender} className="ml-2">
                      {capitalizeFirstLetter(gender)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: "20px 15px" }}>
              <p className="text-lg font-bold mb-2">Badge Details</p>
              <Input placeholder="Badge Name" className="mb-3" />
              <p className="mb-3">Upload badge image</p>
              <Upload />
              <Input placeholder="Associated Points" className="mt-2" />
            </div>
          )}
        </div>
      </div>

      <HeaderDiv className="header text-white transition-craftjs w-full min-w-[600px]">
        <div className="z-[2] bg-[#f5f5f5] items-center flex w-full px-4 justify-between">
          {/* {enabled && (
          <div className="flex-1 flex">
            <Tooltip title="Undo" placement="bottom">
              <Item disabled={!canUndo} onClick={() => actions.history.undo()}>
                <UndoSvg />
              </Item>
            </Tooltip>
            <Tooltip title="Redo" placement="bottom">
              <Item disabled={!canRedo} onClick={() => actions.history.redo()}>
                <RedoSvg />
              </Item>
            </Tooltip>
          </div>
        )} */}
          <div className="flex text-xl gap-4 font-bold text-black items-center">
          <div className="">
          <LeftCircleOutlined className="text-black text-3xl" />
        </div>
            <span>Course Designer</span>
          </div>
          {/* <Btn
            className={cx([
              "transition cursor-pointer",
              {
                "bg-green-400": enabled,
                "bg-primary": !enabled,
              },
            ])}
            onClick={() => {
              const newPages = [...pages];
              newPages[selectedPage] = query.serialize();

              setPages(newPages);
              actions.setOptions((options) => (options.enabled = !enabled));
            }}
          >
            {enabled ? <CheckmarkSvg /> : <CustomizeSvg />}
            {enabled ? "Finish Editing" : "Edit"}
          </Btn> */}
          <div className="p-2 m-2 mr-0 bg-white border rounded-md flex gap-2">
            <Button
              className="transition cursor-pointer bg-white border-dashed"
              onClick={() => {
                setTemplateModal(true);
              }}
            >
              Save as Template
            </Button>
            <Button
              className="transition cursor-pointer bg-black text-white border-black hover:border-dashed"
              onClick={() => {
                sidebar.current.style.removeProperty("visibility");
                setSaveSidebar(true);
              }}
            >
              Publish
            </Button>
          </div>
          {/* <Btn
            className="transition cursor-pointer bg-yellow-400 ml-2"
            onClick={() => {
              try {
                const payload = JSON.parse(window.prompt("Paste state"));
                if (payload === null) return;

                const isPayloadValid =
                  Array.isArray(payload) &&
                  payload.length &&
                  payload.every((e) => typeof e === "string");

                if (!isPayloadValid)
                  throw new Error("State is not a valid array of strings");

                actions.deserialize(payload[0]);
                setPages(payload);
                setSelectedPage(0);
              } catch (error) {
                window.alert("Invalid state");
                console.error(error);
              }
            }}
          >
            Load state
          </Btn> */}
        </div>
      </HeaderDiv>
    </>
  );
};
