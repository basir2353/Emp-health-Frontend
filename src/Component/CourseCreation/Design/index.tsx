import Editor from "./Editor";
import { ContextProvider } from "./Context";

export default function (props: any) {
  return (
    <ContextProvider>
      <Editor {...props} />
    </ContextProvider>
  );
}
