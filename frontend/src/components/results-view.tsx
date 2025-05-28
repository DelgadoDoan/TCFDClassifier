"use client"

export function ResultsView({ result }: { result: any }) {
  return (
    <div className="flex justify-center font-bold uppercase text-2xl">
      {result["response"]}
    </div>
  )
}
