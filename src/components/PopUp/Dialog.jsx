import { useEffect, useState } from "react";
import CodeEditor from "../Editor/CodeEditor";
import "./styles/dialog.css";

const Dialog = ({ globalFile, open, setDialogOpen }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setDialogOpen(false);
    }
  };

  return (
    <dialog
      open={open}
      className="dialog"
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target.className === "dialog") {
          setDialogOpen(false);
        }
      }}
    >
      <section>
        <h2>Nueva base JSON con tu estructura...</h2>
        <CodeEditor fileValue={globalFile} dialogOpen={open} />
      </section>
    </dialog>
  );
};

export default Dialog;
