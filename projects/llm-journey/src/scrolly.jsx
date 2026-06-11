/* Scrolly shell — each scene = tall section; visual stage sticky-pinned; scroll drives
   per-scene progress (chop count, order-stamp position, FFN beats, layer scrub).
   Loads after shared.jsx. Header height comes from the --hdr CSS variable so the
   mobile media query can grow it without breaking the sticky offset. */
function useScrollProgress(count){
  const refs=useRef([]);
  const [state,setState]=useState({active:0,progress:Array(count).fill(0)});
  useEffect(()=>{
    const onScroll=()=>{
      const vh=window.innerHeight;
      let active=0; const progress=[];
      refs.current.forEach((el,i)=>{
        if(!el){progress.push(0);return;}
        const r=el.getBoundingClientRect();
        const total=r.height-vh;
        const p=total>0?Math.min(1,Math.max(0,-r.top/total)):0;
        progress.push(p);
        if(r.top<=vh*0.5&&r.bottom>=vh*0.5) active=i;
      });
      setState({active,progress});
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    onScroll();
    return ()=>window.removeEventListener('scroll',onScroll);
  },[count]);
  return [refs,state];
}
function ScrollyApp(){
  const [lang,setLang]=useState(localStorage.getItem('lj-lang')||'en');
  const L=STRINGS[lang];
  const prompt=PROMPTS[lang]||PROMPTS.en;
  useEffect(()=>{localStorage.setItem('lj-lang',lang);},[lang]);
  const [refs,{active,progress}]=useScrollProgress(SCENES.length);
  // scenes that consume scroll progress; the rest stay self-interactive
  const SCROLL_DRIVEN=[1,3,5,6];
  return (
    <div>
      <header className="lj-header" style={{position:'fixed',top:0,left:0,right:0,zIndex:50,
        display:'flex',alignItems:'center',gap:14,padding:'10px 22px',
        background:'rgba(250,248,243,.94)',borderBottom:`2px solid ${INK}`}}>
        <h1 className="hand" style={{fontSize:26,margin:0}}>{L.appTitle}</h1>
        <div className="lj-rail" style={{display:'flex',gap:6,flexWrap:'wrap'}} data-testid="rail">
          {L.stops.map((s,i)=>(
            <span key={i} style={{border:`1.5px solid ${INK}`,borderRadius:14,padding:'2px 9px',
              fontSize:11,fontWeight:800,whiteSpace:'nowrap',
              background:i===active?(i===7?RUST:BLUE):'#fff',
              color:i===active?'#fff':INK}}>{s}</span>))}
        </div>
        <a className="wb-btn" href="index.html" data-testid="home"
          style={{marginLeft:'auto',padding:'4px 12px',fontSize:12.5,textDecoration:'none',display:'inline-block'}}>⌂ {L.home}</a>
        <button className="wb-btn" style={{padding:'4px 12px',fontSize:12.5}}
          onClick={()=>setLang(l=>l==='en'?'zh':'en')} data-testid="lang-toggle">{L.langBtn}</button>
      </header>
      <div style={{height:'var(--hdr)'}}/>
      {SCENES.map((Scene,i)=>(
        <section key={i} ref={el=>refs.current[i]=el} data-scene={i}
          style={{minHeight:SCROLL_DRIVEN.includes(i)?'220vh':'130vh',position:'relative',
            borderBottom:'2px dashed rgba(43,43,43,.15)'}}>
          <div className="lj-sticky" style={{position:'sticky',top:'var(--hdr)',minHeight:'calc(100vh - var(--hdr))',
            display:'flex',alignItems:'center',
            opacity:i===active||Math.abs(i-active)<=1?1:.35,transition:'opacity .4s'}}>
            <div style={{width:'100%',padding:'10px 22px'}}>
              <Scene L={L} lang={lang} prompt={prompt}
                progress={SCROLL_DRIVEN.includes(i)?progress[i]:null}
                goto={(n)=>{const el=refs.current[n]; if(el) window.scrollTo({top:el.offsetTop,behavior:'smooth'});}}/>
            </div>
          </div>
        </section>))}
      <footer style={{padding:'20px 26px 40px',fontSize:12,color:'var(--faint)',textAlign:'center'}}>
        {L.footer}
      </footer>
    </div>);
}
ReactDOM.createRoot(document.getElementById('root')).render(<ScrollyApp/>);
