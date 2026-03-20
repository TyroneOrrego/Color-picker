import { useState, useRef, useEffect } from 'react'
import { Copy, Check, RefreshCw, Pipette } from 'lucide-react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { useEyeDropper } from '../hooks/useEyeDropper'

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#646cff')
  const [isOpen, setIsOpen] = useState(false)
  const [copiedHex, setCopiedHex] = useState(false)
  const [copiedRgb, setCopiedRgb] = useState(false)
  const { isSupported, isActive, openEyeDropper, error } = useEyeDropper()

  const handleEyeDropper = async () => {
    const hex = await openEyeDropper();
    if (hex) {
      setSelectedColor(hex);
    }
  }
  
  const popoverRef = useRef<HTMLDivElement>(null)
  const hexTimeoutRef = useRef<number | undefined>(undefined)
  const rgbTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `${r}, ${g}, ${b}`
  }

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor)
  }

  const generateRandomColor = () => {
    const randomColor = Math.floor(Math.random()*16777216).toString(16).padStart(6, '0')
    setSelectedColor(`#${randomColor}`)
  }

  const copyToClipboard = async (text: string, type: 'hex' | 'rgb') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'hex') {
        setCopiedHex(true)
        clearTimeout(hexTimeoutRef.current)
        hexTimeoutRef.current = window.setTimeout(() => setCopiedHex(false), 2000)
      } else {
        setCopiedRgb(true)
        clearTimeout(rgbTimeoutRef.current)
        rgbTimeoutRef.current = window.setTimeout(() => setCopiedRgb(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const rgbColor = `rgb(${hexToRgb(selectedColor)})`

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white shadow-2xl rounded-3xl border border-zinc-200/50">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Color Picker</h1>
        <div className="flex space-x-2">
          {isSupported && (
            <button
              onClick={handleEyeDropper}
              disabled={isActive}
              className={`p-2 rounded-full transition-all active:scale-95 ${isActive ? 'bg-blue-100 text-blue-600' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
              title="Pick color from screen"
              aria-label="Pick color from screen"
            >
              <Pipette className="w-5 h-5" />
            </button>
          )}
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

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl relative animate-in fade-in zoom-in-95 duration-200 text-center font-medium">
          {error}
        </div>
      )}

      <div 
        className="w-full h-48 mb-6 rounded-2xl shadow-inner transition-colors duration-200 ease-in-out border border-black/5"
        style={{ backgroundColor: selectedColor }}
      ></div>

      <div className="mb-8 relative" ref={popoverRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-4 p-2 bg-zinc-50 rounded-xl border border-zinc-200/60 transition-all cursor-pointer hover:bg-zinc-100"
        >
          <div 
            className="w-14 h-14 rounded-lg shadow-sm border border-black/5 flex-shrink-0 transition-colors duration-200"
            style={{ backgroundColor: selectedColor }}
          ></div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Select Color</p>
            <p className="text-lg font-medium text-zinc-900 leading-none">{selectedColor.toUpperCase()}</p>
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-3 z-50 p-4 bg-white shadow-2xl rounded-2xl border border-zinc-200/60 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
            <HexColorPicker color={selectedColor} onChange={handleColorChange} />
            <div className="mt-4 flex items-center w-full px-3 py-2 bg-zinc-50 border border-zinc-200/60 rounded-xl focus-within:ring-2 focus-within:ring-zinc-900/10 focus-within:border-zinc-400 transition-all">
              <span className="text-zinc-400 font-mono text-sm mr-1">#</span>
              <HexColorInput 
                color={selectedColor} 
                onChange={handleColorChange} 
                className="w-full bg-transparent border-none outline-none text-sm font-mono text-zinc-700 uppercase"
                placeholder="FFFFFF"
              />
            </div>
          </div>
        )}
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
