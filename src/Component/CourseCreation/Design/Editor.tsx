import { Editor, Frame, Element } from "@craftjs/core";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { Viewport, RenderNode } from "./craft-js/editor";
import { Text } from "./craft-js/selectors";
import { Container } from "./craft-js/selectors/Container";
import { RowsContainer } from "./craft-js/selectors/Container/rowsContainer";
import { ColumnsContainer } from "./craft-js/selectors/Container/columnsContainer";
import { Button } from "./craft-js/selectors/Button";
import { Image } from "./craft-js/selectors/Image";
import { Poll } from "./craft-js/selectors/Poll";
import { ReactQuill } from "./craft-js/selectors/ReactQuill";
import "./style.css";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "acumin-pro",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

export default function ({
  readOnly = false,
  pages = undefined,
}: {
  readOnly: boolean;
  pages: string[] | undefined;
}) {
  return (
    <ThemeProvider theme={theme}>
      {/* <div className="h-full h-screen"> */}
      <Editor
        resolver={{
          Container,
          RowsContainer,
          ColumnsContainer,
          Text,
          Button,
          Image,
          Poll,
          ReactQuill,
        }}
        enabled={false}
        onRender={RenderNode}
      >
        <Viewport readOnly={readOnly} loadPages={pages}>
          <Frame>
            <Element
              canvas
              is={Container}
              width="850px"
              height="auto"
              background={{ r: 255, g: 255, b: 255, a: 1 }}
              padding={["40", "40", "40", "40"]}
              margin={["0", "20", "0", "20"]}
              custom={{ displayName: "App" }}
              radius={4}
              customStyles={{ border: "1px solid #D9D9D9" }}
            ></Element>
          </Frame>
        </Viewport>
      </Editor>
      {/* </div> */}
    </ThemeProvider>
  );
}
