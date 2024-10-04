import React, { useCallback, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { dracula } from "@uiw/codemirror-theme-dracula";
import "./styles/codemirror.css";
import readXlsxFile from "read-excel-file";

const CodeEditor = ({
  fileValue,
  headersFile,
  user,
  globalFile,
  setDialogOpen,
  setStructure,
  dialogOpen,
}) => {
  const [value, setValue] = useState("[{}]");
  const [headersFilled, setHeadersFilled] = useState(false);

  const onChange = (val, viewUpdate) => {
    const headers = headersFile.map((h) => h.toLowerCase());
    const newVal = val.toLowerCase();
    setHeadersFilled(headers.every((h) => newVal.includes(h)));
    setValue(val);
  };
  const createStructure = (e) => {
    e.preventDefault();
    if (headersFilled) {
      try {
        const parsedData = JSON.parse(value);

        // Función recursiva para procesar objetos anidados
        const encapsularObjeto = (obj) => {
          const resultado = {};

          Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
              // Si es un objeto, lo encapsulamos bajo la clave 0 y volvemos a procesar ese objeto
              resultado[0] = {
                ...resultado[0],
                [key]: encapsularObjeto(obj[key]),
              };
            } else {
              // Si no es un objeto, simplemente lo copiamos
              resultado[key] = obj[key];
            }
          });

          return resultado;
        };

        return parsedData.map((item) => {
          // Aplicar la lógica recursiva al objeto
          const nuevoItem = encapsularObjeto(item);

          // CREAR EL JSON CON EL MAPA DEL USUARIO DE LA BASE COMPLETA
          readXlsxFile(globalFile, { map: nuevoItem })
            .then(({ rows }) => {
              setStructure(rows);
              setDialogOpen(true);
            })
            .then(() => {
              console.log("Estructura creada");
            })
            .catch((error) => {
              alert(
                "Verifica que la estructura creada sí tenga un formato json"
              );
            });
        });
      } catch (error) {
        alert("Verifica que la estructura creada sí tenga un formato json");
      }
    }
  };

  const handleCopy = () => {
    console.log(globalFile);
    navigator.clipboard.writeText(JSON.stringify(fileValue, null, 2));
    alert("Estructura copiada");
  };
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(fileValue)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "estructura.json";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 0);
  };
  useEffect(() => {
    setValue(JSON.stringify(fileValue, null, 2));
  }, [fileValue]);

  return (
    <div
      className={
        dialogOpen ? "codemirror-wrapper dialog-open" : "codemirror-wrapper"
      }
    >
      {user && (
        <div className="headers-box">
          {headersFile.length === 0 && (
            <div className="nameHeader titlexist">HEADERS TABLE</div>
          )}
          {headersFile.map((item, index) => (
            <div
              key={index}
              className={`nameHeader ${value.includes(item) ? "exist" : ""}`}
            >
              {item}
            </div>
          ))}
        </div>
      )}
      {!user && (
        <div className="headers-box">
          <span>BASE INICIAL</span>
        </div>
      )}
      <CodeMirror
        value={value}
        className="codemirror"
        theme={dracula}
        extensions={[
          json(),
          EditorState.tabSize.of(2), // Establecer tamaño de tabulación a 2 espacios
        ]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true, // Mostrar números de línea
          indentOnInput: true, // Mantener indentación adecuada
          lineWrapping: true, // Permitir que el código se ajuste al tamaño de la línea
        }}
      />
      {user ? (
        <div className="buttons" onClick={createStructure}>
          <button type="button">Crear estructura</button>
        </div>
      ) : (
        <div className="buttons">
          <button type="button" onClick={handleCopy}>
            Copiar estructura
          </button>
          <button type="button" onClick={handleDownload}>
            Descargar base json
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
