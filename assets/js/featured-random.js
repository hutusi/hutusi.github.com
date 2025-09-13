(function () {
  function getJSON(id) {
    const el = document.getElementById(id);
    if (!el) return [];
    try { return JSON.parse(el.textContent || '[]'); } catch { return []; }
  }

  // Fisher–Yates 局部洗牌，取前 n
  function pickN(arr, n) {
    if (!Array.isArray(arr)) return [];
    if (arr.length <= n) return arr.slice();
    for (let i = 0; i < n; i++) {
      const j = i + Math.floor(Math.random() * (arr.length - i));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, n);
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function authorThumbHTML(a) {
    if (!a) return '';
    if (a.avatar && a.avatar.trim()) {
      return `<img class="author-thumb" src="${esc(a.avatar)}" alt="${esc(a.display_name || '')}">`;
    }
    if (a.gravatar && a.gravatar.trim()) {
      return `<img class="author-thumb" src="https://www.gravatar.com/avatar/${esc(a.gravatar)}?s=250&d=mm&r=x" alt="${esc(a.display_name || '')}">`;
    }
    return '';
  }

  function ratingHTML() {
    // 如需动态星级，可在 JSON 中传具体星数并在这里渲染 SVG。
    return `
      <div class="mb-2 mt-2 font-weight-normal">
        <span class="badge">精选</span>
      </div>
    `;
  }

  function imageHTML(p, lazyFlag) {
    if (!p.image) return '';
    // 保持一致的 class / 属性
    if (String(lazyFlag).toLowerCase() === 'enabled') {
      return `
        <img class="featured-box-img-cover lazyimg"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII="
             data-src="${esc(p.image)}" alt="${esc(p.title)}">
      `;
    }
    return `<img class="featured-box-img-cover" src="${esc(p.image)}" alt="${esc(p.title)}">`;
  }

  function cardHTML(p, lazyFlag) {
    // 与 featuredbox.html 结构 & class 完全一致
    const ratingBlock = p.rating ? ratingHTML() : '';
    const authorThumb = authorThumbHTML(p.author);
    const authorName = (p.author && p.author.display_name) ? esc(p.author.display_name) : '';
    const authorWeb = (p.author && p.author.web) ? esc(p.author.web) : '';
    const authorNameHTML = authorName
      ? (authorWeb ? `<span class="post-name"><a target="_blank" href="${authorWeb}">${authorName}</a></span><br/>`
                   : `<span class="post-name">${authorName}</span><br/>`)
      : '';
    const img = imageHTML(p, lazyFlag);

    return `
<!-- begin post -->
<div class="col-md-6 mb-30px">
  <div class="listfeaturedtag h-100">
    <div class="row h-100">
      <div class="col-12 col-md-12 col-lg-5 pr-lg-0">
        <div class="h-100">
          <div class="wrapthumbnail">
            <a href="${esc(p.url)}">${img}</a>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-12 col-lg-7">
        <div class="h-100 card-group">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">
                <a class="text-dark" href="${esc(p.url)}">${esc(p.title)}</a>
                ${ratingBlock}
              </h2>
              <h4 class="card-text">${esc(p.content_excerpt || '')}</h4>
            </div>
            <div class="card-footer b-0 bg-white mt-auto">
              <div class="wrapfooter">
                ${authorName ? `
                  <span class="meta-footer-thumb">${authorThumb}</span>
                  <span class="author-meta">
                    ${authorNameHTML}
                ` : ''}
                <span class="post-date">${esc(p.date_to_string || '')}</span>
                ${authorName ? `</span>` : ''}
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- end post -->
`;
  }

  function render() {
    const mount = document.getElementById('featured-random-mount');
    if (!mount) return;

    const pool = getJSON('featured-posts-data');
    if (!pool || pool.length < 3) return; // 二次保护；Liquid 层已判断

    const limit = parseInt(mount.getAttribute('data-limit') || '2', 10);
    const lazyFlag = mount.getAttribute('data-lazy') || '';

    const picks = pickN(pool.slice(), limit);
    mount.innerHTML = picks.map(p => cardHTML(p, lazyFlag)).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
