"use client";

import Editor from "@monaco-editor/react";

export default function Compiler() {
  return (
    <div className="h-full flex flex-col">
      <Editor
        height="100%"
        defaultLanguage="cpp"
        defaultValue={`#include <iostream>

using namespace std;

int main() {
    cout << "Hello Diagramly";
}`}
        theme="vs-light"
      />
    </div>
  );
}