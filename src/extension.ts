import * as vscode from "vscode";
const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const port = 3069;
const path = require("path");
let openedSocket;
app.ws("/code", (ws, req) => {
  openedSocket = ws;
});
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/../code.html"))
);
app.listen(port, () =>
  console.log("Holy crap, i am running a server from an extension")
);

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("decorator sample is activated");

  vscode.workspace.onDidChangeTextDocument(changeEvent => {
    console.log(changeEvent.document.getText());
    if (openedSocket) {
      openedSocket.send(
        JSON.stringify({
          event: "didChangeTextDocument",
          text: changeEvent.document.getText()
        })
      );
    }
  });

  let activeEditor = vscode.window.activeTextEditor;

  function sendActiveDocumentToServer() {}
}
