import { useNode, useEditor } from "@craftjs/core";
import React from "react";
import styled from "styled-components";
import readFile from "../../utils/readFile";

import { ImageSettings } from "./ImageSettings";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const Image = (props) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const {
    connectors: { connect },
    setProp,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const { imageUrl } = props;

  return (
    <Wrapper ref={connect} enabled={enabled}>
      <img
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src={imageUrl}
        onClick={() => {
          if (!enabled || imageUrl !== "/placeholder/image.png") return;

          const file = document.createElement("input");
          file.setAttribute("type", "file");
          file.setAttribute("accept", "image/*");
          file.click();

          file.onchange = async () => {
            const data = await readFile(file.files[0]);
            setProp((prop) => (prop.imageUrl = data), 500);
          };
        }}
        onDrop={async (e) => {
          e.preventDefault();
          if (!enabled || imageUrl !== "/placeholder/image.png") return;
          if (!e.dataTransfer?.files?.[0]) return;

          console.log(e.dataTransfer.files[0], e);
          const data = await readFile(e.dataTransfer.files[0]);
          setProp((prop) => (prop.imageUrl = data), 500);
        }}
      />
    </Wrapper>
  );
};

Image.craft = {
  displayName: "Image",
  props: {
    imageUrl: "/placeholder/image.png",
  },
  related: {
    toolbar: ImageSettings,
  },
};
