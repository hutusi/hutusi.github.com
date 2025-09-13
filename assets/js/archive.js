(function() {
  const typeNav   = document.getElementById('type-nav');
  const yearNav   = document.getElementById('year-nav');
  if (!typeNav || !yearNav) return;

  const typeLinks = Array.from(typeNav.querySelectorAll('.filter-link'));
  const yearLinks = Array.from(yearNav.querySelectorAll('.year-link'));
  const yearBlocks= Array.from(document.querySelectorAll('.year-block'));

  const countAllEl      = document.getElementById('count-all');
  const countPostEl     = document.getElementById('count-post');
  const countWeeklyEl   = document.getElementById('count-weekly');
  const countFeaturedEl = document.getElementById('count-featured');

  let selectedType = 'all'; // all | featured | post | weekly
  let selectedYear = 'all'; // all | YYYY

  // 预计算每年计数
  const countsByYear = {};
  yearBlocks.forEach(block => {
    const y = block.dataset.year;
    const items = Array.from(block.querySelectorAll('.archive-item'));
    const c = { post:0, weekly:0, featured:0, total:0 };
    items.forEach(li => {
      const t = li.dataset.type;
      if (t === 'post') c.post++;
      else if (t === 'weekly') c.weekly++;
      if (li.dataset.featured === '1') c.featured++;
      c.total++;
    });
    countsByYear[y] = c;
  });
  const totals = Object.keys(countsByYear).reduce((acc, y) => {
    acc.post     += countsByYear[y].post;
    acc.weekly   += countsByYear[y].weekly;
    acc.featured += countsByYear[y].featured;
    acc.total    += countsByYear[y].total;
    return acc;
  }, { post:0, weekly:0, featured:0, total:0 });

  // hash 解析与更新
  function parseHash() {
    const h = (location.hash || '').replace(/^#/, '');
    if (!h) return;
    const kv = {};
    h.split('&').forEach(p => { const [k,v] = p.split('='); if (k) kv[k]=v; });
    if (['all','featured','post','weekly'].includes(kv.t)) selectedType = kv.t;
    if (kv.y === 'all' || /^\d{4}$/.test(kv.y)) selectedYear = kv.y;
  }
  function updateHash() {
    const hash = `#t=${selectedType}&y=${selectedYear}`;
    if (location.hash !== hash) {
      if (history.replaceState) history.replaceState(null, '', hash);
      else location.hash = hash;
    }
  }

  function setActive(links, attr, val) {
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute(attr) === val));
  }

  // 分隔符重排
  function layoutSeparators(nav, linkSel) {
    const links = Array.from(nav.querySelectorAll(linkSel));
    links.forEach(l => {
      const prev = l.previousSibling;
      if (prev && prev.nodeType === 3) prev.textContent = '';
    });
    const visible = links.filter(l => !l.classList.contains('is-hidden'));
    visible.forEach((l, idx) => {
      if (idx === 0) return;
      l.insertAdjacentText('beforebegin', ' | ');
    });
  }

  // 更新类型计数 + 隐藏零计数
  function updateTypeCountsAndVisibility() {
    const src = (selectedYear === 'all') ? totals : (countsByYear[selectedYear] || {post:0, weekly:0, featured:0, total:0});
    countAllEl.textContent      = src.total;
    countPostEl.textContent     = src.post;
    countWeeklyEl.textContent   = src.weekly;
    countFeaturedEl.textContent = src.featured;

    const postLink     = typeNav.querySelector('.filter-link[data-filter="post"]');
    const weeklyLink   = typeNav.querySelector('.filter-link[data-filter="weekly"]');
    const featuredLink = typeNav.querySelector('.filter-link[data-filter="featured"]');

    postLink.classList.toggle('is-hidden',     src.post     === 0);
    weeklyLink.classList.toggle('is-hidden',   src.weekly   === 0);
    featuredLink.classList.toggle('is-hidden', src.featured === 0);

    // 类型回退
    const current = typeNav.querySelector(`.filter-link[data-filter="${selectedType}"]`);
    if (!current || current.classList.contains('is-hidden')) {
      if (src.featured > 0) selectedType = 'featured';
      else if (src.post > 0) selectedType = 'post';
      else if (src.weekly > 0) selectedType = 'weekly';
      else selectedType = 'all';
    }
    layoutSeparators(typeNav, '.filter-link');
  }

  // 年份链接可见性
  function updateYearLinksVisibility() {
    yearLinks.forEach(a => {
      const y = a.dataset.year;
      if (y === 'all') { a.classList.remove('is-hidden'); return; }
      const c = countsByYear[y] || {post:0, weekly:0, featured:0, total:0};
      let show = true;
      if (selectedType === 'post')     show = c.post     > 0;
      if (selectedType === 'weekly')   show = c.weekly   > 0;
      if (selectedType === 'featured') show = c.featured > 0;
      if (selectedType === 'all')      show = c.total    > 0;
      a.classList.toggle('is-hidden', !show);
    });
    const curr = yearNav.querySelector(`.year-link[data-year="${selectedYear}"]`);
    if (!curr || curr.classList.contains('is-hidden')) selectedYear = 'all';
    layoutSeparators(yearNav, '.year-link');
  }

  // 列表过滤
  function applyFiltersToList() {
    yearBlocks.forEach(block => {
      const byear = block.dataset.year;
      const yearMatch = (selectedYear === 'all') || (byear === selectedYear);
      let visibleCount = 0;
      const items = block.querySelectorAll('.archive-item');
      items.forEach(li => {
        let typeMatch = true;
        if (selectedType === 'post' || selectedType === 'weekly') {
          typeMatch = (li.dataset.type === selectedType);
        } else if (selectedType === 'featured') {
          typeMatch = (li.dataset.featured === '1');
        }
        const show = yearMatch && (selectedType === 'all' ? true : typeMatch);
        li.classList.toggle('is-hidden', !show);
        if (show) visibleCount++;
      });
      block.classList.toggle('is-hidden', visibleCount === 0);
    });
    setActive(typeLinks, 'data-filter', selectedType);
    setActive(yearLinks, 'data-year', selectedYear);
  }

  function refreshUI() {
    updateTypeCountsAndVisibility();
    updateYearLinksVisibility();
    applyFiltersToList();
    updateHash();
  }

  // 事件
  typeLinks.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    if (a.classList.contains('is-hidden')) return;
    selectedType = a.dataset.filter || 'all';
    refreshUI();
  }));
  yearLinks.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    if (a.classList.contains('is-hidden')) return;
    selectedYear = a.dataset.year || 'all';
    refreshUI();
  }));

  // 初始化
  parseHash();
  refreshUI();
  window.addEventListener('hashchange', () => { parseHash(); refreshUI(); });
})();
