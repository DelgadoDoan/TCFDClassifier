import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { InputField } from "@/components/input-field"
import { ResultsView } from "@/components/results-view"
import logo from '@/assets/logo.png';

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
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <img src={logo} alt="Logo" width="50" height="50" />
          <h1 className="text-left font-bold text-3xl ml-4">ClimAID</h1>
        </div>
        
        <ModeToggle />
      </div>

      <div className="mt-10">
        <h1 className="text-center text-3xl font-bold mb-2">Welcome to ClimAID!</h1>
        <h3 className="text-center">A TCFD Recommendations Classifier Website</h3>
      </div>
      

      <div className="justify-self-center w-1/2 space-y-6 mt-15">
        <h1 className="text-center font-bold">Start classifying your text below</h1>
        <InputField setResult={handleResult} />
        
        {result && (
          <div className="border-t pt-5 pb-5">
            <h1 className="text-center font-bold mb-5">Result</h1>
            <ResultsView result={result} />
          </div>
        )}

        <h2 className="text-center border-t pt-5"><strong>Logs</strong></h2>    

        {logs.length > 0 && (
          <div style={{ wordBreak: 'break-all' }}>
            <ul className="text-start space-y-2">
              {logs.map((log, idx) => (
                <li key={idx} className="border-b pb-5">
                  Prompt: {log.prompt} <br />
                  Output: {log.response} <br />
                  Model: {log.model}
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
