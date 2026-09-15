import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { LANGUAGES } from '@/lib/compiler/languages';
import { runCode } from '@/lib/compiler/run';
import type { CodeBoxData, CodeBoxRole } from '@/app/(routes)/workspace/_components/canvas/types';

import { useTheme } from 'next-themes';

interface CodeBoxModalProps {
  open: boolean;
  codeBox: CodeBoxData;
  onClose: () => void;
  onSave: (data: CodeBoxData) => void;
  onRunGraph?: (data: CodeBoxData) => Promise<{ output?: string; error?: string }>;
  isHeader?: boolean;
}

export default function CodeBoxModal({ open, codeBox, isHeader, onClose, onSave, onRunGraph }: CodeBoxModalProps) {
  const { theme } = useTheme();
  const [role, setRole] = useState<CodeBoxRole>(codeBox.role || 'main');
  const [language, setLanguage] = useState(codeBox.language);
  const [code, setCode] = useState(codeBox.code);
  const [output, setOutput] = useState(codeBox.output ?? '');
  const [outputVisible, setOutputVisible] = useState(!!codeBox.outputVisible);
  const [isRunning, setIsRunning] = useState(false);
  const [isRunningGraph, setIsRunningGraph] = useState(false);

  useEffect(() => {
    // Reset when a different CodeBox is opened
    setRole(codeBox.role || 'main');
    setLanguage(codeBox.language);
    setCode(codeBox.code);
    setOutput(codeBox.output ?? '');
    setOutputVisible(!!codeBox.outputVisible);
  }, [codeBox]);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const data = await runCode(language as keyof typeof LANGUAGES, code);
      if (data.output) {
        setOutput(data.output);
        setOutputVisible(true);
      } else if (data.error) {
        setOutput(data.error);
        setOutputVisible(true);
      }
    } catch (e) {
      setOutput('Failed to run code');
      setOutputVisible(true);
    }
    setIsRunning(false);
  };

  const handleRunGraph = async () => {
    if (!onRunGraph) return;
    setIsRunningGraph(true);
    try {
      const result = await onRunGraph({ role, language, code, output, outputVisible });
      if (result.output) {
        setOutput(result.output);
        setOutputVisible(true);
      } else if (result.error) {
        setOutput(result.error);
        setOutputVisible(true);
      }
    } catch (e: any) {
      setOutput(e?.message || 'Failed to run graph');
      setOutputVisible(true);
    }
    setIsRunningGraph(false);
  };

  const handleSave = () => {
    onSave({ role, language, code, output, outputVisible });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isHeader ? 'Header Editor' : 'CodeBox Editor'}</DialogTitle>
          <DialogDescription>
            {isHeader ? 'Edit global header code (e.g., includes, imports).' : 'Edit code, run, and save changes.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex items-center space-x-4">
            {!isHeader && (
              <>
                <label className="text-sm font-medium">Role:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as CodeBoxRole)}
                  className="border rounded px-2 py-1 text-sm bg-white dark:bg-slate-900 font-medium"
                >
                  <option value="unassigned" disabled>Select Role...</option>
                  <option value="main">Main</option>
                  <option value="function">Function</option>
                  <option value="header">Header</option>
                </select>
              </>
            )}
            <label className="text-sm font-medium">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded px-2 py-1 text-sm bg-white dark:bg-slate-900"
            >
              {Object.entries(LANGUAGES).map(([key, lang]) => (
                <option key={key} value={key}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 border rounded overflow-hidden shadow-inner">
            <Editor
              height="40vh"
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              defaultLanguage={LANGUAGES[language as keyof typeof LANGUAGES].monacoLang}
              language={LANGUAGES[language as keyof typeof LANGUAGES].monacoLang}
              value={code}
              onChange={(value) => setCode(value ?? '')}
              options={{ automaticLayout: true, minimap: { enabled: false } }}
            />
          </div>
          {!isHeader && output && (
            <div className="col-span-2 mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase text-slate-500">Output</span>
                <button
                  type="button"
                  onClick={() => setOutputVisible(!outputVisible)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  {outputVisible ? 'Hide Output' : 'Show Output'}
                </button>
              </div>
              {outputVisible && (
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-48 text-xs font-mono">
                  {output}
                </pre>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between items-center gap-2">
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isRunning || isRunningGraph}>
              Cancel
            </Button>
            <Button type="button" variant="secondary" onClick={handleSave} disabled={isRunning || isRunningGraph}>
              Save
            </Button>
          </div>
          {!isHeader && (
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={handleRun} disabled={isRunning || isRunningGraph}>
                {isRunning ? 'Running…' : 'Run'}
              </Button>
              {role === 'main' && onRunGraph && (
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleRunGraph}
                  disabled={isRunning || isRunningGraph}
                >
                  {isRunningGraph ? 'Running Graph…' : 'Run Graph'}
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
