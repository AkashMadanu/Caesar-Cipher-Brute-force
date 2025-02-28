'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RotateCcw, PlayCircle, Pause } from 'lucide-react';

interface EncryptionStep {
  original: string;
  shifted: string;
  shift: number;
}

interface BruteForceResult {
  key: number;
  text: string;
}

const CaesarCipherDemo: React.FC = () => {
  const [plaintext, setPlaintext] = useState<string>('HELLO');
  const [key, setKey] = useState<number>(3);
  const [encrypted, setEncrypted] = useState<string>('');
  const [encryptionSteps, setEncryptionSteps] = useState<EncryptionStep[]>([]);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [currentAttempt, setCurrentAttempt] = useState<number>(0);
  const [bruteForceResults, setBruteForceResults] = useState<BruteForceResult[]>([]);

  const handleEncrypt = () => {
    const steps: EncryptionStep[] = [];
    const result = plaintext
      .toUpperCase()
      .split('')
      .map((char) => {
        if (char >= 'A' && char <= 'Z') {
          const originalCode = char.charCodeAt(0);
          const shiftedCode = ((originalCode - 65 + key) % 26) + 65;
          steps.push({
            original: char,
            shifted: String.fromCharCode(shiftedCode),
            shift: key,
          });
          return String.fromCharCode(shiftedCode);
        }
        return char;
      })
      .join('');

    setEncryptionSteps(steps);
    setEncrypted(result);
  };

  const handleReset = () => {
    setPlaintext('');
    setKey(3);
    setEncrypted('');
    setEncryptionSteps([]);
    setIsAttacking(false);
    setCurrentAttempt(0);
    setBruteForceResults([]);
  };

  useEffect(() => {
    if (isAttacking && currentAttempt < 26) {
      const timer = setTimeout(() => {
        const attemptResult = encrypted
          .toUpperCase()
          .split('')
          .map((char) => {
            if (char >= 'A' && char <= 'Z') {
              const originalCode = char.charCodeAt(0);
              const shiftedCode = ((originalCode - 65 - currentAttempt + 26) % 26) + 65;
              return String.fromCharCode(shiftedCode);
            }
            return char;
          })
          .join('');

        setBruteForceResults((prev) => [
          ...prev,
          { key: currentAttempt, text: attemptResult },
        ]);
        setCurrentAttempt((prev) => prev + 1);
      }, 500);

      return () => clearTimeout(timer);
    } else if (currentAttempt >= 26) {
      setIsAttacking(false);
    }
  }, [isAttacking, currentAttempt, encrypted]);

  const startBruteForce = () => {
    if (isAttacking) {
      setIsAttacking(false);
    } else {
      setIsAttacking(true);
      setCurrentAttempt(0);
      setBruteForceResults([]);
    }
  };

  const alphabetTable = Array.from({ length: 26 }, (_, i) => ({
    letter: String.fromCharCode(65 + i),
    number: i,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Heading */}
      <h1 className="text-center text-4xl font-bold mb-4">
        Caesar Cipher Encryption Demo with Bruteforce Attack
      </h1>
      
      <div className="flex space-x-4">
        {/* Card for Encryption */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Encrypt Your Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Plaintext:</label>
                  <Input 
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    placeholder="Enter text to encrypt"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium mb-2">Key:</label>
                  <Input 
                    type="number"
                    value={key}
                    onChange={(e) => setKey(parseInt(e.target.value) || 0)}
                    min="0"
                    max="25"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleEncrypt}>Encrypt</Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              {encryptionSteps.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h3 className="text-lg font-semibold">Encryption Process:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {encryptionSteps.map((step, index) => (
                      <div key={index} className="p-2 border rounded-md bg-slate-50">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="font-mono">
                            Original: {step.original} ({step.original.charCodeAt(0) - 65})
                          </div>
                          <div className="font-mono">
                            Shift by {step.shift} →
                          </div>
                          <div className="font-mono">
                            Result: {step.shifted} ({step.shifted.charCodeAt(0) - 65})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-slate-100 rounded-md">
                    <div className="font-semibold mb-2">Final Result:</div>
                    <div className="font-mono text-lg">{encrypted}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alphabet Table */}
        <div className="w-48">
          <h3 className="text-lg font-semibold mb-2">Alphabet Table</h3>
          <table className="table-auto border-collapse border border-gray-200 w-full text-center">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1">Letter</th>
                <th className="border border-gray-300 px-2 py-1">Number</th>
              </tr>
            </thead>
            <tbody>
              {alphabetTable.map((item) => (
                <tr key={item.letter}>
                  <td className="border border-gray-300 px-2 py-1">{item.letter}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brute Force Section */}
      {encrypted && (
        <Card>
          <CardHeader>
            <CardTitle>Brute Force Attack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4 items-center">
                <Button 
                  onClick={startBruteForce}
                  disabled={currentAttempt === 26}
                >
                  {isAttacking ? (
                    <><Pause className="w-4 h-4 mr-2" /> Pause</>
                  ) : (
                    <><PlayCircle className="w-4 h-4 mr-2" /> Start Attack</>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                {bruteForceResults.map((result, index) => (
                  <div 
                    key={index}
                    className="p-2 border rounded-md flex items-center"
                  >
                    <div className="w-20 font-mono">Key {result.key}:</div>
                    <div className="flex-1 font-mono">{result.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CaesarCipherDemo;
