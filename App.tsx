import React, { useState, useEffect } from 'react';
import { DreamState, DreamRecord, InputMode, DreamType, Mood, Theme } from './types';
import { analyzeDream } from './services/geminiService';
import { APP_NAME } from './constants';
import SketchPad from './components/SketchPad';
import TagModal from './components/TagModal';
import Dashboard from './components/Dashboard';
import SystemStatus from './components/SystemStatus';
import AnalysisDisplay from './components/AnalysisDisplay';

const App: React.FC = () => {
  const [state, setState] = useState<DreamState>(() => {
    const saved = localStorage.getItem('dream_records');
    return {
      records: saved ? JSON.parse(saved) : [],
      currentView: 'home',
      isTagging: false,
      isStatusOpen: false,
      loading: false,
      error: null
    };
  });

  const [inputMode, setInputMode] = useState<InputMode>('Type');
  const [description, setDescription] = useState('');
  const [sketchData, setSketchData] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    localStorage.setItem('dream_records', JSON.stringify(state.records));
  }, [state.records]);

  const handleSpeech = () => {
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription(prev => prev + ' ' + transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const onAnalyzeRequest = () => {
    if (description.trim().length < 5 && !sketchData) return;
    setState(prev => ({ ...prev, isTagging: true }));
  };

  const handleSaveDream = async (tags: { type: DreamType, mood: Mood, themes: Theme[], clarity: number }) => {
    setState(prev => ({ ...prev, isTagging: false, loading: true, error: null }));
    
    try {
      const analysis = description.trim().length > 10 ? await analyzeDream(description) : null;
      const newRecord: DreamRecord = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        description,
        sketchData,
        analysis,
        type: tags.type,
        mood: tags.mood,
        themes: tags.themes,
        clarity: tags.clarity,
        intensity: tags.clarity > 7 ? 8.5 : 5.0, // Mocking intensity for now
        inputMode
      };

      setState(prev => ({
        ...prev,
        records: [newRecord, ...prev.records],
        loading: false,
        currentView: analysis ? 'home' : 'home' // Keep on home to show result if exists
      }));
      
      if (!analysis) {
        setDescription('');
        setSketchData('');
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const latestRecord = state.records[0];

  return (
    <div className="min-h-screen relative flex flex-col text-white pb-10 overflow-x-hidden">
      {/* Dynamic Subconscious Background */}
      <div className="fixed inset-0 -z-10 bg-[#0f0b1e] overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {state.currentView === 'home' ? (
        <div className="flex flex-col items-center pt-20 px-4">
          <div className="w-full max-w-xl text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl font-serif font-bold mb-4 tracking-tight">{APP_NAME}</h1>
            <p className="text-indigo-200/60 italic text-lg">"Dreams are the touchstones of our characters" — Henry David Thoreau</p>
          </div>

          <div className="w-full max-w-xl space-y-8">
            <div className="dreamy-glass rounded-[2.5rem] p-1 pb-6 shadow-2xl relative">
              {/* Header inside collector */}
              <div className="flex flex-col items-center py-8">
                 <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-3">
                   <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                 </div>
                 <h2 className="text-xl font-bold">Dream Fragment Collector</h2>
                 <p className="text-xs text-indigo-300/40 uppercase tracking-widest mt-1">Capture the whispers of your subconscious</p>
              </div>

              <div className="px-8 space-y-6">
                <button 
                  onClick={() => setState(prev => ({ ...prev, currentView: 'dashboard' }))}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-indigo-200 font-bold hover:bg-white/10 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  View Dream Dashboard
                </button>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                  {(['Sketch', 'Speak', 'Type'] as InputMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setInputMode(mode)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${inputMode === mode ? 'bg-indigo-600/30 text-white shadow-lg shadow-indigo-500/10' : 'text-indigo-300/40 hover:text-white'}`}
                    >
                      {mode === 'Sketch' && '✎ Sketch'}
                      {mode === 'Speak' && '🎙️ Speak'}
                      {mode === 'Type' && 'T Type'}
                    </button>
                  ))}
                </div>

                <div className="bg-black/30 rounded-3xl min-h-[200px] border border-indigo-500/10 p-6 flex flex-col">
                  {inputMode === 'Type' && (
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="I dreamed of floating through..."
                      className="flex-1 bg-transparent border-none resize-none focus:outline-none text-indigo-50 placeholder-indigo-300/20"
                    />
                  )}
                  {inputMode === 'Sketch' && (
                    <SketchPad onSave={setSketchData} />
                  )}
                  {inputMode === 'Speak' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                      <button 
                        onClick={handleSpeech}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600 shadow-xl'}`}
                      >
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </button>
                      <p className="text-indigo-300/60 text-sm">{isRecording ? 'Listening...' : 'Tap to start recording'}</p>
                      <div className="text-indigo-100/40 text-xs italic">{description}</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                   <span className="text-xs text-indigo-300/40">{description.length} characters</span>
                   <button 
                    disabled={state.loading || (description.length < 5 && !sketchData)}
                    onClick={onAnalyzeRequest}
                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all flex items-center gap-2"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                     {state.loading ? 'Interpreting...' : 'Tag & Save Dream'}
                   </button>
                </div>
              </div>
            </div>

            {latestRecord?.analysis && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-6">
                   <h3 className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Latest Insights</h3>
                </div>
                <AnalysisDisplay analysis={latestRecord.analysis} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Dashboard records={state.records} onBack={() => setState(prev => ({ ...prev, currentView: 'home' }))} />
      )}

      {/* Floating Status Indicator */}
      <button 
        onClick={() => setState(prev => ({ ...prev, isStatusOpen: true }))}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full dreamy-glass flex items-center justify-center hover:bg-white/10 transition-colors z-40 border border-white/20 shadow-xl"
      >
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </button>

      {state.isTagging && (
        <TagModal 
          onClose={() => setState(prev => ({ ...prev, isTagging: false }))} 
          onSave={handleSaveDream} 
        />
      )}

      <SystemStatus isOpen={state.isStatusOpen} onClose={() => setState(prev => ({ ...prev, isStatusOpen: false }))} />

      {state.error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-rose-500/20 border border-rose-500/40 px-6 py-3 rounded-2xl text-rose-200 text-sm animate-in slide-in-from-top-2">
          {state.error}
        </div>
      )}
    </div>
  );
};

export default App;
