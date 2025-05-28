import React from "react";

import { ToolbarSection, ToolbarItem } from "../../editor";

export const ImageSettings = () => {
  return (
    <React.Fragment>
      <ToolbarSection title="Image">
        <ToolbarItem
          full={true}
          propKey="imageUrl"
          type="text"
          label="Image URL"
        />
      </ToolbarSection>
    </React.Fragment>
  );
};
