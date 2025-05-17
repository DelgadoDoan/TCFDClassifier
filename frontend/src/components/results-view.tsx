"use client"

export function ResultsView({ result }: { result: any }) {
  return (
    <div className="flex justify-center">
      <pre>{JSON.stringify(result["response"][0], null, 2  )}</pre>
    </div>
  )
}
