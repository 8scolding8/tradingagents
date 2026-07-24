// 原生 JS，无依赖。负责：移动端导航折叠、Scroll Reveal、Ticker、研报渲染（含原文/观点/逻辑/数据/图表）、分类筛选、back-to-top、stat 计数器。
(function () {
  'use strict';

  // ============================================================
  // 1) 移动端导航折叠
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

  // ============================================================
  // 2) Scroll Reveal (IntersectionObserver)
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // fallback: show everything immediately
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ============================================================
  // 3) Back to top
  var back = document.querySelector('.back-to-top');
  if (back) {
    var onScroll = function () {
      if (window.scrollY > 600) back.classList.add('is-visible');
      else back.classList.remove('is-visible');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================================
  // 4) Ticker 行情条 (渲染并复制一份以形成无缝滚动)
  var tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack) {
    var tickerItems = [
      { k: '联邦基金', v: '3.50-3.75%' },
      { k: 'CPI YoY', v: '+3.50%' },
      { k: '核心 CPI', v: '+2.60%' },
      { k: '失业率', v: '4.20%' },
      { k: '新增非农', v: '+5.7 万' },
      { k: '10Y', v: '4.67%' },
      { k: '30Y', v: '5.19%' },
      { k: 'DXY', v: '100.4' },
      { k: 'COMEX 黄金', v: '$4037' },
      { k: '席勒 PE', v: '42.32' },
      { k: '9 月加息概率', v: '38%' }
    ];
    var html = tickerItems.map(function (t) {
      return '<span class="ticker__item"><strong>' + escapeHtml(t.k) + '</strong>' + escapeHtml(t.v) + '</span>';
    }).join('');
    tickerTrack.innerHTML = html + html; // duplicate for seamless scroll
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  // ============================================================
  // 5) Stat 数字滚动（在 About 卡片进入视口时）
  var statNums = document.querySelectorAll('.card__stat-num[data-count]');
  if ('IntersectionObserver' in window && statNums.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var cur = 0;
        var step = Math.max(1, Math.ceil(target / 24));
        var t = setInterval(function () {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur;
        }, 30);
        statObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { statObserver.observe(el); });
  }

  // ============================================================
  // 6) 研报渲染
  var list = document.getElementById('projects-list');
  var filterBar = document.getElementById('projects-filter');
  if (!list) return;

  function renderChart(chart) {
    if (!chart || !Array.isArray(chart.points) || chart.points.length === 0) return '';
    var W = 540, H = 240, P = 40;
    var max = Math.max.apply(null, chart.points.map(function (p) { return p.value; }));
    var min = Math.min.apply(null, chart.points.map(function (p) { return p.value; }));
    var range = max - min || 1;
    var padTop = 20, padBottom = 56;
    var drawH = H - P - padBottom + padTop;
    var stepX = (W - P * 2) / Math.max(chart.points.length - 1, 1);

    function y(v) {
      var t = (v - min) / range;
      return H - P - t * drawH;
    }
    var i, p, n, linePath, areaPath, bars = '';

    if (chart.type === 'bar') {
      var barW = Math.max(16, Math.min(56, stepX * 0.6));
      for (i = 0; i < chart.points.length; i++) {
        p = chart.points[i];
        var bx = P + i * stepX - barW / 2;
        var by = y(p.value);
        var bh = (H - P - padBottom) - by;
        bars +=
          '<rect x="' + bx + '" y="' + by + '" width="' + barW + '" height="' + Math.max(bh, 2) +
          '" rx="4" fill="url(#chart-grad)" />' +
          '<text x="' + (P + i * stepX) + '" y="' + (by - 8) +
          '" text-anchor="middle" font-size="11" fill="#0F172A" font-weight="700">' +
          escapeHtml(p.value) + '</text>';
      }
    } else {
      linePath = '';
      areaPath = '';
      for (i = 0; i < chart.points.length; i++) {
        p = chart.points[i];
        n = (i === 0 ? 'M' : 'L') + (P + i * stepX) + ',' + y(p.value);
        linePath += n;
        areaPath += (i === 0 ? 'M' : 'L') + (P + i * stepX) + ',' + y(p.value);
      }
      areaPath += ' L' + (P + (chart.points.length - 1) * stepX) + ',' + (H - P - padBottom + padTop);
      areaPath += ' L' + P + ',' + (H - P - padBottom + padTop) + ' Z';
      bars += '<path d="' + areaPath + '" fill="url(#area-grad)" />';
      bars += '<path d="' + linePath + '" fill="none" stroke="url(#line-grad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />';
      for (i = 0; i < chart.points.length; i++) {
        p = chart.points[i];
        bars +=
          '<circle cx="' + (P + i * stepX) + '" cy="' + y(p.value) +
          '" r="5" fill="#F5B400" stroke="#0B3D91" stroke-width="2.5" />' +
          '<text x="' + (P + i * stepX) + '" y="' + (y(p.value) - 12) +
          '" text-anchor="middle" font-size="11" fill="#0F172A" font-weight="700">' +
          escapeHtml(p.value) + '</text>';
      }
    }

    var xLabels = '';
    for (i = 0; i < chart.points.length; i++) {
      xLabels += '<text x="' + (P + i * stepX) + '" y="' + (H - padBottom + 18) +
        '" text-anchor="middle" font-size="10" fill="#64748B">' +
        escapeHtml(chart.points[i].label) + '</text>';
    }

    return [
      '<figure class="chart">',
        '<figcaption class="chart__title">' + escapeHtml(chart.title || '') + '</figcaption>',
        '<svg class="chart__svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + escapeHtml(chart.title || '') + '">',
          '<defs>',
            '<linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">',
              '<stop offset="0%" stop-color="#F5B400" />',
              '<stop offset="100%" stop-color="#0B3D91" />',
            '</linearGradient>',
            '<linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">',
              '<stop offset="0%" stop-color="#0B3D91" stop-opacity="0.25" />',
              '<stop offset="100%" stop-color="#0B3D91" stop-opacity="0" />',
            '</linearGradient>',
            '<linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">',
              '<stop offset="0%" stop-color="#0B3D91" />',
              '<stop offset="100%" stop-color="#F5B400" />',
            '</linearGradient>',
          '</defs>',
          '<line x1="' + P + '" y1="' + (H - P - padBottom + padTop) + '" x2="' + (W - P) + '" y2="' + (H - P - padBottom + padTop) + '" stroke="#E2E8F0" stroke-width="1" />',
          '<text x="' + P + '" y="' + (P - 6) + '" font-size="10" fill="#94A3B8">' + escapeHtml(chart.y_label || '') + '</text>',
          bars,
          xLabels,
        '</svg>',
      '</figure>'
    ].join('');
  }

  function renderReport(r) {
    var origList = Array.isArray(r.original_text) ? r.original_text : [];
    var viewpoints = Array.isArray(r.core_viewpoints) ? r.core_viewpoints : [];
    var logic = Array.isArray(r.logic_chain) ? r.logic_chain : [];

    var dataChips = '';
    if (r.key_data && typeof r.key_data === 'object') {
      dataChips = Object.keys(r.key_data).map(function (k) {
        return '<div class="project-card__data-item"><span class="project-card__data-k">' +
          escapeHtml(k) + '</span><span class="project-card__data-v">' +
          escapeHtml(r.key_data[k]) + '</span></div>';
      }).join('');
    }

    return [
      '<article class="project-card--rich" data-category="' + escapeHtml(r.category || '其他') + '">',
        '<header class="project-card__head">',
          '<span class="project-card__category">' + escapeHtml(r.category || '研报') + '</span>',
          '<span class="project-card__date">' + escapeHtml(r.date || '—') + '</span>',
        '</header>',
        '<h3 class="project-card__title">' + escapeHtml(r.title || '(未命名研报)') + '</h3>',
        '<p class="project-card__source">来源：' + escapeHtml(r.source || 'IMA 121 知识库') + '</p>',
        '<p class="project-card__summary">' + escapeHtml(r.summary || '') + '</p>',

        origList.length ? [
          '<section class="project-card__section project-card__section--original">',
            '<h4>原文摘录</h4>',
            origList.map(function (p) { return '<p>' + escapeHtml(p) + '</p>'; }).join(''),
          '</section>'
        ].join('') : '',

        viewpoints.length ? [
          '<section class="project-card__section">',
            '<h4>核心观点</h4>',
            '<ul>' + viewpoints.map(function (v) { return '<li>' + escapeHtml(v) + '</li>'; }).join('') + '</ul>',
          '</section>'
        ].join('') : '',

        logic.length ? [
          '<section class="project-card__section project-card__section--logic">',
            '<h4>逻辑链</h4>',
            '<ol>' + logic.map(function (v) { return '<li>' + escapeHtml(v) + '</li>'; }).join('') + '</ol>',
          '</section>'
        ].join('') : '',

        (r.chart && Array.isArray(r.chart.points)) ? [
          '<section class="project-card__section project-card__section--chart">',
            '<h4>关键数据可视化</h4>',
            renderChart(r.chart),
          '</section>'
        ].join('') : '',

        dataChips ? [
          '<details class="project-card__details">',
            '<summary>关键数据 · 完整列表</summary>',
            '<div class="project-card__data-grid">' + dataChips + '</div>',
          '</details>'
        ].join('') : '',

        r.conclusion ? '<p class="project-card__conclusion"><strong>结论：</strong>' + escapeHtml(r.conclusion) + '</p>' : '',
      '</article>'
    ].join('');
  }

  function renderReports(reports) {
    if (!Array.isArray(reports) || reports.length === 0) {
      list.innerHTML = '<p class="projects__loading">暂无研报数据。</p>';
      return;
    }
    list.innerHTML = reports.map(renderReport).join('');
    applyFilter(currentFilter);
    // reveal each card as it enters view (staggered)
    if ('IntersectionObserver' in window) {
      var cardObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
      list.querySelectorAll('.project-card--rich').forEach(function (el) { cardObserver.observe(el); });
    }
  }

  // ============================================================
  // 7) 分类筛选
  var currentFilter = '全部';
  function uniqueCategories(reports) {
    var s = new Set();
    reports.forEach(function (r) { if (r.category) s.add(r.category); });
    return Array.from(s);
  }
  function applyFilter(cat) {
    currentFilter = cat;
    if (!list) return;
    var nodes = list.querySelectorAll('.project-card--rich');
    nodes.forEach(function (n) {
      var match = (cat === '全部' || n.getAttribute('data-category') === cat);
      n.style.display = match ? '' : 'none';
    });
    if (filterBar) {
      Array.from(filterBar.querySelectorAll('button')).forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-filter') === cat);
      });
    }
  }

  // ============================================================
  // 8) 加载 JSON
  var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  var timer = setTimeout(function () {
    if (controller) controller.abort();
    list.innerHTML = '<p class="projects__loading">研报加载超时，请稍后刷新。</p>';
  }, 12000);

  fetch('assets/data/reports.json', controller ? { signal: controller.signal } : {})
    .then(function (resp) {
      clearTimeout(timer);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.json();
    })
    .then(function (reports) {
      renderReports(reports);
      if (filterBar) {
        var cats = ['全部'].concat(uniqueCategories(reports));
        filterBar.innerHTML = cats.map(function (c) {
          return '<button class="filter__chip" data-filter="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>';
        }).join('');
        filterBar.querySelectorAll('button').forEach(function (b) {
          b.addEventListener('click', function () { applyFilter(b.getAttribute('data-filter')); });
        });
      }
    })
    .catch(function () {
      clearTimeout(timer);
      list.innerHTML = '<p class="projects__loading">研报暂时无法加载，请刷新或稍后再试。</p>';
    });
})();
