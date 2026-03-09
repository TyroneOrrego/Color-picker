import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#646cff')
  const [copiedHex, setCopiedHex] = useState(false)
  const [copiedRgb, setCopiedRgb] = useState(false)

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `${r}, ${g}, ${b}`
  }

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value)
  }

  const generateRandomColor = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    setSelectedColor(`#${randomColor}`)
  }

  const copyToClipboard = async (text: string, type: 'hex' | 'rgb') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'hex') {
        setCopiedHex(true)
        setTimeout(() => setCopiedHex(false), 2000)
      } else {
        setCopiedRgb(true)
        setTimeout(() => setCopiedRgb(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const rgbColor = `rgb(${hexToRgb(selectedColor)})`

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-zinc-200/50">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Color Picker</h1>
        <div className="flex space-x-2">
          <button
            onClick={generateRandomColor}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all active:scale-95"
            title="Generate Random Color"
            aria-label="Generate Random Color"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        className="w-full h-48 mb-6 rounded-2xl shadow-inner transition-colors duration-200 ease-in-out border border-black/5"
        style={{ backgroundColor: selectedColor }}
      ></div>

      <div className="mb-8 relative group">
        <label
          htmlFor="color-picker-input"
          className="flex items-center space-x-4 p-2 bg-zinc-50 rounded-xl border border-zinc-200/60 focus-within:ring-2 focus-within:ring-zinc-900/10 focus-within:border-zinc-400 transition-all cursor-pointer"
        >
           <input
            id="color-picker-input"
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
            className="w-14 h-14 rounded-lg cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-lg [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-lg shadow-sm"
            title="Choose a color"
          />
          <div className="flex-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Select Color</p>
            <p className="text-lg font-medium text-zinc-900 leading-none">{selectedColor.toUpperCase()}</p>
          </div>
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-100">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">HEX</p>
            <p className="text-lg font-semibold text-zinc-800 font-mono">{selectedColor.toUpperCase()}</p>
          </div>
          <button
            onClick={() => copyToClipboard(selectedColor.toUpperCase(), 'hex')}
            title="Copy HEX value"
            aria-label="Copy HEX value"
            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
              copiedHex ? 'bg-green-100 text-green-600' : 'bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm border border-zinc-200/50'
            }`}
          >
            {copiedHex ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-100">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">RGB</p>
            <p className="text-lg font-semibold text-zinc-800 font-mono">{rgbColor}</p>
          </div>
           <button
            onClick={() => copyToClipboard(rgbColor, 'rgb')}
            title="Copy RGB value"
            aria-label="Copy RGB value"
            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
              copiedRgb ? 'bg-green-100 text-green-600' : 'bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm border border-zinc-200/50'
            }`}
          >
            {copiedRgb ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
