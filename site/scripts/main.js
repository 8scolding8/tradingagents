// 原生 JS，无依赖。负责：导航折叠、研报渲染、错误兜底。
(function () {
  'use strict';

  // 1. 移动端导航折叠
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. 渲染研报
  var list = document.getElementById('projects-list');
  if (!list) return;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function renderReports(reports) {
    if (!Array.isArray(reports) || reports.length === 0) {
      list.innerHTML = '<p class="projects__loading">暂无研报数据。</p>';
      return;
    }
    list.innerHTML = reports.map(function (r) {
      var dataChips = '';
      if (r.key_data && typeof r.key_data === 'object') {
        dataChips = Object.keys(r.key_data).map(function (k) {
          return '<div><strong>' + escapeHtml(k) + '</strong>：' + escapeHtml(r.key_data[k]) + '</div>';
        }).join('');
      }
      var points = Array.isArray(r.key_points) ? r.key_points : [];
      return [
        '<article class="project-card">',
          '<header class="project-card__head">',
            '<h3 class="project-card__title">' + escapeHtml(r.title || '(未命名研报)') + '</h3>',
            '<span class="project-card__date">' + escapeHtml(r.date || '—') + '</span>',
          '</header>',
          '<p class="project-card__source">来源：' + escapeHtml(r.source || 'IMA 121 知识库') + '</p>',
          '<p class="project-card__summary">' + escapeHtml(r.summary || '') + '</p>',
          '<details class="project-card__details">',
            '<summary>查看核心观点 / 关键数据 / 结论</summary>',
            points.length ? '<ul class="project-card__points">' + points.map(function (p) {
              return '<li>' + escapeHtml(p) + '</li>';
            }).join('') + '</ul>' : '',
            dataChips ? '<div class="project-card__data">' + dataChips + '</div>' : '',
            r.conclusion ? '<p class="project-card__conclusion">结论：' + escapeHtml(r.conclusion) + '</p>' : '',
          '</details>',
        '</article>'
      ].join('');
    }).join('');
  }

  // 3. 加载 JSON（带超时与错误兜底）
  var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  var timer = setTimeout(function () {
    if (controller) controller.abort();
    list.innerHTML = '<p class="projects__loading">研报加载超时，请稍后刷新。</p>';
  }, 8000);

  fetch('assets/data/reports.json', controller ? { signal: controller.signal } : {})
    .then(function (resp) {
      clearTimeout(timer);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.json();
    })
    .then(renderReports)
    .catch(function () {
      clearTimeout(timer);
      list.innerHTML = '<p class="projects__loading">研报暂时无法加载，请刷新或稍后再试。</p>';
    });
})();
