import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, ArrowRight, Info, AlertCircle, Search, 
  ChevronDown, Wand2, X, BookOpen, BrainCircuit
} from 'lucide-react';
import trizData from './data/triz-data.json';
import principlesDetail from './data/principles-detail.json';
import { licenses } from './data/licenses';

// 大規模類語マッピング（擬似AIエンジン用）
const KEYWORD_MAP = [
  { id: '1', keywords: ['重', '軽', 'ウェイト', '質量', '軽量化', 'ダイエット', '肉抜き', 'スリム', 'ヘビー', 'ライト', '分厚い', '薄く'], parameter: '1. 移動物体の重量' },
  { id: '2', keywords: ['静止', '固定', '据え置き', '動かない', '土台'], parameter: '2. 静止物体の重量' },
  { id: '3', keywords: ['長さ', '短い', 'ロング', 'ショート', '延長', '距離', 'サイズ（長）'], parameter: '3. 移動物体の長さ' },
  { id: '9', keywords: ['速', 'スピード', '時間', '早く', '短縮', '時短', 'ラグ', '遅延', 'もたつき', '処理落ち', 'テキパキ', 'キビキビ', 'スロー'], parameter: '9. 速度' },
  { id: '10', keywords: ['力', 'パワー', '押す', 'トルク', '馬力', '出力', 'エネルギー量', 'プッシュ'], parameter: '10. 力' },
  { id: '11', keywords: ['応力', '圧力', 'プレッシャー', 'ストレス', '負荷', 'テンション', '張力', '圧縮'], parameter: '11. 応力、圧力' },
  { id: '12', keywords: ['形', 'デザイン', 'スマート', '外観', 'ルックス', 'シルエット', 'スタイリッシュ', '歪み', '変形'], parameter: '12. 形状' },
  { id: '13', keywords: ['安定', 'ぐらつき', 'バランス', '転倒', '倒れる', '揺れ', '剛性'], parameter: '13. 物体の安定性' },
  { id: '14', keywords: ['強', '壊', '頑丈', '耐久', '強度', '脆い', 'バキバキ', 'ひび', 'タフ', '折れる', '劣化'], parameter: '14. 強度' },
  { id: '15', keywords: ['動作時間', '寿命', '長持ち', 'スタミナ', 'バッテリー'], parameter: '15. 移動物体の動作時間' },
  { id: '17', keywords: ['熱', '温', '冷', '温度', '過熱', 'オーバーヒート', '冷却', 'フリーズ', 'ヒート'], parameter: '17. 温度' },
  { id: '18', keywords: ['輝度', '明るさ', '光', 'まぶしい', '暗い', '照明', '視認性'], parameter: '18. 輝度' },
  { id: '19', keywords: ['燃費', 'エコ', 'バッテリー消費', '電力', '電気代', 'ガス代', 'エネルギー源'], parameter: '19. 移動物体のエネルギー消費' },
  { id: '22', keywords: ['無駄', 'エネルギーロス', '漏れ', '浪費', '排熱', '摩擦'], parameter: '22. エネルギーの損失' },
  { id: '23', keywords: ['物質不足', 'ロス', '歩留まり', '削りかす', '端材', 'ゴミ'], parameter: '23. 物質の損失' },
  { id: '25', keywords: ['待ち時間', 'タイムロス', '時間の無駄', 'アイドリング'], parameter: '25. 時間の損失' },
  { id: '27', keywords: ['信頼', '故障', 'バグ', 'エラー', 'ミス', '確実性', '安定稼働', 'トラスト'], parameter: '27. 信頼性' },
  { id: '28', keywords: ['正確', '精度', '誤差', '測定', 'ズレ', 'ばらつき'], parameter: '28. 測定精度' },
  { id: '32', keywords: ['作りやすさ', '製造', '加工', '量産', '組み立て', 'コストダウン', '内製'], parameter: '32. 製造の容易性' },
  { id: '33', keywords: ['使いやすさ', '操作', 'UI', 'UX', '直感的', 'マニュアル', '習得', '簡単', '楽', 'スムーズ', 'ユーザビリティ'], parameter: '33. 操作の容易性' },
  { id: '35', keywords: ['柔軟', '適応', '変化', '多目的', '万能', 'マルチ', '汎用'], parameter: '35. 適応性、多様性' },
  { id: '36', keywords: ['複雑', '難しい', '構造', 'スパゲッティ', 'ごちゃごちゃ', 'シンプル', '簡素'], parameter: '36. 装置の複雑さ' },
  { id: '39', keywords: ['効率', '生産性', 'たくさん', '大量', 'アウトプット', 'スループット', 'ノルマ', '稼働率'], parameter: '39. 生産性' },
];

const EXAMPLE_PROBLEMS = [
  "スリムにしたいが、壊れやすくなる",
  "処理を高速化したいが、バッテリーが持たない",
  "多機能にしたいが、操作がごちゃごちゃする",
  "精度を極めたいが、コスト計算が合わない",
  "ラグ（遅延）を減らしたいが、精度が悪くなる",
  "パワーを上げたいが、熱を持ってしまう",
];

const SearchableSelect = ({ label, value, onChange, options, colorClass, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  const filteredOptions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return options;
    return options.filter(opt => 
      opt.toLowerCase().includes(term)
    );
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4" ref={containerRef}>
      <label className={`flex items-center gap-2 text-sm font-semibold ${colorClass} uppercase tracking-widest pl-1`}>
        <div className={`w-2 h-2 rounded-full ${colorClass.replace('text-', 'bg-')}`} />
        {label}
      </label>
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full glass rounded-xl p-4 flex items-center justify-between cursor-pointer group hover:border-white/20 transition-all text-left"
        >
          <span className={value ? "text-slate-100 font-medium" : "text-slate-500"}>
            {value || placeholder}
          </span>
          <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 w-full mt-2 glass rounded-xl overflow-hidden shadow-2xl border-white/10"
            >
              <div className="p-2 border-b border-white/5 bg-slate-900/50">
                <div className="relative flex items-center">
                  <Search size={14} className="absolute left-3 text-slate-500" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="パラメータを検索..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-800/80 border-none rounded-lg py-2 pl-9 pr-4 text-sm text-slate-100 outline-none focus:ring-1 ring-indigo-500/50"
                  />
                  {search && (
                    <button 
                      onClick={() => setSearch('')}
                      className="absolute right-2 p-1 hover:bg-white/10 rounded-md text-slate-500"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="select-dropdown custom-scrollbar max-h-60 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full text-left select-option text-sm ${value === opt ? 'selected' : 'text-slate-300'}`}
                    >
                      {opt}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">
                    マッチする項目がありません
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PrincipleCard = ({ principle, detailed = false }) => {
  const detail = principlesDetail.find(p => p.id === principle.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-card rounded-2xl flex flex-col gap-3 group ${detailed ? 'p-8' : 'p-6'}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-400 tracking-wider">PRINCIPLE #{principle.id}</span>
        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
          <Lightbulb size={detailed ? 20 : 16} />
        </div>
      </div>
      <h3 className={`${detailed ? 'text-2xl' : 'text-xl'} font-bold text-slate-100 group-hover:text-indigo-300 transition-colors`}>
        {principle.name}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">
        {principle.description}
      </p>
      
      {detailed && detail && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3 font-normal">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <BrainCircuit size={14} className="text-purple-400" />
            具体的・代表的な事例
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 gap-x-6">
            {detail.examples.map((ex, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                <div className="mt-1 w-1 h-1 rounded-full bg-indigo-500 flex-shrink-0" />
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

const LicenseModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(licenses[0].id);
  const activeLicense = licenses.find(l => l.id === activeTab);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl h-[600px] glass rounded-3xl overflow-hidden flex flex-col shadow-2xl border-white/10"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Info size={20} className="text-indigo-400" />
                Information & Licenses
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-1/3 border-r border-white/5 overflow-y-auto p-2 bg-white/2 custom-scrollbar">
                {licenses.map((lib) => (
                  <button
                    key={lib.id}
                    onClick={() => setActiveTab(lib.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm mb-1 ${
                      activeTab === lib.id 
                        ? 'bg-indigo-500/10 text-indigo-400 font-bold' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {lib.name}
                    <div className="text-[10px] font-normal opacity-60 uppercase tracking-wider">{lib.license}</div>
                  </button>
                ))}
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-900/30 custom-scrollbar">
                {activeLicense && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{activeLicense.name}</h3>
                      <p className="text-indigo-400 text-sm font-medium">{activeLicense.license} License</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-6 font-mono text-[11px] leading-relaxed text-slate-300 border border-white/5 whitespace-pre-wrap">
                      {activeLicense.text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [view, setView] = useState('solver'); // 'solver' or 'dictionary'
  const [problem, setProblem] = useState('');
  const [improveParam, setImproveParam] = useState('');
  const [worsenParam, setWorsenParam] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [dictSearch, setDictSearch] = useState('');
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);

  const handleSuggest = () => {
    if (!problem.trim()) return;
    setIsSuggesting(true);
    
    const parts = problem.split(/[が、しかし、けど、。]/);
    const firstPart = parts[0] || '';
    const lastPart = parts.slice(1).join(' ') || '';

    let suggestedImprove = '';
    let suggestedWorsen = '';

    for (const rule of KEYWORD_MAP) {
      if (rule.keywords.some(k => firstPart.includes(k))) {
        suggestedImprove = rule.parameter;
        break;
      }
    }

    const worsenSource = lastPart || problem;
    for (const rule of KEYWORD_MAP) {
      if (rule.keywords.some(k => worsenSource.includes(k))) {
        if (rule.parameter !== suggestedImprove || worsenSource !== firstPart) {
          suggestedWorsen = rule.parameter;
          if (suggestedWorsen !== suggestedImprove) break;
        }
      }
    }

    setImproveParam(suggestedImprove || '40. カスタム');
    setWorsenParam(suggestedWorsen || (suggestedImprove ? '40. カスタム' : ''));
    setTimeout(() => setIsSuggesting(false), 500);
  };

  const recommendedPrinciples = useMemo(() => {
    if (!improveParam || !worsenParam) return { type: 'none', principles: [] };
    
    // 標準マトリクスから検索
    const match = trizData.contradictions.find(
      c => c.improve === improveParam && c.worsen === worsenParam
    );

    // マッチした場合
    if (match && match.principles.length > 0) {
      return {
        type: 'standard',
        principles: match.principles.map(id => 
          trizData.principles.find(p => p.id === id)
        ).filter(Boolean)
      };
    }

    // マッチしない、またはカスタムパラメータの場合の汎用的な解決策 (1, 13, 15, 35)
    const fallbackIds = [1, 13, 15, 35];
    return {
      type: 'fallback',
      principles: fallbackIds.map(id => 
        trizData.principles.find(p => p.id === id)
      ).filter(Boolean)
    };
  }, [improveParam, worsenParam]);

  const filteredPrinciples = useMemo(() => {
    if (!dictSearch.trim()) return principlesDetail;
    const term = dictSearch.toLowerCase();
    return principlesDetail.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      p.examples.some(ex => ex.toLowerCase().includes(term))
    );
  }, [dictSearch]);

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col gap-8 md:gap-12">
      {/* Navigation Tabs */}
      <nav className="max-w-md mx-auto w-full glass rounded-full p-1.5 flex gap-1">
        <button
          onClick={() => setView('solver')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all ${
            view === 'solver' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BrainCircuit size={18} />
          ソルバー
        </button>
        <button
          onClick={() => setView('dictionary')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all ${
            view === 'dictionary' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BookOpen size={18} />
          辞典
        </button>
      </nav>

      {view === 'solver' ? (
        <>
          <header className="max-w-4xl mx-auto w-full text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                TRIZ Solver
              </h1>
              <p className="text-slate-400 text-lg font-medium">矛盾から革新的なアイデアを導き出す</p>
            </motion.div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full"></div>
                <div className="relative glass rounded-2xl p-2 flex items-center overflow-hidden focus-within:ring-2 ring-indigo-500/50 transition-all border-white/20">
                  <div className="pl-4 text-slate-500">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="[改善したいこと] が、[悪化すること]..."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-3 px-4 text-lg text-slate-100 placeholder:text-slate-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
                  />
                  <button
                    onClick={handleSuggest}
                    disabled={!problem.trim()}
                    className={`mr-2 px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${
                      !problem.trim() 
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                    } ${isSuggesting ? 'animate-pulse-once' : ''}`}
                  >
                    <Wand2 size={16} />
                    <span className="hidden sm:inline">提案</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] pl-1 h-4">
                  <Lightbulb size={12} className="text-indigo-400" />
                  入力のヒント
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAMPLE_PROBLEMS.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setProblem(ex)}
                      className="example-chip hover:scale-105 active:scale-95"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <section className="max-w-5xl mx-auto w-full grid md:grid-cols-[1fr_auto_1fr] items-start gap-8 px-4">
            <SearchableSelect 
              label="改善したい項目"
              value={improveParam}
              onChange={setImproveParam}
              options={trizData.parameters}
              colorClass="text-emerald-400"
              placeholder="改善項目を選択"
            />
            <div className="hidden md:flex items-center justify-center text-slate-700 pt-12">
              <ArrowRight size={32} strokeWidth={1} />
            </div>
            <SearchableSelect 
              label="改悪される項目"
              value={worsenParam}
              onChange={setWorsenParam}
              options={trizData.parameters}
              colorClass="text-rose-400"
              placeholder="悪化項目を選択"
            />
          </section>

          <main className="max-w-6xl mx-auto w-full pb-20">
            <AnimatePresence mode="wait">
              {!improveParam || !worsenParam ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 space-y-4 opacity-30"
                >
                  <div className="flex justify-center text-slate-600">
                    <BrainCircuit size={64} strokeWidth={1} />
                  </div>
                  <p className="text-xl font-light">パラメータを選択して分析を開始</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 px-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                          <BrainCircuit size={28} />
                        </div>
                        推奨される解決策
                      </h2>
                      {recommendedPrinciples.type === 'fallback' && (
                        <p className="text-xs text-amber-400 flex items-center gap-1 pl-11">
                          <AlertCircle size={12} />
                          マトリクスに直接の回答がないため、汎用的な原理を提案しています
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-mono tracking-widest bg-white/5 py-1 px-3 rounded-full self-start md:self-center">
                      {recommendedPrinciples.principles.length} PRINCIPLES
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendedPrinciples.principles.map((principle) => (
                      <PrincipleCard key={principle.id} principle={principle} detailed={true} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </>
      ) : (
        <main className="max-w-7xl mx-auto w-full pb-20 space-y-12">
          <header className="text-center space-y-4 px-4">
            <h2 className="text-4xl font-bold text-slate-100">発明原理・逆引き辞典</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              すべての発明原理を詳細な具体例とともに確認できます。
            </p>
            <div className="max-w-md mx-auto relative mt-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="原理名、キーワードで検索..."
                value={dictSearch}
                onChange={(e) => setDictSearch(e.target.value)}
                className="w-full glass rounded-2xl py-4 pl-12 pr-4 text-slate-100 outline-none focus:ring-2 ring-indigo-500/30 border-white/10 shadow-lg"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            <AnimatePresence>
              {filteredPrinciples.map((p) => (
                <PrincipleCard 
                  key={p.id} 
                  principle={{ id: p.id, name: p.name, description: p.description }} 
                  detailed={true} 
                />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredPrinciples.length === 0 && (
            <div className="text-center py-20 text-slate-600">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p>条件に一致する原理が見つかりませんでした</p>
            </div>
          )}
        </main>
      )}

      <footer className="mt-auto text-center py-8 text-slate-600 text-[10px] border-t border-white/5 max-w-4xl mx-auto w-full font-mono uppercase tracking-[0.3em] flex flex-col items-center gap-2">
        <span>TRIZ Solver & Encyclopedia v2.0</span>
        <button 
          onClick={() => setIsLicenseOpen(true)}
          className="hover:text-indigo-400 transition-colors uppercase cursor-pointer"
        >
          Licenses
        </button>
      </footer>

      <LicenseModal isOpen={isLicenseOpen} onClose={() => setIsLicenseOpen(false)} />
    </div>
  );
}
