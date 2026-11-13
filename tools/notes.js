// Renders the embedded Markdown, then adds heading ids, an "On this page" list,
// syntax highlighting, copy buttons, link rewriting (.md -> .html) and the mobile menu.
(function () {
  var content = document.getElementById('content');
  var srcDir = content.getAttribute('data-src-dir') || '';
  var md = document.getElementById('md').textContent.replace(/<\\\/script/gi, '</script');

  if (typeof marked === 'undefined') {
    content.innerHTML = '<p>Couldn\'t load the Markdown renderer (offline?). Read the <code>.md</code> file instead.</p>';
    return;
  }
  marked.setOptions({ gfm: true });
  content.innerHTML = marked.parse(md);

  // ---- heading ids, GitHub style, so #anchors in the notes keep working ----
  var used = {};
  function slug(t) {
    var s = t.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    if (used[s] === undefined) { used[s] = 0; return s; }
    used[s] += 1; return s + '-' + used[s];
  }
  content.querySelectorAll('h1, h2, h3, h4').forEach(function (h) { h.id = slug(h.textContent); });

  // ---- "On this page" from h2 ----
  var onpage = document.getElementById('onpage');
  content.querySelectorAll('h2').forEach(function (h) {
    var a = document.createElement('a');
    a.href = '#' + h.id; a.textContent = h.textContent;
    onpage.appendChild(a);
  });

  // ---- rewrite repo-relative links for the docs/ folder ----
  function norm(path) {
    var out = [];
    path.split('/').forEach(function (p) {
      if (p === '..') out.pop(); else if (p && p !== '.') out.push(p);
    });
    return out.join('/');
  }
  content.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (/^([a-z]+:|#|\/)/i.test(href)) return;               // absolute, anchor-only or root links
    var hash = '', i = href.indexOf('#');
    if (i >= 0) { hash = href.slice(i); href = href.slice(0, i); }
    var repoPath = norm((srcDir ? srcDir + '/' : '') + href);   // path from the repo root
    var target;
    if (repoPath === 'README.md') target = 'index.html';
    else if (repoPath === 'KEY-POINTS.md') target = 'key-points.html';
    else if (/^notes\/[^/]+\.md$/.test(repoPath)) target = repoPath.slice(6).replace(/\.md$/, '.html');
    else if (repoPath.indexOf('docs/') === 0) target = repoPath.slice(5);
    else target = '../' + repoPath;                              // labs/, tools/ … live next to docs/
    a.setAttribute('href', target + hash);
  });

  // ---- code blocks: highlight + copy button ----
  content.querySelectorAll('pre > code').forEach(function (code) {
    var pre = code.parentNode;
    var lang = (code.className.match(/language-(\w+)/) || [])[1] || '';
    var box = document.createElement('div');
    box.className = 'code';
    var head = document.createElement('div');
    head.className = 'code-head';
    head.innerHTML = '<span class="lang">' + (lang || 'text') + '</span>';
    var btn = document.createElement('button');
    btn.className = 'copy'; btn.type = 'button'; btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var ok = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); };
      try { navigator.clipboard.writeText(code.textContent).then(ok, function () {}); } catch (e) {}
    });
    head.appendChild(btn);
    pre.parentNode.insertBefore(box, pre);
    box.appendChild(head); box.appendChild(pre);
  });
  if (typeof Prism !== 'undefined') Prism.highlightAllUnder(content);

  // ---- wide tables scroll instead of breaking the layout ----
  content.querySelectorAll('table').forEach(function (t) {
    var w = document.createElement('div');
    w.className = 'table-wrap';
    t.parentNode.insertBefore(w, t); w.appendChild(t);
  });

  // ---- jump to the #anchor now that ids exist ----
  if (location.hash) {
    var el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el) el.scrollIntoView();
  }

  // ---- print + mobile menu ----
  document.getElementById('printBtn').addEventListener('click', function () {
    content.querySelectorAll('details').forEach(function (d) { d.open = true; });
    window.print();
  });
  var toggle = document.getElementById('tocToggle'), scrim = document.getElementById('scrim');
  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
  }
  toggle.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
  scrim.addEventListener('click', function () { setNav(false); });
  document.querySelectorAll('.toc a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
})();
