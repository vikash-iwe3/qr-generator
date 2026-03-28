import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  QrCode,
  Download,
  History,
  Settings,
  Plus,
  Trash2,
  Copy,
  Check,
  ArrowLeft,
  Share2,
  Menu,
  X
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function App() {
  const [value, setValue] = useState('')
  const [size] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [level, setLevel] = useState('M')
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('qr-history')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Failed to parse history", e)
        return []
      }
    }
    return []
  })
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('create')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const saveToHistory = () => {
    if (!value) return
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      value,
      date: new Date().toLocaleString()
    }
    const updated = [newItem, ...history].slice(0, 20)
    setHistory(updated)
    localStorage.setItem('qr-history', JSON.stringify(updated))
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-code-${Date.now()}.png`
      downloadLink.href = `${pngFile}`
      downloadLink.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-xl">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">QR Studio</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('create')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
              activeTab === 'create' ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            )}
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
              activeTab === 'history' ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            )}
          >
            <History className="w-5 h-5" />
            History
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 px-4 py-2 text-sm text-slate-500">
            <Settings className="w-4 h-4" />
            Settings
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header Mobile Only */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">QR Studio</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-2 text-slate-600 dark:text-slate-400"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-4xl mx-auto h-full flex flex-col lg:flex-row gap-10">

            {activeTab === 'create' ? (
              <>
                {/* Input Controls */}
                <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Content</label>
                    <div className="relative group">
                      <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Paste URL or type text here..."
                        className="w-full h-32 px-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-lg"
                      />
                      <div className="absolute right-3 bottom-3 flex gap-2">
                        <button
                          onClick={copyToClipboard}
                          disabled={!value}
                          className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Foreground</label>
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                        />
                        <span className="font-mono text-sm uppercase">{fgColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Background</label>
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                        />
                        <span className="font-mono text-sm uppercase">{bgColor}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Precision (Error Correction)</label>
                    <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
                      {['L', 'M', 'Q', 'H'].map((l) => (
                        <button
                          key={l}
                          onClick={() => setLevel(l)}
                          className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                            level === l ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          )}
                        >
                          {l === 'L' && 'Low'}
                          {l === 'M' && 'Medium'}
                          {l === 'Q' && 'Quartile'}
                          {l === 'H' && 'High'}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Preview Panel */}
                <div className="w-full lg:w-[400px] shrink-0">
                  <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-xl shadow-blue-500/5 flex flex-col items-center">
                    <div className="relative group bg-white p-6 rounded-3xl shadow-inner border border-slate-100">
                      {value ? (
                        <QRCodeSVG
                          id="qr-code-svg"
                          value={value}
                          size={240}
                          fgColor={fgColor}
                          bgColor={bgColor}
                          level={level}
                          includeMargin={true}
                        />
                      ) : (
                        <div className="w-[240px] h-[240px] flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                          <QrCode className="w-16 h-16 mb-4 opacity-20" />
                          <p className="text-sm">Preview will appear here</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-10 w-full space-y-3">
                      <button
                        onClick={() => {
                          saveToHistory()
                          downloadQR()
                        }}
                        disabled={!value}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
                      >
                        <Download className="w-5 h-5" />
                        Download PNG
                      </button>
                      <button
                        disabled={!value}
                        className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                      >
                        <Share2 className="w-5 h-5" />
                        Share Code
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Recent Generations</h2>
                  <button
                    onClick={() => {
                      setHistory([])
                      localStorage.removeItem('qr-history')
                    }}
                    className="text-red-500 text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-4 h-4" /> Clear All
                  </button>
                </div>

                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 group"
                      >
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <QRCodeSVG value={item.value} size={48} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-slate-900 dark:text-slate-100">{item.value}</p>
                          <p className="text-xs text-slate-500">{item.date}</p>
                        </div>
                        <button
                          onClick={() => {
                            setValue(item.value)
                            setActiveTab('create')
                          }}
                          className="p-2 opacity-0 group-hover:opacity-100 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <History className="w-12 h-12 mb-4 opacity-20" />
                    <p>No history yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden flex bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-3 pb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={cn(
              "flex-1 flex flex-col items-center gap-1",
              activeTab === 'create' ? "text-blue-600" : "text-slate-400"
            )}
          >
            <Plus className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Create</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 flex flex-col items-center gap-1",
              activeTab === 'history' ? "text-blue-600" : "text-slate-400"
            )}
          >
            <History className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">History</span>
          </button>
        </nav>
      </main>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-800 p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">QR Studio</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-4">
              <button className="w-full text-left font-medium p-2 text-slate-600">Upgrade to Pro</button>
              <button className="w-full text-left font-medium p-2 text-slate-600">Saved Templates</button>
              <button className="w-full text-left font-medium p-2 text-slate-600 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
