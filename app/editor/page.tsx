'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Play,
  Save,
  RotateCcw,
  Settings,
  FileText,
  CheckCircle,
  XCircle,
  Terminal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameLayout } from '@/components/layout/game-layout';
import { useGameStore } from '@/lib/store';

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading editor...</p>
      </div>
    </div>
  ),
});

interface TestCase {
  id: string;
  input: string;
  expected: string;
  actual?: string;
  passed?: boolean;
}

export default function EditorPage() {
  const { addNotification } = useGameStore();
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [code, setCode] = useState(getDefaultCode(language));
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testCases] = useState<TestCase[]>([
    {
      id: '1',
      input: 'hello world',
      expected: 'HELLO WORLD',
    },
    {
      id: '2',
      input: 'Code Valley',
      expected: 'CODE VALLEY',
    },
    {
      id: '3',
      input: 'javascript',
      expected: 'JAVASCRIPT',
    },
  ]);
  const [testResults, setTestResults] = useState<TestCase[]>([]);

  const editorRef = useRef<any>(null);

  function getDefaultCode(lang: string): string {
    const templates = {
      javascript: `// Selamat datang di Code Valley Editor!
// Tugas: Buat fungsi yang mengubah string menjadi huruf kapital

function toUpperCase(str) {
  // Tulis kode Anda di sini
  return str.toUpperCase();
}

// Test your function
console.log(toUpperCase("hello world"));`,

      python: `# Selamat datang di Code Valley Editor!
# Tugas: Buat fungsi yang mengubah string menjadi huruf kapital

def to_upper_case(text):
    # Tulis kode Anda di sini
    return text.upper()

# Test your function
print(to_upper_case("hello world"))`,

      java: `// Selamat datang di Code Valley Editor!
// Tugas: Buat fungsi yang mengubah string menjadi huruf kapital

public class Solution {
    public static String toUpperCase(String str) {
        // Tulis kode Anda di sini
        return str.toUpperCase();
    }
    
    public static void main(String[] args) {
        System.out.println(toUpperCase("hello world"));
    }
}`,

      cpp: `// Selamat datang di Code Valley Editor!
// Tugas: Buat fungsi yang mengubah string menjadi huruf kapital

#include <iostream>
#include <string>
#include <algorithm>

std::string toUpperCase(std::string str) {
    // Tulis kode Anda di sini
    std::transform(str.begin(), str.end(), str.begin(), ::toupper);
    return str;
}

int main() {
    std::cout << toUpperCase("hello world") << std::endl;
    return 0;
}`,
    };

    return templates[lang as keyof typeof templates] || templates.javascript;
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage));
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (language === 'javascript') {
        // Simple JavaScript execution simulation
        const result = 'HELLO WORLD\n';
        setOutput(result);
        
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Code berhasil dijalankan!',
          message: 'Output telah ditampilkan di konsol',
        });
      } else {
        setOutput(`Output untuk ${language}:\nHELLO WORLD\n`);
      }
    } catch (error) {
      setOutput('Error: Terjadi kesalahan saat menjalankan code');
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Terjadi kesalahan saat menjalankan code',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate test execution
      const results = testCases.map(testCase => ({
        ...testCase,
        actual: testCase.input.toUpperCase(),
        passed: testCase.input.toUpperCase() === testCase.expected,
      }));
      
      setTestResults(results);
      
      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;
      
      addNotification({
        id: Date.now().toString(),
        type: passedCount === totalCount ? 'success' : 'warning',
        title: 'Test selesai',
        message: `${passedCount}/${totalCount} test cases passed`,
      });
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Terjadi kesalahan saat menjalankan test',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = () => {
    // Save to localStorage or send to API
    localStorage.setItem(`code_${language}`, code);
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Code tersimpan',
      message: 'Code Anda telah disimpan',
    });
  };

  const resetCode = () => {
    setCode(getDefaultCode(language));
    setOutput('');
    setTestResults([]);
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Code Editor</h1>
            <p className="text-gray-600">
              Tulis, test, dan jalankan kode Anda di sini
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>

            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vs-dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="hc-black">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Main Editor Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-300px)]"
        >
          {/* Code Editor */}
          <div className="xl:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Editor
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button onClick={runCode} disabled={isRunning} size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run'}
                  </Button>
                  <Button onClick={runTests} disabled={isRunning} variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                  <Button onClick={saveCode} variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={resetCode} variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <div className="h-full">
                  <Editor
                    height="100%"
                    language={language}
                    theme={theme}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    onMount={(editor) => {
                      editorRef.current = editor;
                    }}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output and Tests */}
          <div className="space-y-6">
            {/* Output Console */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-40 overflow-y-auto">
                  {isRunning ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Running...
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap">
                      {output || 'Ready to run your code...'}
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Test Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="cases" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cases">Cases</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cases" className="space-y-3">
                    {testCases.map((testCase, index) => (
                      <div key={testCase.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium mb-2">
                          Test Case {index + 1}
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="text-gray-600">Input:</span>{' '}
                            <code className="bg-white px-2 py-1 rounded">
                              "{testCase.input}"
                            </code>
                          </div>
                          <div>
                            <span className="text-gray-600">Expected:</span>{' '}
                            <code className="bg-white px-2 py-1 rounded">
                              "{testCase.expected}"
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="results" className="space-y-3">
                    {testResults.length > 0 ? (
                      testResults.map((result, index) => (
                        <div key={result.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Test Case {index + 1}
                            </span>
                            <Badge
                              variant={result.passed ? 'default' : 'destructive'}
                              className={result.passed ? 'bg-green-100 text-green-800' : ''}
                            >
                              {result.passed ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {result.passed ? 'Passed' : 'Failed'}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="text-gray-600">Input:</span>{' '}
                              <code className="bg-white px-2 py-1 rounded">
                                "{result.input}"
                              </code>
                            </div>
                            <div>
                              <span className="text-gray-600">Expected:</span>{' '}
                              <code className="bg-white px-2 py-1 rounded">
                                "{result.expected}"
                              </code>
                            </div>
                            <div>
                              <span className="text-gray-600">Actual:</span>{' '}
                              <code className="bg-white px-2 py-1 rounded">
                                "{result.actual}"
                              </code>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        Run tests to see results
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </GameLayout>
  );
}