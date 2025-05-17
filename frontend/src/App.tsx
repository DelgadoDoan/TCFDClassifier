import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { InputField } from "@/components/input-field"
import { ResultsView } from "@/components/results-view"

function App() {
  const [result, setResult] = useState<any>(null)
  const [, setPreviousResult] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])

  const handleResult = (newResult: any) => {
    if (result) {
      setLogs((prevLogs) => [result, ...prevLogs]) // add previous result to logs
    }
    setPreviousResult(result)
    setResult(newResult)
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <ModeToggle />

      <div className="justify-self-center w-1/2 space-y-6">
        <h1 className="text-center font-bold mb-2">Classify your text</h1>
        <InputField setResult={handleResult} />
        
        {result && (
          <div>
            <h1 className="text-center font-bold mb-2">Result</h1>
            <ResultsView result={result} />
          </div>
        )}

        <h2 className="text-center"><strong>Logs</strong></h2>    

        {logs.length > 0 && (
          <div>
            <ul className="text-start space-y-2">
              {logs.map((log, idx) => (
                <li key={idx} className="border-b pb-1">
                  Prompt: {log.prompt} <br />
                  Output: {log.response[0].label} <br />
                  Model used: {log.model}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
