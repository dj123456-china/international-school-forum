import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, BookOpen, Bookmark, Check, ChevronDown, ChevronRight, Compass, Filter, Flame, Globe2, Heart, Info, LayoutGrid, MapPin, Menu, MessageCircle, PenLine, Plus, Search, Send, ShieldCheck, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import './styles.css'

// Clearly marked demo content. Replace with verified school records before launch.
const schools = [
  { name: '上海惠灵顿外籍人员子女学校', short: 'Wellington', city: '上海 · 浦东', curriculum: '英式课程', stage: '幼儿园–高中', tone: 'sand', tags: ['招生信息', '校园生活'], facts: ['本条为界面演示，学校名称、校区和课程信息尚未完成核验。', '正式资料应链接到学校官网或主管部门的公开页面。', '学费、招生条件、年级设置等信息需注明对应学年和发布日期。'], source: '待补充官方来源链接', updated: '示例条目，待编辑核验' },
  { name: '深圳贝赛思国际学校', short: 'BASIS Shenzhen', city: '深圳 · 南山', curriculum: '美式课程', stage: '幼儿园–高中', tone: 'ink', tags: ['招生信息', '课程体系'], facts: ['本条为界面演示，学校名称、校区和课程信息尚未完成核验。', '正式资料应链接到学校官网或主管部门的公开页面。', '学费、招生条件、年级设置等信息需注明对应学年和发布日期。'], source: '待补充官方来源链接', updated: '示例条目，待编辑核验' },
  { name: '北京德威英国国际学校', short: 'Dulwich Beijing', city: '北京 · 朝阳', curriculum: '英式课程', stage: '幼儿园–高中', tone: 'coral', tags: ['招生信息', '校园生活'], facts: ['本条为界面演示，学校名称、校区和课程信息尚未完成核验。', '正式资料应链接到学校官网或主管部门的公开页面。', '学费、招生条件、年级设置等信息需注明对应学年和发布日期。'], source: '待补充官方来源链接', updated: '示例条目，待编辑核验' },
  { name: '杭州国际学校', short: 'HIS', city: '杭州 · 滨江', curriculum: 'IB课程', stage: '幼儿园–高中', tone: 'mint', tags: ['招生信息', '课程体系'], facts: ['本条为界面演示，学校名称、校区和课程信息尚未完成核验。', '正式资料应链接到学校官网或主管部门的公开页面。', '学费、招生条件、年级设置等信息需注明对应学年和发布日期。'], source: '待补充官方来源链接', updated: '示例条目，待编辑核验' },
]

const initialPosts = [
  { id: 'p1', title: '转学季真实体验：如何判断学校的“隐性成本”？', body: '除了学费，还有校车、课后活动、家委会与入学前的时间成本。整理了一个可复用的核对清单。', author: '林同学', time: '示例内容', likes: 0, comments: [], tag: '择校经验', hot: false, school: '不限学校' },
  { id: 'p2', title: '求证｜家长口中的“名额锁定”到底是什么？', body: '想了解不同学校的候补名单和押金流程。只讨论政策与办事流程，不涉及任何老师或家庭的身份信息。', author: 'Mia', time: '示例内容', likes: 0, comments: [], tag: '入学政策', hot: false, school: '不限学校' },
  { id: 'p3', title: '老师怎么称呼更合适？论坛里统一只写姓氏', body: '建议用“姓氏＋老师”，例如“王老师”。若姓氏、学科、年级等组合仍能识别到个人，就换成化名并删掉可定位细节。讨论聚焦教学、流程和机制。', author: '阿麦', time: '示例内容', likes: 0, comments: [], tag: '社区规范', hot: false, school: '不限学校' },
  { id: 'p4', title: 'IB、A-Level、AP，选课前先问清这几件事', body: '课程名称不是学校体验的全部，也可以了解开课条件、师资连续性、学业支持和成绩报告口径。', author: 'Ethan', time: '示例内容', likes: 0, comments: [], tag: '课程体系', hot: false, school: '不限学校' },
  { id: 'p5', title: '经验交流｜学校公开说明之外，还要问哪些流程问题？', body: '可以讨论候补名单、校车分配、课后活动名额、家校沟通渠道等实际做法。请写清地区、学段和年份，不把传闻写成事实；涉及“潜规则”时标注亲历、转述或待核实。', author: '北岸', time: '示例内容', likes: 0, comments: [], tag: '潜规则观察', hot: false, school: '不限学校' },
]

const navItems = [
  { label: '总览', icon: LayoutGrid, key: 'overview' },
  { label: '学校百科', icon: BookOpen, key: 'wiki' },
  { label: '论坛广场', icon: MessageCircle, key: 'forum' },
  { label: '收藏清单', icon: Bookmark, key: 'saved' },
]
const categories = ['全部', '择校经验', '入学政策', '潜规则观察', '社区规范', '课程体系']

function readLocal(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback }
}

function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true } catch { return false }
}

function privacyError(value) {
  const text = String(value || '')
  if (/(?:\+?86[- ]?)?1[3-9]\d{9}/.test(text) || /(?:微信|wechat|vx|qq号)\s*[:：]?\s*[a-z\d_-]{5,}/i.test(text) || /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text)) {
    return '内容中可能包含手机号、社交账号或邮箱，请删除后再发。'
  }
  if (/(?<!各位|所有|任课|老师们)[\u4e00-\u9fa5]{2,4}\s*老师/.test(text)) {
    return '请只写“姓氏＋老师”或化名，避免写出老师全名。'
  }
  if (/(?:学生|孩子|子女).{0,12}(?:[一二三四五六七八九十\d]+年级|[一二三四五六七八九十\d]+班)/.test(text)) {
    return '请删去学生班级、年级等可定位身份的线索。'
  }
  return ''
}

function App() {
  const [active, setActive] = useState('overview')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(() => readLocal('school-index-saved', []))
  const [liked, setLiked] = useState(() => readLocal('school-index-liked', []))
  const [posts, setPosts] = useState(() => readLocal('school-index-posts', initialPosts))
  const [filter, setFilter] = useState('全部')
  const [sort, setSort] = useState('recent')
  const [modal, setModal] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [draftSaved, setDraftSaved] = useState(false)
  const [storageAvailable, setStorageAvailable] = useState(true)

  useEffect(() => {
    const results = [
      writeLocal('school-index-saved', saved),
      writeLocal('school-index-liked', liked),
      writeLocal('school-index-posts', posts),
    ]
    setStorageAvailable(results.every(Boolean))
  }, [saved, liked, posts])

  const filteredSchools = useMemo(() => schools.filter(s => !query || [s.name, s.short, s.city, s.curriculum].join(' ').toLowerCase().includes(query.toLowerCase())), [query])
  const filteredPosts = useMemo(() => posts.filter(p => (!query || [p.title, p.body, p.tag, p.school].join(' ').toLowerCase().includes(query.toLowerCase())) && (filter === '全部' || p.tag === filter)).sort((a, b) => sort === 'popular' ? b.likes - a.likes : 0), [posts, query, filter, sort])
  const toggleSave = name => setSaved(v => v.includes(name) ? v.filter(x => x !== name) : [...v, name])
  const toggleLike = id => setLiked(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id])
  const goTo = page => { setActive(page); setSelectedSchool(null); setMobileNav(false) }

  function submitPost(post) {
    const next = { ...post, id: `p-${Date.now()}`, time: '刚刚', likes: 0, comments: [], hot: false }
    setPosts(v => [next, ...v])
    setDraftSaved(true)
  }

  function submitReply(postId, replyData) {
    const comment = { id: `c-${Date.now()}`, author: '匿名用户', body: replyData.body, time: '刚刚' }
    setPosts(v => v.map(post => post.id === postId ? { ...post, comments: [...(Array.isArray(post.comments) ? post.comments : []), comment] } : post))
    setSelectedPost(v => v ? { ...v, comments: [...(Array.isArray(v.comments) ? v.comments : []), comment] } : v)
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}>
      <div className="brand-lockup"><div className="brand-mark"><span/><span/><span/></div><div><div className="brand-name">校见</div><div className="brand-sub">SCHOOL INDEX & COMMUNITY</div></div></div>
      <button className="close-mobile" onClick={() => setMobileNav(false)} aria-label="关闭导航"><X size={18}/></button>
      <div className="sidebar-label">探索</div><nav className="nav-list">{navItems.map(({ label, icon: Icon, key }) => <button key={key} className={`nav-item ${active === key && !selectedSchool ? 'active' : ''}`} onClick={() => goTo(key)}><Icon size={18}/><span>{label}</span>{key === 'forum' && <span className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-divider"/><div className="sidebar-label">按城市浏览</div><div className="city-list">{['上海', '北京', '深圳', '杭州'].map((city, i) => <button key={city} onClick={() => { setQuery(city); goTo('wiki') }}><span className={`city-pip pip-${i}`}/>{city}<span className="city-count">浏览</span></button>)}</div>
      <div className="sidebar-bottom"><div className="privacy-card"><ShieldCheck size={17}/><div><strong>讨论有边界</strong><p>老师称呼只写姓氏或化名</p></div></div><div className="profile-row"><div className="avatar">访</div><div className="profile-copy"><strong>访客模式</strong><span>{storageAvailable ? '内容仅保存在本机' : '无法保存，关闭后会丢失'}</span></div><ChevronDown size={16}/></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="打开导航"><Menu size={22}/></button><div className="crumb"><span>校见</span><ChevronRight size={14}/><strong>{selectedSchool ? '学校资料' : navItems.find(n => n.key === active)?.label}</strong></div><div className="top-actions"><span className="demo-pill">{storageAvailable ? '演示版 · 本地保存' : '无法保存，关闭后会丢失'}</span><button className="avatar small" aria-label="访客">访</button></div></header>
      {selectedSchool ? <SchoolDetail school={selectedSchool} onBack={() => setSelectedSchool(null)} saved={saved.includes(selectedSchool.name)} onSave={() => toggleSave(selectedSchool.name)} onShare={() => setModal(true)} /> : <>
        {active === 'overview' && <Overview query={query} setQuery={setQuery} setActive={goTo} filteredSchools={filteredSchools} filteredPosts={filteredPosts} saved={saved} toggleSave={toggleSave} liked={liked} toggleLike={toggleLike} openSchool={setSelectedSchool} openPost={post => setSelectedPost(post)} setModal={setModal}/>}
        {active === 'wiki' && <WikiView query={query} setQuery={setQuery} filteredSchools={filteredSchools} saved={saved} toggleSave={toggleSave} openSchool={setSelectedSchool}/>}
        {active === 'forum' && <ForumView query={query} setQuery={setQuery} filteredPosts={filteredPosts} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} liked={liked} toggleLike={toggleLike} openPost={post => setSelectedPost(post)} setModal={setModal}/>}
        {active === 'saved' && <SavedView saved={saved} toggleSave={toggleSave} openSchool={setSelectedSchool}/>}
      </>}
    </main>
    {modal && <ComposeModal onClose={() => { setModal(false); setDraftSaved(false) }} onSubmit={submitPost} draftSaved={draftSaved}/>}
    {selectedPost && <PostDetailModal post={posts.find(p => p.id === selectedPost.id) || selectedPost} onClose={() => setSelectedPost(null)} onReply={submitReply}/>}
  </div>
}

function Overview({ query, setQuery, setActive, filteredSchools, filteredPosts, saved, toggleSave, liked, toggleLike, openSchool, openPost, setModal }) {
  return <div className="page-wrap">
    <section className="hero-block"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> 国际学校资料与经验</div><h1>选校之前，<br/><em>先看真实。</em></h1><p>从学校公开资料，到家长和学生的一手经验。一起补充信息，也一起分清事实、经历和传闻。</p><div className="search-bar large"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索学校、课程或城市"/><kbd>⌘ K</kbd></div><div className="hero-links"><button onClick={() => setActive('wiki')}>浏览学校百科 <ArrowUpRight size={15}/></button><button onClick={() => setActive('forum')}>进入讨论广场 <ArrowUpRight size={15}/></button></div></div><div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-stamp"><Globe2 size={22}/><span>FIELD<br/>NOTES</span></div><div className="hero-stat stat-top"><strong>WIKI</strong><span>学校资料 · 持续核验</span></div><div className="hero-stat stat-bottom"><strong>VOICE</strong><span>经验交流 · 匿名参与</span></div><div className="hero-compass"><Compass size={84} strokeWidth={1}/><div className="compass-dot"/></div></div></section>
    <section className="section-block stats-row"><div className="stat-cell"><span>学校资料</span><strong>{filteredSchools.length} <small>条示例记录</small></strong></div><div className="stat-cell"><span>公开讨论</span><strong>{filteredPosts.length} <small>个当前话题</small></strong></div><div className="stat-cell"><span>你的收藏</span><strong>{saved.length} <small>所学校</small></strong></div><div className="stat-note"><Info size={16}/><span>演示内容用于展示界面<br/>上线前需核实并补充来源</span></div></section>
    <section className="section-block"><div className="section-head"><div><div className="section-kicker">SCHOOL INDEX</div><h2>学校百科 · 示例条目</h2></div><button className="text-link" onClick={() => setActive('wiki')}>浏览学校 <ArrowUpRight size={15}/></button></div><div className="school-grid">{filteredSchools.slice(0, 3).map(s => <SchoolCard key={s.name} school={s} saved={saved.includes(s.name)} onSave={() => toggleSave(s.name)} onOpen={() => openSchool(s)}/>)}</div></section>
    <section className="section-block forum-preview"><div className="section-head"><div><div className="section-kicker">COMMUNITY VOICES / SAMPLE TOPICS</div><h2>最近的经验交流</h2></div><button className="text-link" onClick={() => setActive('forum')}>进入论坛 <ArrowUpRight size={15}/></button></div><div className="post-list">{filteredPosts.slice(0, 3).map(p => <PostRow key={p.id} post={p} liked={liked.includes(p.id)} onLike={() => toggleLike(p.id)} onOpen={() => openPost(p)}/>)}</div></section>
    <section className="rule-banner"><div className="rule-icon"><ShieldCheck size={21}/></div><div><strong>讨论可以直接，身份信息要克制</strong><p>称呼老师只写“姓氏＋老师”，或用化名；若仍可识别，请进一步模糊。分享潜规则时标明亲历、转述或待核实，聚焦流程，不公开个人隐私。</p></div><button onClick={() => setModal(true)}>发起讨论 <Plus size={16}/></button></section>
  </div>
}

function SchoolCard({ school, saved, onSave, onOpen }) {
  return <article className={`school-card ${school.tone}`}><button className="school-card-open" onClick={onOpen} aria-label={`查看${school.name}资料`}><div className="school-visual"><div className="visual-label">{school.short}</div><div className="visual-grid"/><div className="visual-pin"><MapPin size={15}/></div><span className="source-chip">待核验</span></div></button><div className="school-info"><div className="school-meta"><span>{school.city}</span><span>资料条目</span></div><button className="school-name-button" onClick={onOpen}><h3>{school.name}</h3></button><div className="school-details"><span>{school.curriculum}</span><i/><span>{school.stage}</span></div><div className="tag-row">{school.tags.map(t => <span key={t}>{t}</span>)}</div><div className="review-count"><button onClick={onOpen}>查看资料来源 <ArrowUpRight size={13}/></button><button className={`save-btn inline ${saved ? 'saved' : ''}`} onClick={onSave} aria-label={saved ? '取消收藏' : '收藏学校'}>{saved ? <Check size={14}/> : <Bookmark size={14}/>}</button></div></div></article>
}

function PostRow({ post, liked, onLike, onOpen }) { const replyCount = Array.isArray(post.comments) ? post.comments.length : Number(post.comments) || 0; return <article className="post-row"><div className={`post-badge ${post.hot ? 'hot' : ''}`}>{post.hot ? <Flame size={16}/> : <MessageCircle size={16}/>}</div><div className="post-main"><div className="post-title-line"><button className="post-open" onClick={onOpen}><h3>{post.title}</h3></button><span className="post-tag">{post.tag}</span></div><button className="post-excerpt" onClick={onOpen}>{post.body}</button><div className="post-foot"><span className="author"><span className="mini-avatar">{post.author.slice(0,1)}</span>{post.author}</span><span>{post.time}</span><span className="engagement"><button className={liked ? 'liked' : ''} onClick={onLike} aria-label="点赞"><Heart size={14} fill={liked ? 'currentColor' : 'none'}/> {post.likes + (liked ? 1 : 0)}</button><button className="reply-link" onClick={onOpen}><MessageCircle size={14}/> 回复 {replyCount || ''}</button></span></div></div><ArrowUpRight className="row-arrow" size={18}/></article> }

function WikiView({ query, setQuery, filteredSchools, saved, toggleSave, openSchool }) {
  const [city, setCity] = useState('全部城市')
  const [curriculum, setCurriculum] = useState('全部课程')
  const list = filteredSchools.filter(s => (city === '全部城市' || s.city.startsWith(city)) && (curriculum === '全部课程' || s.curriculum === curriculum))
  return <div className="page-wrap inner-page"><div className="inner-heading"><div><div className="section-kicker">SCHOOL INDEX / SAMPLE ENTRIES</div><h1>学校百科</h1><p>查看课程、学段和公开来源；社区经验单独标注，不替代官方信息。</p></div><button className="primary-btn" onClick={() => document.getElementById('source-note')?.scrollIntoView({ behavior: 'smooth' })}><Plus size={16}/> 提交资料线索</button></div><div className="toolbar"><div className="search-bar"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索学校、城市、课程"/></div><label className="select-filter"><SlidersHorizontal size={16}/><select value={city} onChange={e => setCity(e.target.value)} aria-label="按城市筛选"><option>全部城市</option>{['上海','北京','深圳','杭州'].map(c => <option key={c}>{c}</option>)}</select></label><label className="select-filter"><Filter size={16}/><select value={curriculum} onChange={e => setCurriculum(e.target.value)} aria-label="按课程筛选"><option>全部课程</option>{['IB课程','英式课程','美式课程'].map(c => <option key={c}>{c}</option>)}</select></label></div><div className="result-count">显示 {list.length} 条示例记录 <span>· 资料状态以详情页为准</span></div>{list.length ? <div className="school-grid wide">{list.map(s => <SchoolCard key={s.name} school={s} saved={saved.includes(s.name)} onSave={() => toggleSave(s.name)} onOpen={() => openSchool(s)}/>)}</div> : <EmptyState title="没有匹配的学校" text="换一个筛选条件或搜索词试试。"/>}<div id="source-note" className="source-submit-note"><Info size={17}/><div><strong>资料提交建议</strong><p>请提供学校官网或主管部门公开页面、对应学年和资料发布日期。未经核实的口碑请发到论坛，并标注为亲历、转述或待核实。</p></div></div></div>
}

function SchoolDetail({ school, onBack, saved, onSave, onShare }) {
  return <div className="page-wrap inner-page"><button className="back-link" onClick={onBack}>← 返回学校列表</button><div className="detail-hero"><div><div className="section-kicker">SCHOOL PROFILE / SAMPLE</div><h1>{school.name}</h1><p>{school.city} · {school.curriculum} · {school.stage}</p></div><button className={`primary-btn ${saved ? 'saved-primary' : ''}`} onClick={onSave}>{saved ? <Check size={16}/> : <Bookmark size={16}/>} {saved ? '已收藏' : '收藏学校'}</button></div><div className="detail-grid"><section className="detail-panel"><div className="panel-title"><BookOpen size={17}/> 学校资料</div><ul className="fact-list">{school.facts.map((f, i) => <li key={i}>{f}</li>)}</ul><div className="source-status"><Info size={16}/><div><strong>来源与核验状态</strong><p>{school.source}</p><small>{school.updated}</small></div></div></section><aside className="detail-panel community-panel"><div className="panel-title"><MessageCircle size={17}/> 社区经验</div><p>这里用于补充家长与学生的具体体验。请写清学段和年份，并区分亲历、转述与待核实信息。</p><button className="primary-btn" onClick={onShare}><PenLine size={15}/> 分享相关经验</button></aside></div><div className="rule-banner"><div className="rule-icon"><ShieldCheck size={21}/></div><div><strong>保护个人身份</strong><p>可使用姓氏加“老师”，但如仍能识别具体个人，请改用化名并删去班级、学科组合等线索。</p></div></div></div>
}

function ForumView({ query, setQuery, filteredPosts, filter, setFilter, sort, setSort, liked, toggleLike, openPost, setModal }) {
  return <div className="page-wrap inner-page"><div className="inner-heading forum-heading"><div><div className="section-kicker">COMMUNITY VOICES / ANONYMOUS BY DEFAULT</div><h1>论坛广场</h1><p>可以谈不成文的流程和经验；请区分事实、亲历、转述与猜测。</p></div><button className="primary-btn" onClick={() => setModal(true)}><PenLine size={16}/> 发起讨论</button></div><div className="forum-layout"><div className="forum-main"><div className="forum-toolbar"><div className="search-bar"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索讨论"/></div><div className="filter-tabs">{categories.map(f => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div><label className="sort-select">排序<select value={sort} onChange={e => setSort(e.target.value)}><option value="recent">最新发布</option><option value="popular">点赞较多</option></select></label></div><div className="forum-feed">{filteredPosts.map(p => <PostRow key={p.id} post={p} liked={liked.includes(p.id)} onLike={() => toggleLike(p.id)} onOpen={() => openPost(p)}/>)}{filteredPosts.length === 0 && <EmptyState title="还没有找到相关讨论" text="换个关键词，或发起一个新话题。"/>}</div></div><aside className="forum-side"><div className="side-card highlight"><div className="side-card-label"><Flame size={15}/> 讨论热度较高</div><ol><li><span>老师如何匿名称呼</span><b>社区规范</b></li><li><span>学校费用怎么问清楚</span><b>择校经验</b></li><li><span>候补与名额流程交流</span><b>入学政策</b></li></ol></div><div className="side-card"><div className="side-card-label"><ShieldCheck size={15}/> “潜规则”怎么谈</div><p>讨论可能存在的不成文流程时，标明亲历或转述、发生年份和适用范围。没有证据的内容请标注“待核实”；不发布可识别个人的信息或未经证实的个人指控。</p><button className="side-link" onClick={() => setModal(true)}>按规则发起讨论 <ArrowUpRight size={14}/></button></div></aside></div></div>
}

function SavedView({ saved, toggleSave, openSchool }) {
  const list = schools.filter(s => saved.includes(s.name))
  return <div className="page-wrap inner-page"><div className="inner-heading"><div><div className="section-kicker">YOUR SHORTLIST / {list.length} SAVED</div><h1>收藏清单</h1><p>收藏保存在当前浏览器，方便继续查看学校资料。</p></div></div>{list.length ? <div className="school-grid wide">{list.map(s => <SchoolCard key={s.name} school={s} saved onSave={() => toggleSave(s.name)} onOpen={() => openSchool(s)}/>)}</div> : <EmptyState title="还没有收藏学校" text="在学校资料卡片上点击书签，建立你的比较清单。" icon={<Bookmark size={25}/>}/>}</div>
}

function EmptyState({ title, text, icon = <Search size={22}/> }) { return <div className="empty-state">{icon}<strong>{title}</strong><span>{text}</span></div> }

function PostDetailModal({ post, onClose, onReply }) {
  const [reply, setReply] = useState('')
  const [experience, setExperience] = useState('亲历')
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [error, setError] = useState('')
  const comments = Array.isArray(post.comments) ? post.comments : []
  function submit(e) {
    e.preventDefault()
    if (!reply.trim()) { setError('请先写下回复。'); return }
    if (!privacyChecked) { setError('请先确认回复不含可识别个人身份的信息。'); return }
    const issue = privacyError(reply)
    if (issue) { setError(issue); return }
    onReply(post.id, { body: `【${experience}】${reply.trim()}` })
    setReply('')
    setError('')
    setPrivacyChecked(false)
  }
  return <div className="modal-backdrop" onClick={onClose}><div className="post-detail-modal" onClick={e => e.stopPropagation()}><div className="modal-head"><div><div className="section-kicker">DISCUSSION / {post.tag}</div><h2>{post.title}</h2></div><button className="icon-btn" onClick={onClose} aria-label="关闭"><X size={18}/></button></div><div className="detail-post-meta"><span className="mini-avatar">{post.author.slice(0,1)}</span><span>{post.author}</span><span>{post.time}</span><span className="post-tag">{post.tag}</span></div><p className="detail-post-body">{post.body}</p><div className="reply-list">{comments.length ? comments.map(c => <div className="reply-item" key={c.id}><span className="mini-avatar">匿</span><div><strong>{c.author}</strong><small>{c.time}</small><p>{c.body}</p></div></div>) : <div className="reply-empty">还没有回复。分享你的亲历、转述或待核实信息时，请写清范围并保护身份。</div>}</div><form className="reply-form" onSubmit={submit}><div className="reply-input-row"><input value={reply} onChange={e => { setReply(e.target.value); setError('') }} maxLength={500} placeholder="写一条回复（默认匿名）"/><button type="submit" className="primary-btn"><Send size={14}/> 回复</button></div><div className="reply-options"><label>信息来源<select value={experience} onChange={e => setExperience(e.target.value)}><option>亲历</option><option>转述</option><option>待核实</option></select></label><label className="privacy-check"><input type="checkbox" checked={privacyChecked} onChange={e => { setPrivacyChecked(e.target.checked); setError('') }}/><span>我已删去老师全名、联系方式和学生身份线索。</span></label></div>{error && <div className="form-error" role="alert">{error}</div>}</form></div></div>
}

function ComposeModal({ onClose, onSubmit, draftSaved }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState('匿名家长')
  const [tag, setTag] = useState('择校经验')
  const [experience, setExperience] = useState('亲历')
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [error, setError] = useState('')
  function submit(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) { setError('请填写标题和正文。'); return }
    if (title.length > 80 || body.length > 1200) { setError('标题最多 80 字，正文最多 1200 字。'); return }
    if (!privacyChecked) { setError('请先确认内容不含可识别个人身份的信息。'); return }
    const issue = privacyError(`${title} ${body}`)
    if (issue) { setError(issue); return }
    onSubmit({ title: title.trim(), body: `【${experience}】${body.trim()}`, author: author.trim() || '匿名用户', tag, school: '不限学校' })
  }
  return <div className="modal-backdrop" onClick={onClose}><form className="compose-modal" onSubmit={submit} onClick={e => e.stopPropagation()}>{draftSaved ? <div className="sent-state"><div className="sent-icon"><Check size={25}/></div><h2>讨论已添加</h2><p>本地演示内容仅保存在当前浏览器，没有发布到网络。</p><button type="button" className="primary-btn" onClick={onClose}>返回论坛</button></div> : <><div className="modal-head"><div><div className="section-kicker">NEW DISCUSSION</div><h2>分享一段真实经验</h2></div><button type="button" className="icon-btn" onClick={onClose} aria-label="关闭"><X size={18}/></button></div><div className="form-grid"><label>讨论分类<select value={tag} onChange={e => setTag(e.target.value)}>{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select></label><label>信息来源<select value={experience} onChange={e => setExperience(e.target.value)}><option>亲历</option><option>转述</option><option>待核实</option></select></label></div><label>标题<input value={title} onChange={e => setTitle(e.target.value)} maxLength={80} placeholder="例如：报名时有哪些公开说明之外的流程？"/></label><label>正文<textarea value={body} onChange={e => setBody(e.target.value)} maxLength={1200} rows="5" placeholder="写清学校或地区、学段、年份。老师请称“姓氏＋老师”，若仍能识别，请用化名；讨论潜规则时区分亲历、转述和待核实。不要写全名、联系方式、班级等身份线索。"/></label><label>显示昵称<input value={author} onChange={e => setAuthor(e.target.value)} maxLength={20} placeholder="匿名家长"/></label><div className="notice"><ShieldCheck size={16}/><span>请勿发布老师全名、手机号、微信号、学生班级，或未经证实的个人指控。内容会保存在本机浏览器。</span></div><label className="privacy-check"><input type="checkbox" checked={privacyChecked} onChange={e => setPrivacyChecked(e.target.checked)}/><span>我已检查身份线索：涉及老师时只用姓氏称呼；如组合仍可识别，已改用化名并模糊细节。</span></label>{error && <div className="form-error" role="alert">{error}</div>}<div className="modal-actions"><button type="button" className="ghost-btn" onClick={onClose}>取消</button><button type="submit" className="primary-btn"><Send size={15}/> 发布讨论</button></div></>}</form></div>
}

createRoot(document.getElementById('root')).render(<App/>)
