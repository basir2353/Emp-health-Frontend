import { Element, useEditor } from "@craftjs/core";
import { Tooltip } from "@material-ui/core";
import styled from "styled-components";

import {
  TextSvg,
  HeadingSvg,
  RowSvg,
  ColumnSvg,
  PollSvg,
  QuestionSvg,
  ImageSvg,
  ButtonSvg,
} from "../../Icons";

import { Button } from "../../selectors/Button";
import { RowsContainer } from "../../selectors/Container/rowsContainer";
import { ColumnsContainer } from "../../selectors/Container/columnsContainer";
import { Image } from "../../selectors/Image";
import { Poll } from "../../selectors/Poll";
import { ReactQuill } from "../../selectors/ReactQuill";

const ToolboxDiv = styled.div`
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  ${(props) => (!props.enabled ? `width: 0;` : "")}
  ${(props) => (!props.enabled ? `opacity: 0;` : "")}
  border-right: 1px solid rgb(217, 217, 217);
`;

const Item = styled.a`
  svg {
    width: 30px;
    height: 30px;
    fill: #707070;
  }
  ${(props) => props.move && "cursor: move;"}
`;

export const Toolbox = () => {
  const {
    enabled,
    connectors: { create },
  } = useEditor((state) => {
    return {
      enabled: state.options.enabled,
    };
  });

  return (
    <ToolboxDiv
      enabled={enabled && enabled}
      className="toolbox transition w-12 h-full flex flex-col bg-white"
    >
      <div className="flex flex-1 flex-col items-center pt-3">
        <div ref={(ref) => create(ref, <ReactQuill />)}>
          <Tooltip title="Text" placement="right">
            <Item className="m-2 pb-2 cursor-pointer block" move>
              <TextSvg />
            </Item>
          </Tooltip>
        </div>
        <div ref={(ref) => create(ref, <ReactQuill />)}>
          <Tooltip title="Heading" placement="right">
            <Item className="m-2 pb-2 cursor-pointer block" move>
              <HeadingSvg />
            </Item>
          </Tooltip>
        </div>
        <div
          ref={(ref) =>
            create(
              ref,
              <Element
                canvas
                is={RowsContainer}
                background={{ r: 0, g: 0, b: 0, a: 0.1 }}
                color={{ r: 0, g: 0, b: 0, a: 1 }}
                height="300px"
                width="300px"
              ></Element>
            )
          }
        >
          <Tooltip title="Rows Container" placement="right">
            <Item className="m-2 pb-2 cursor-pointer block" move>
              <RowSvg />
            </Item>
          </Tooltip>
        </div>
        <div
          ref={(ref) =>
            create(
              ref,
              <Element
                canvas
                is={ColumnsContainer}
                background={{ r: 0, g: 0, b: 0, a: 0.1 }}
                color={{ r: 0, g: 0, b: 0, a: 1 }}
                height="300px"
                width="300px"
              ></Element>
            )
          }
        >
          <Tooltip title="Columns Container" placement="right">
            <Item className="m-2 pb-2 cursor-pointer block" move>
              <ColumnSvg />
            </Item>
          </Tooltip>
        </div>
        <div ref={(ref) => create(ref, <Poll />)}>
          <Tooltip title="Poll" placement="right">
            <Item className="m-2 pb-2 cursor-pointer block" move>
              <PollSvg />
            </Item>
          </Tooltip>
        </div>
        <div ref={(ref) => create(ref, <Poll />)}>
          <Tooltip title="Question" placement="right">
            <Item className="m-2 pb-2 cursor-pointer block" move>
              <QuestionSvg />
            </Item>
          </Tooltip>
        </div>
        <div ref={(ref) => create(ref, <Image />)}>
          <Tooltip title="Image" placement="right">
            <Item className="m-2 pb-2 cursor-pointer block" move>
              <ImageSvg />
            </Item>
          </Tooltip>
        </div>
        <div ref={(ref) => create(ref, <Button />)}>
          <Tooltip title="Button" placement="right">
            <Item className="m-2 pb-2 cursor-pointer block" move>
              <ButtonSvg />
            </Item>
          </Tooltip>
        </div>
      </div>
    </ToolboxDiv>
  );
};
