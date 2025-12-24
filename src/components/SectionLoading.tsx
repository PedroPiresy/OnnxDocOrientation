export default function SectionLoading() {
  return (
    <div className="flex items-center gap-3 text-green-400 py-8">
      <div className="flex items-center gap-1.5">
        <div 
          className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
          style={{ animationDelay: '0s' }}
        ></div>
        <div 
          className="w-2 h-2 bg-green-500 rounded-full animate-pulse" 
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div 
          className="w-2 h-2 bg-green-500 rounded-full animate-pulse" 
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
      <span className="text-sm animate-pulse">Carregando dados</span>
      <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>.</span>
      <span className="animate-pulse" style={{ animationDelay: '0.8s' }}>.</span>
      <span className="animate-pulse" style={{ animationDelay: '1s' }}>.</span>
    </div>
  );
}

