export default function Toolbar({ id }) {
  const colors = [
    null,
    "#e60000",
    "#ff9900",
    "#ffff00",
    "#008a00",
    "#0066cc",
    "#9933ff",
    "#ffffff",
    "#facccc",
    "#ffebcc",
    "#ffffcc",
    "#cce8cc",
    "#cce0f5",
    "#ebd6ff",
    "#bbbbbb",
    "#f06666",
    "#ffc266",
    "#ffff66",
    "#66b966",
    "#66a3e0",
    "#c285ff",
    "#888888",
    "#a10000",
    "#b26b00",
    "#b2b200",
    "#006100",
    "#0047b2",
    "#6b24b2",
    "#444444",
    "#5c0000",
    "#663d00",
    "#666600",
    "#003700",
    "#002966",
    "#3d1466",
  ];

  return (
    <div id={id}>
      <div className="ql-formats">
        <select
          className="ql-header"
          defaultValue={""}
          onChange={(e) => e.persist()}
        >
          <option value="1" />
          <option value="2" />
          <option value="3" />
          <option selected />
        </select>
      </div>
      <div className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-blockquote" />
      </div>
      <div className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </div>
      <div className="ql-formats">
        <button className="ql-link" />
        <button className="ql-image" />
      </div>
      <div className="ql-formats">
        <select className="ql-align">
          <option selected />
          <option value="center" />
          <option value="right" />
          <option value="justify" />
        </select>
      </div>
      <div className="ql-formats">
        <select className="ql-color">
          {colors.map((color) =>
            color ? <option value={color} /> : <option selected />
          )}
        </select>
      </div>
      <div className="ql-formats">
        <button className="ql-code-block" />
      </div>
      <div className="ql-formats">
        <button className="ql-clean" />
      </div>
      <div className="ql-formats">
        <button className="ql-genAI">
          <span>Generate&nbsp;with&nbsp;AI</span>
        </button>
      </div>
    </div>
  );
}
