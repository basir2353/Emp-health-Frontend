import React, { useState, useCallback, useRef } from 'react';
import QuillEditor from "react-quill";
import { useNode, useEditor } from "@craftjs/core";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";
import { ReactQuillSettings } from "./ReactQuillSettings";
import { useId } from "react";
import Toolbar from "./Toolbar";
import axios from "axios";
import { Button } from 'antd';

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  .ql-formats {
    margin-top: 7.5px;
    margin-bottom: 5px;
  }

  .ql-formats:has(.ql-genAI) {
    float: right;
    margin: 5px 0 5px;
  }

  .ql-toolbar button.ql-genAI {
    padding: 2px;
    width: auto;
    height: 27px;
    background-color: white;
    border: 1px dashed #ccc;
    border-radius: 5px;
    span {
      margin: 0 5px;
      user-select: none;
    }
  }

  .ql-toolbar {
    border: none !important;
    ${(props) => (props.enabled ? "" : "display: none;")}
    ${(props) =>
      props.enabled ? "border-bottom: 1px solid #ccc !important;" : ""}
  }

  .ql-container {
    border: none !important;
  }

  .button-container {
    position: absolute;
    bottom: 0px; 
    right: 10px; 
    display: flex;
    gap: 10px;
  }

  .ql-accept,
  .ql-discard {
    padding: 2px;
    width: auto;
    height: 27px;
    background-color: white;
    border: 1px dashed #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
`;

export const textSuggestionBot = async (input) => {
  let template = `
<s>[INST] You are a knowledgeable doctor specializing in various medical conditions. Your primary goal is to provide accurate medical advice based on the user's symptoms and queries.

User: ${input}

Your response should provide medical advice or further questions based on the user's input and context. Avoid repeating the user's message in your answer to maintain clarity and professionalism.

Continue the conversation based on the given input and context.[/INST] Model answer</s>
  `;

  if (input.toLowerCase().includes("head")) {
    template = `
<s>[INST] You are a knowledgeable doctor specializing in various medical conditions. Your primary goal is to provide accurate medical advice based on the user's symptoms and queries.

User: ${input}

Provide information or advice related to head conditions or symptoms. Tailor your response accordingly to address the specific inquiry regarding the head.</s>
    `;
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        inputs: template,
        parameters: {
          temperature: 0.4,
          max_new_tokens: 2000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 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",
        },
      }
    );

    const fullResponse = response.data[0].generated_text;
    const answerStart = fullResponse.indexOf("</s>") + 4;
    const botMessage = fullResponse.substring(answerStart).trim();
    const cleanMessage = botMessage
      .replace(/<[^>]*>/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/[\w-]+="[^"]*"/g, "")
      .replace(/\{[^}]*\}/g, "")
      .trim();

    return cleanMessage;
  } catch (error) {
    console.error("Error fetching suggestion from API", error);
    return "Error retrieving text.";
  }
};

export const ReactQuill = (props) => {
  const { content } = props;
  const [showButtons, setShowButtons] = useState(false);
  const [tempText, setTempText] = useState(''); // Temporary text state

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const id = "quill" + useId().slice(1, -1);

  const quillRef = useRef(null);

  const handleAccept = useCallback(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const cursorPosition = quill.getSelection().index;
      const currentContent = quill.getText();
      const newContent = currentContent.slice(0, cursorPosition) + tempText + currentContent.slice(cursorPosition);
      setProp((prop) => (prop.content = newContent), 500); // Update the content prop
    }
    setTempText(''); // Clear temporary text
    setShowButtons(false); // Hide buttons
  }, [tempText, setProp]);

  const handleDiscard = useCallback(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const cursorPosition = quill.getSelection().index;
      const currentContent = quill.getText();
      // Remove the temporary text
      const newContent = currentContent.slice(0, cursorPosition - tempText.length) + currentContent.slice(cursorPosition);
      setProp((prop) => (prop.content = newContent), 500); // Update the content prop
    }
    setTempText(''); // Clear temporary text
    setShowButtons(false); // Hide buttons
  }, [tempText, setProp]);

  const handleGenAI = useCallback(async () => {
    const quill = quillRef.current.getEditor(); // Get the Quill editor instance
    const cursorPosition = quill.getSelection().index;
    const responseFromAPI = await textSuggestionBot(
      quill.getText().slice(0, cursorPosition)
    );

    setTempText(responseFromAPI); // Store the generated text temporarily
    quill.insertText(cursorPosition, responseFromAPI); // Insert the generated text
    quill.setSelection(cursorPosition + responseFromAPI.length); // Move cursor to end of generated text
    setShowButtons(true); // Show buttons after generating text
  }, []);

  return (
    <Wrapper ref={connect} enabled={enabled && selected} showButtons={showButtons}>
      <Toolbar id={id} onAccept={handleAccept} onDiscard={handleDiscard} />
      <QuillEditor
        ref={quillRef} // Set the ref to QuillEditor
        readOnly={!enabled}
        value={content}
        onChange={(newContent) =>
          setProp((prop) => (prop.content = newContent), 500)
        }
        placeholder={"Type text here"}
        modules={{
          toolbar: {
            container: "#" + id,
            handlers: { genAI: handleGenAI },
          },
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "image",
          "color",
        ]}
        theme={"snow"}
      />
      {showButtons && (
        <div className="button-container">
          <Button className="ql-accept" onClick={handleAccept}>Accept</Button>
          <Button className="ql-discard" onClick={handleDiscard}>Discard</Button>
        </div>
      )}
    </Wrapper>
  );
};

ReactQuill.craft = {
  displayName: "Text",
  props: {
    content: "",
  },
  related: {
    toolbar: ReactQuillSettings,
  },
};
