'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function QRDisplay({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { width: 256, margin: 2 })
    }
  }, [url])

  function downloadQR() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div>
      <canvas ref={canvasRef} className="mx-auto rounded-lg" />
      <button
        onClick={downloadQR}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        QRコードをダウンロード
      </button>
    </div>
  )
}
