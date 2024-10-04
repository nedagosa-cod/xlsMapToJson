import { useState } from "react";
import "./App.css";
import CodeEditor from "./components/Editor/CodeEditor";
import Header from "./components/Header/Header";
import LoadFile from "./components/LoadFile/LoadFile";
import Dialog from "./components/PopUp/Dialog";

function App() {
  const [fileValue, setFileValue] = useState([{}]);
  const [globalFile, setGlobalFile] = useState([{}]);
  const [headersFile, setHeadersFile] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [structure, setStructure] = useState("[{}]");
  return (
    <>
      <Header />
      <section className="content">
        <h1 className="title">
          Convierter Excel a JSON y con la estructura que quieras!
        </h1>
        <LoadFile
          setFileValue={setFileValue}
          setHeadersFile={setHeadersFile}
          setGlobalFile={setGlobalFile}
        />
        <div className="codemirror-container">
          <CodeEditor fileValue={fileValue} />
          <CodeEditor
            fileValue={[{}]}
            headersFile={headersFile}
            globalFile={globalFile}
            setDialogOpen={setDialogOpen}
            setStructure={setStructure}
            user
          />
        </div>
      </section>
      {dialogOpen && (
        <Dialog globalFile={structure} setDialogOpen={setDialogOpen} open />
      )}
    </>
  );
}

export default App;
