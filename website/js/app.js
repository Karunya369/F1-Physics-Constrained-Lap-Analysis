/**
 * Safe Mathematical Typesetting via KaTeX with Offline/CDN Fallback
 */
function renderMath(targetElement) {
  const el = targetElement || document.body;
  if (typeof renderMathInElement === 'function') {
    try {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$', right: '$', display: false }
        ],
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        throwOnError: false
      });
      return;
    } catch (err) {
      console.warn('KaTeX math typesetting encountered an issue, activating fallback:', err);
    }
  }
  // Graceful offline fallback formatter
  applyMathFallback(el);
}

function applyMathFallback(container) {
  if (!container) return;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement && !['SCRIPT', 'STYLE', 'PRE', 'CODE', 'NOSCRIPT', 'TEXTAREA'].includes(node.parentElement.tagName)) {
      if (node.nodeValue && (node.nodeValue.includes('\\(') || node.nodeValue.includes('\\['))) {
        textNodes.push(node);
      }
    }
  }

  textNodes.forEach(node => {
    let text = node.nodeValue;
    text = text.replace(/\\\(|\\\[/g, '').replace(/\\\)|\\\]/g, '');
    text = text.replace(/\\Delta\s*/g, '&Delta;');
    text = text.replace(/\\mu\s*/g, '&mu;');
    text = text.replace(/\\kappa\s*/g, '&kappa;');
    text = text.replace(/\\le\s*/g, '&le;');
    text = text.replace(/\\ge\s*/g, '&ge;');
    text = text.replace(/\\times\s*/g, '&times;');
    text = text.replace(/\\text\{([^}]+)\}/g, '$1');
    text = text.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    text = text.replace(/_([a-zA-Z0-9])/g, '<sub>$1</sub>');
    text = text.replace(/\^2/g, '<sup>2</sup>');

    const span = document.createElement('span');
    span.className = 'math-fallback';
    span.innerHTML = text;
    if (node.parentNode) {
      node.parentNode.replaceChild(span, node);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initExperimentTabs();
  initTelemetryChart();
  initWaterfallChart();
  initSensitivityControls();
  initPlotLightbox();
  initTeamSwitcher(); // default initializes Ferrari
  renderMath();
});

window.addEventListener('load', () => {
  renderMath();
});

// ==========================================================================
// 1. Navigation & ScrollSpy
// ==========================================================================
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // Smooth scroll & close mobile menu on click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (navMenu) navMenu.classList.remove('mobile-open');
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ScrollSpy
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 130;

    sections.forEach(section => {
      if (section.offsetParent === null) return; // ignore hidden sections
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

// ==========================================================================
// 2. Experiment Tabs
// ==========================================================================
let activeExpTabIdx = 0;

function initExperimentTabs() {
  const tabButtons = document.querySelectorAll('#experimentTabsNav .tab-btn');

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      activeExpTabIdx = idx;
      switchExperimentTab(idx);
    });
  });
}

function switchExperimentTab(idx) {
  const tabButtons = document.querySelectorAll('#experimentTabsNav .tab-btn');
  tabButtons.forEach((b, i) => b.classList.toggle('active', i === idx));

  // Determine active team container
  const isRbr = document.body.classList.contains('team-rbr');
  const activeContainer = isRbr
    ? document.getElementById('rbrExperimentPanes')
    : document.getElementById('ferrariExperimentPanes');

  if (!activeContainer) return;

  const panes = activeContainer.querySelectorAll('.tab-pane');
  panes.forEach((pane, i) => {
    pane.classList.toggle('active', i === idx);
  });

  // Re-render math formulas in the newly displayed pane
  renderMath(activeContainer);
}

// ==========================================================================
// 3. Telemetry Speed Profile Canvas Chart
// ==========================================================================
function initTelemetryChart() {
  const canvas = document.getElementById('telemetryCanvas');
  if (!canvas || !window.F1_RESEARCH_DATA) return;

  const ctx = canvas.getContext('2d');
  const tooltip = document.getElementById('chartTooltip');

  let showFeasible = true;
  let showDonor = true;
  let showDrs = true;

  let activeData = window.F1_RESEARCH_DATA.telemetryProfile;
  let activeTeam = 'ferrari';

  const toggleFeasibleBtn = document.getElementById('toggleFeasible');
  const toggleDonorBtn = document.getElementById('toggleDonor');
  const toggleDrsBtn = document.getElementById('toggleDrs');

  if (toggleFeasibleBtn) {
    toggleFeasibleBtn.addEventListener('click', () => {
      showFeasible = !showFeasible;
      toggleFeasibleBtn.classList.toggle('active', showFeasible);
      render();
    });
  }
  if (toggleDonorBtn) {
    toggleDonorBtn.addEventListener('click', () => {
      showDonor = !showDonor;
      toggleDonorBtn.classList.toggle('active', showDonor);
      render();
    });
  }
  if (toggleDrsBtn) {
    toggleDrsBtn.addEventListener('click', () => {
      showDrs = !showDrs;
      toggleDrsBtn.classList.toggle('active', showDrs);
      render();
    });
  }

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    render();
  }

  window.addEventListener('resize', resizeCanvas);

  const padding = { top: 30, right: 25, bottom: 50, left: 60 };
  const minSpeed = 50;
  const maxSpeed = 340;

  function render(hoverIndex = -1) {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxDist = activeData.length > 0 ? activeData[activeData.length - 1].s : 5369.0;

    // Background
    ctx.fillStyle = '#17191D';
    ctx.fillRect(0, 0, width, height);

    // Grid lines & Y-axis labels
    ctx.strokeStyle = '#272A30';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#85847F';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    for (let v = 50; v <= 350; v += 50) {
      const y = padding.top + chartH - ((v - minSpeed) / (maxSpeed - minSpeed)) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(`${v}`, padding.left - 10, y + 4);
    }

    // X-axis Distance grid & labels
    ctx.textAlign = 'center';
    for (let dist = 0; dist <= maxDist; dist += 1000) {
      const x = padding.left + (dist / maxDist) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartH);
      ctx.stroke();
      ctx.fillText(`${dist}m`, x, padding.top + chartH + 20);
    }

    // Axis titles
    ctx.save();
    ctx.translate(18, padding.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#A3A199';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Velocity (km/h)', 0, 0);
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#A3A199';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`Track Distance s (m) — Canonical Domain S = ${maxDist.toFixed(1)} m`, padding.left + chartW / 2, height - 10);

    // DRS Zones shading
    if (showDrs) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
      let inDrs = false;
      let drsStart = 0;
      activeData.forEach((pt) => {
        if (pt.drs === 1 && !inDrs) {
          inDrs = true;
          drsStart = pt.s;
        } else if (pt.drs === 0 && inDrs) {
          inDrs = false;
          const x1 = padding.left + (drsStart / maxDist) * chartW;
          const x2 = padding.left + (pt.s / maxDist) * chartW;
          ctx.fillRect(x1, padding.top, x2 - x1, chartH);
        }
      });
      if (inDrs) {
        const x1 = padding.left + (drsStart / maxDist) * chartW;
        const x2 = padding.left + chartW;
        ctx.fillRect(x1, padding.top, x2 - x1, chartH);
      }
    }

    // Theoretical Speed Line
    if (showDonor) {
      ctx.beginPath();
      ctx.strokeStyle = activeTeam === 'rbr' ? '#FFAEAA' : '#FFAEAA';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 3]);

      activeData.forEach((pt, i) => {
        const x = padding.left + (pt.s / maxDist) * chartW;
        const y = padding.top + chartH - ((pt.v_donor - minSpeed) / (maxSpeed - minSpeed)) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Feasible Speed Line
    if (showFeasible) {
      ctx.beginPath();
      ctx.strokeStyle = activeTeam === 'rbr' ? '#7AB3F0' : '#657887';
      ctx.lineWidth = 2.5;

      activeData.forEach((pt, i) => {
        const x = padding.left + (pt.s / maxDist) * chartW;
        const y = padding.top + chartH - ((pt.v_feas - minSpeed) / (maxSpeed - minSpeed)) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Hover Crosshair
    if (hoverIndex >= 0 && hoverIndex < activeData.length) {
      const pt = activeData[hoverIndex];
      const hx = padding.left + (pt.s / maxDist) * chartW;
      const hyFeas = padding.top + chartH - ((pt.v_feas - minSpeed) / (maxSpeed - minSpeed)) * chartH;
      const hyDonor = padding.top + chartH - ((pt.v_donor - minSpeed) / (maxSpeed - minSpeed)) * chartH;

      ctx.strokeStyle = '#ECEAE4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, padding.top);
      ctx.lineTo(hx, padding.top + chartH);
      ctx.stroke();

      // Feasible dot
      ctx.fillStyle = activeTeam === 'rbr' ? '#7AB3F0' : '#657887';
      ctx.beginPath();
      ctx.arc(hx, hyFeas, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Donor dot
      ctx.fillStyle = '#FFAEAA';
      ctx.beginPath();
      ctx.arc(hx, hyDonor, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function handlePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const chartW = rect.width - padding.left - padding.right;
    const maxDist = activeData.length > 0 ? activeData[activeData.length - 1].s : 5369.0;

    if (mouseX < padding.left || mouseX > rect.width - padding.right) {
      tooltip.style.display = 'none';
      render(-1);
      return;
    }

    const distRatio = (mouseX - padding.left) / chartW;
    const targetDist = distRatio * maxDist;

    let closestIdx = 0;
    let minDiff = Infinity;
    activeData.forEach((pt, i) => {
      const diff = Math.abs(pt.s - targetDist);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    });

    const pt = activeData[closestIdx];
    render(closestIdx);

    const deltaV = (pt.v_donor - pt.v_feas).toFixed(1);
    tooltip.style.display = 'block';
    tooltip.style.left = `${Math.min(clientX - rect.left + 15, rect.width - 200)}px`;
    tooltip.style.top = `${clientY - rect.top - 10}px`;

    const d1Code = activeTeam === 'rbr' ? 'VER' : 'LEC';
    const d1Label = activeTeam === 'rbr' ? 'Verstappen' : 'Leclerc';
    const d2Label = activeTeam === 'rbr' ? 'Perez' : 'Sainz';
    const d1Color = activeTeam === 'rbr' ? '#7AB3F0' : '#FFAEAA';
    const d2Color = '#FBBF24';

    tooltip.innerHTML = `
      <div style="font-weight:700; color:#F4F1EA; margin-bottom:4px;">s = ${pt.s.toFixed(0)} m</div>
      <div style="color:${activeTeam === 'rbr' ? '#7AB3F0' : '#657887'};">Feasible: <strong>${pt.v_feas.toFixed(1)} km/h</strong></div>
      <div style="color:#FFAEAA;">Theoretical: <strong>${pt.v_donor.toFixed(1)} km/h</strong></div>
      <div style="color:#A3A199;">Deficit: <span style="color:#E0564C;">-${deltaV} km/h</span></div>
      <div style="color:#A3A199;">Donor: <span style="color:${pt.driver === d1Code ? d1Color : d2Color}">${pt.driver === d1Code ? d1Label : d2Label}</span></div>
      <div style="color:#85847F; font-size:10px;">Curvature: ${pt.kappa.toFixed(5)} m⁻¹</div>
    `;
  }

  canvas.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY));
  canvas.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    render(-1);
  });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    tooltip.style.display = 'none';
    render(-1);
  });

  resizeCanvas();

  window._telemSwitchFn = (team) => {
    activeTeam = team;
    activeData = team === 'rbr'
      ? (window.RBR_RESEARCH_DATA ? window.RBR_RESEARCH_DATA.telemetryProfile : activeData)
      : window.F1_RESEARCH_DATA.telemetryProfile;
    resizeCanvas();
  };
}

// ==========================================================================
// 4. Waterfall Gap Attribution Visualization
// ==========================================================================
function initWaterfallChart() {
  const container = document.getElementById('waterfallChart');
  if (!container || !window.F1_RESEARCH_DATA) return;

  function renderWaterfall(team) {
    const src = (team === 'rbr' && window.RBR_RESEARCH_DATA)
      ? window.RBR_RESEARCH_DATA
      : window.F1_RESEARCH_DATA;
    const data = src.gapAttribution;
    const totalGap = src.overview.feasibility_gap_s;

    let html = '';
    data.forEach((item, idx) => {
      const pct = ((item.value / totalGap) * 100).toFixed(1);
      const colorClass = idx === 0 ? 'red' : idx === 1 ? 'blue' : idx === 2 ? 'green' : 'total';
      let texSymbol = item.symbol;
      if (texSymbol.includes('T_')) {
        const sub = texSymbol.split('T_')[1];
        texSymbol = `\\Delta T_{\\text{${sub}}}`;
      }
      html += `
        <div class="waterfall-item">
          <div class="waterfall-header">
            <span><strong>\\(${texSymbol}\\):</strong> ${item.name}</span>
            <span class="mono"><strong>+${item.value.toFixed(3)} s</strong> (${pct}%)</span>
          </div>
          <div class="waterfall-bar-track">
            <div class="waterfall-bar-fill ${colorClass}" style="width: ${Math.max(parseFloat(pct), 2)}%;">
              ${item.value > 0 ? `+${item.value.toFixed(3)}s` : '0.000s'}
            </div>
          </div>
          <div style="font-size:0.75rem; color:#85847F; line-height:1.35;">${item.desc}</div>
        </div>
      `;
    });

    html += `
      <div class="waterfall-item" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--color-border-dark);">
        <div class="waterfall-header">
          <span><strong>Total Feasibility Gap:</strong> \\(\\Delta T_{\\text{gap}} = T_{\\text{feas}} - T_{\\text{theo}}\\)</span>
          <span class="mono" style="color:var(--color-accent-red); font-size:1rem;"><strong>+${totalGap.toFixed(3)} s</strong> (100.0%)</span>
        </div>
        <div class="waterfall-bar-track">
          <div class="waterfall-bar-fill total" style="width: 100%;">
            +${totalGap.toFixed(3)} s
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    renderMath(container);
  }

  renderWaterfall('ferrari');
  window._waterfallSwitchFn = renderWaterfall;
}

// ==========================================================================
// 5. Sensitivity Controls (50m, 100m, 250m)
// ==========================================================================
function initSensitivityControls() {
  const buttons = document.querySelectorAll('.res-btn');
  const detailsContainer = document.getElementById('resolutionDetails');
  if (!detailsContainer || !window.F1_RESEARCH_DATA) return;

  let activeSensitivity = window.F1_RESEARCH_DATA.sensitivity;
  let activeTeamCtx = 'ferrari';
  let currentRes = '100m';

  function updateResolution(res) {
    currentRes = res;
    const item = activeSensitivity.find(s => s.res === res);
    if (!item) return;

    const leaderLabel = activeTeamCtx === 'rbr' ? 'VER' : 'LEC';
    const d1Label = activeTeamCtx === 'rbr' ? 'Verstappen' : 'Leclerc';
    const d2Label = activeTeamCtx === 'rbr' ? 'Perez' : 'Sainz';
    const d1Key = activeTeamCtx === 'rbr' ? 'ver_dist_pct' : 'lec_dist_pct';
    const d2Key = activeTeamCtx === 'rbr' ? 'per_dist_pct' : 'sai_dist_pct';
    const refTime = activeTeamCtx === 'rbr'
      ? (window.RBR_RESEARCH_DATA ? window.RBR_RESEARCH_DATA.overview.t_ver_observed_s : 89.59)
      : window.F1_RESEARCH_DATA.overview.t_lec_observed_s;
    const gainVsLeader = (refTime - item.t_theo).toFixed(3);

    detailsContainer.innerHTML = `
      <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
        <div class="card" style="padding:1.25rem;">
          <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--color-text-secondary); text-transform:uppercase;">Discretization</div>
          <div style="font-size:1.6rem; font-weight:700; margin:4px 0;">${item.res}</div>
          <div style="font-size:0.8rem; color:var(--color-text-secondary);">${item.segments} Segments</div>
        </div>
        <div class="card" style="padding:1.25rem;">
          <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--color-text-secondary); text-transform:uppercase;">Theoretical Lap</div>
          <div style="font-size:1.6rem; font-weight:700; margin:4px 0; color:var(--color-text-main);">${item.t_theo.toFixed(3)} s</div>
          <div style="font-size:0.8rem; color:var(--color-steel-blue);">+${gainVsLeader}s vs ${leaderLabel}</div>
        </div>
        <div class="card" style="padding:1.25rem;">
          <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--color-text-secondary); text-transform:uppercase;">Feasible Lap</div>
          <div style="font-size:1.6rem; font-weight:700; margin:4px 0; color:var(--color-accent-red);">${item.t_feas.toFixed(3)} s</div>
          <div style="font-size:0.8rem; color:var(--color-accent-red);">+${item.gap.toFixed(3)}s gap</div>
        </div>
        <div class="card" style="padding:1.25rem;">
          <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--color-text-secondary); text-transform:uppercase;">Feasibility Gap</div>
          <div style="font-size:1.6rem; font-weight:700; margin:4px 0; color:#B45309;">+${item.gap.toFixed(3)} s</div>
          <div style="font-size:0.8rem; color:var(--color-text-secondary);">${item.switches} Driver Switches</div>
        </div>
      </div>
      <div style="margin-top:1rem; font-size:0.82rem; color:var(--color-text-secondary); line-height:1.5;">
        <strong>Boundary Discontinuities:</strong> Maximum velocity step jump: <strong>${item.max_dv_mps.toFixed(3)} m/s (${item.max_dv_kmh.toFixed(2)} km/h)</strong>. 
        Total absolute kinetic energy mismatch: <strong>${item.total_ke_kj.toFixed(2)} kJ</strong>.
        Driver distance allocation: ${d1Label} <strong>${item[d1Key]}%</strong> &bull; ${d2Label} <strong>${item[d2Key]}%</strong>.
      </div>
    `;
    renderMath(detailsContainer);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const res = btn.getAttribute('data-res');
      updateResolution(res);
    });
  });

  updateResolution('100m');

  window._sensSwitchFn = (team) => {
    activeTeamCtx = team;
    activeSensitivity = (team === 'rbr' && window.RBR_RESEARCH_DATA)
      ? window.RBR_RESEARCH_DATA.sensitivity
      : window.F1_RESEARCH_DATA.sensitivity;
    updateResolution(currentRes);
  };
}

// ==========================================================================
// 6. Plot Lightbox Modal
// ==========================================================================
function initPlotLightbox() {
  const modal = document.getElementById('plotModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  if (!modal || !modalImg || !modalClose) return;

  document.querySelectorAll('.plot-img-container').forEach(container => {
    container.addEventListener('click', () => {
      const img = container.querySelector('img');
      const card = container.closest('.plot-card') || container.closest('.card');
      const title = card ? (card.querySelector('.plot-title') || card.querySelector('.card-title'))?.innerText : '';
      if (img) {
        modalImg.src = img.src;
        modalCaption.innerText = title || 'Scientific Plot';
        modal.classList.add('active');
      }
    });
  });

  modalClose.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

// ==========================================================================
// 7. Team Switcher & Dynamic Content Updates
// ==========================================================================
function initTeamSwitcher() {
  const btnFerrari = document.getElementById('teamBtnFerrari');
  const btnRbr = document.getElementById('teamBtnRbr');
  if (!btnFerrari || !btnRbr) return;

  function applyTeam(team) {
    const isRbr = (team === 'rbr');

    btnFerrari.classList.toggle('active', !isRbr);
    btnFerrari.setAttribute('aria-pressed', String(!isRbr));
    btnRbr.classList.toggle('active', isRbr);
    btnRbr.setAttribute('aria-pressed', String(isRbr));

    document.body.classList.toggle('team-rbr', isRbr);

    // Hero Badge & Schematic Tag
    const badge = document.getElementById('heroBadge');
    if (badge) {
      badge.innerHTML = isRbr
        ? '<span class="hero-badge-dot"></span>ORACLE RED BULL RACING RB19 &bull; 2023 BAHRAIN GP Q3'
        : '<span class="hero-badge-dot"></span>SCUDERIA FERRARI SF-23 &bull; 2023 BAHRAIN GP Q3';
    }

    const tag = document.getElementById('schematicTag');
    if (tag) {
      tag.textContent = isRbr ? 'S = 5358.0 m • ds = 1.0 m' : 'S = 5369.0 m • ds = 1.0 m';
    }

    // Stat Bar Numbers
    const data = isRbr ? window.RBR_RESEARCH_DATA : window.F1_RESEARCH_DATA;
    if (data && data.overview) {
      const o = data.overview;
      const leaderTime = isRbr ? o.t_ver_observed_s : o.t_lec_observed_s;
      const gain = (leaderTime - o.t_theoretical_100m_s).toFixed(3);
      const leader = isRbr ? 'VER' : 'LEC';

      const el = (id) => document.getElementById(id);
      if (el('stat-theoretical')) el('stat-theoretical').textContent = o.t_theoretical_100m_s.toFixed(3) + ' s';
      if (el('stat-theoretical-desc')) el('stat-theoretical-desc').textContent =
        `Naive piece-wise minimum segment assembly (nominal gain: +${gain} s vs ${leader}).`;
      if (el('stat-feasible')) el('stat-feasible').textContent = o.t_feasible_100m_s.toFixed(3) + ' s';
      if (el('stat-gap')) el('stat-gap').textContent = '+' + o.feasibility_gap_s.toFixed(3) + ' s';
      if (el('stat-switches')) el('stat-switches').textContent = o.driver_switches_100m;
      if (el('stat-switches-desc')) el('stat-switches-desc').textContent =
        `Velocity step jumps up to ${o.max_boundary_dv_kmh.toFixed(2)} km/h and ${o.sum_boundary_ke_kj.toFixed(2)} kJ unphysical KE mismatch.`;
    }

    // Toggle Experiment Containers
    const ferPanes = document.getElementById('ferrariExperimentPanes');
    const rbrPanes = document.getElementById('rbrExperimentPanes');
    if (ferPanes && rbrPanes) {
      ferPanes.style.display = isRbr ? 'none' : 'block';
      rbrPanes.style.display = isRbr ? 'block' : 'none';
    }

    // Update Experiment Header Title & Tab Labels
    const expTitle = document.getElementById('experimentsHeaderTitle');
    const expLead = document.getElementById('experimentsHeaderLead');
    if (expTitle) {
      expTitle.textContent = isRbr
        ? 'Research Experiments (RB-00 through RB-04) — Oracle Red Bull Racing'
        : 'Research Experiments (00 through 04) — Scuderia Ferrari SF-23';
    }
    if (expLead) {
      expLead.textContent = isRbr
        ? 'Progression from telemetry validation and RB19 vehicle model calibration through unconstrained composite, physics solve, and sensitivity sweep.'
        : 'Progression from session selection and SF-23 model hierarchy validation through theoretical composite, physics solve, and sensitivity sweep.';
    }

    const tab0 = document.getElementById('tabBtn0');
    const tab1 = document.getElementById('tabBtn1');
    const tab2 = document.getElementById('tabBtn2');
    const tab3 = document.getElementById('tabBtn3');
    const tab4 = document.getElementById('tabBtn4');
    if (tab0) tab0.textContent = isRbr ? 'RB-00: Telemetry Validation' : 'Exp 00: Ingestion & Baseline';
    if (tab1) tab1.textContent = isRbr ? 'RB-01: Model Calibration' : 'Exp 01: Model Hierarchy Gate';
    if (tab2) tab2.textContent = isRbr ? 'RB-02: Theoretical Composite' : 'Exp 02: Theoretical Composite';
    if (tab3) tab3.textContent = isRbr ? 'RB-03: Physics Feasibility' : 'Exp 03: Physics Feasibility';
    if (tab4) tab4.textContent = isRbr ? 'RB-04: Sensitivity Sweep' : 'Exp 04: Sensitivity Sweep';

    // Update active tab in the visible pane container
    switchExperimentTab(activeExpTabIdx);

    // Update Plot Images & Titles
    const plotSpeedComp = document.getElementById('plotSpeedComparison');
    const titleSpeedComp = document.getElementById('speedCompPlotTitle');
    if (plotSpeedComp) {
      plotSpeedComp.src = isRbr
        ? 'assets/plots/redbull/redbull_speed_comparison.png'
        : 'assets/plots/speed_comparison.png';
    }
    if (titleSpeedComp) {
      titleSpeedComp.textContent = isRbr
        ? 'Teammate Speed Profile Comparison (Oracle Red Bull RB19 • VER vs PER)'
        : 'Teammate Speed Profile Comparison (Scuderia Ferrari SF-23 • LEC vs SAI)';
    }

    const plotWinners = document.getElementById('plotSegmentWinners');
    const titleWinners = document.getElementById('segmentWinnersPlotTitle');
    if (plotWinners) {
      plotWinners.src = isRbr
        ? 'assets/plots/redbull/redbull_driver_selection_100m.png'
        : 'assets/plots/track_segment_winners.png';
    }
    if (titleWinners) {
      titleWinners.textContent = isRbr
        ? 'Track Segment Winner Allocation (Red Bull RB19 • 100m Canonical)'
        : 'Track Segment Winner Allocation (Ferrari SF-23 • 100m Canonical)';
    }

    const plotWaterfall = document.getElementById('plotWaterfall');
    const titleWaterfall = document.getElementById('waterfallPlotTitle');
    if (plotWaterfall) {
      plotWaterfall.src = isRbr
        ? 'assets/plots/redbull/redbull_exp03_diagnostic_waterfall.png'
        : 'assets/plots/exp03_diagnostic_waterfall.png';
    }
    if (titleWaterfall) {
      titleWaterfall.textContent = isRbr
        ? 'Diagnostic Gap Attribution Waterfall (Oracle Red Bull RB19)'
        : 'Diagnostic Gap Attribution Waterfall (Scuderia Ferrari SF-23)';
    }

    const plotProfiles = document.getElementById('plotSpeedProfiles');
    const titleProfiles = document.getElementById('speedProfilesPlotTitle');
    if (plotProfiles) {
      plotProfiles.src = isRbr
        ? 'assets/plots/redbull/redbull_exp03_speed_profiles.png'
        : 'assets/plots/exp03_speed_profiles.png';
    }
    if (titleProfiles) {
      titleProfiles.textContent = isRbr
        ? 'Speed Profile Comparison: Theoretical vs Feasible vs Baseline (Red Bull RB19)'
        : 'Speed Profile Comparison: Theoretical vs Feasible vs Baseline (Ferrari SF-23)';
    }

    const plotSens = document.getElementById('plotSensitivity');
    const titleSens = document.getElementById('sensitivityPlotTitle');
    if (plotSens) {
      plotSens.src = isRbr
        ? 'assets/plots/redbull/redbull_segmentation_sensitivity.png'
        : 'assets/plots/segmentation_sensitivity.png';
    }
    if (titleSens) {
      titleSens.textContent = isRbr
        ? 'Segmentation Sensitivity & Discontinuity Scaling (Red Bull RB19)'
        : 'Segmentation Sensitivity & Discontinuity Scaling (Ferrari SF-23)';
    }

    // Call chart render functions
    if (window._telemSwitchFn) window._telemSwitchFn(team);
    if (window._waterfallSwitchFn) window._waterfallSwitchFn(team);
    if (window._sensSwitchFn) window._sensSwitchFn(team);

    // Re-render math formulas across the document after dynamic DOM mutations
    renderMath();
  }

  btnFerrari.addEventListener('click', () => applyTeam('ferrari'));
  btnRbr.addEventListener('click', () => applyTeam('rbr'));

  // Default to Ferrari
  applyTeam('ferrari');
}
