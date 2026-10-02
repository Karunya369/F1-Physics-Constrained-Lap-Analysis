/**
 * F1 Physics-Constrained Lap Analysis
 * Application Logic & Scientific Data Visualizations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initExperimentTabs();
  initTeamSwitcher();        // must run before charts so data is correct
  initTelemetryChart();
  initWaterfallChart();
  initSensitivityControls();
  initPlotLightbox();
});

// 1. Navigation & ScrollSpy
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

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
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
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
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

// 2. Experiment Tabs
function initExperimentTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(tabTarget);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

// 3. Telemetry Speed Profile Canvas Chart
function initTelemetryChart() {
  const canvas = document.getElementById('telemetryCanvas');
  if (!canvas || !window.F1_RESEARCH_DATA) return;

  const ctx = canvas.getContext('2d');
  const tooltip = document.getElementById('chartTooltip');

  let showFeasible = true;
  let showDonor = true;
  let showDrs = true;

  // Active dataset (starts with Ferrari)
  let activeData = window.F1_RESEARCH_DATA.telemetryProfile;
  let activeTeam = 'ferrari';

  // Toggle buttons
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
  const maxDist = 5369.0;

  function render(hoverIndex = -1) {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    ctx.clearRect(0, 0, width, height);

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Grid & Axes
    ctx.strokeStyle = '#2F333B';
    ctx.lineWidth = 1;

    // Speed Grid Lines
    const speedSteps = [80, 140, 200, 260, 320];
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#85847F';
    ctx.textAlign = 'right';

    speedSteps.forEach(speed => {
      const y = padding.top + chartH - ((speed - minSpeed) / (maxSpeed - minSpeed)) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillText(`${speed} km/h`, padding.left - 8, y + 3);
    });

    // Distance Grid Lines
    const distSteps = [0, 1000, 2000, 3000, 4000, 5000];
    ctx.textAlign = 'center';
    distSteps.forEach(dist => {
      const x = padding.left + (dist / maxDist) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartH);
      ctx.stroke();

      ctx.fillText(`${dist}m`, x, padding.top + chartH + 16);
    });

    // Driver mini-sector bar at bottom
    const barY = padding.top + chartH + 24;
    const barH = 10;
    activeData.forEach((pt, i) => {
      const x1 = padding.left + (pt.s / maxDist) * chartW;
      const x2 = padding.left + ((i + 1 < activeData.length ? activeData[i+1].s : maxDist) / maxDist) * chartW;
      const isD1 = activeTeam === 'rbr' ? pt.driver === 'VER' : pt.driver === 'LEC';
      ctx.fillStyle = isD1
        ? (activeTeam === 'rbr' ? '#3B7DD8' : '#C83E36')
        : (activeTeam === 'rbr' ? '#E8A620' : '#D97706');
      ctx.fillRect(x1, barY, Math.max(x2 - x1, 1), barH);
    });
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#A3A199';
    ctx.textAlign = 'left';
    const d1Name = activeTeam === 'rbr' ? 'VER' : 'LECLERC';
    const d2Name = activeTeam === 'rbr' ? 'PER' : 'SAINZ';
    const d1Color = activeTeam === 'rbr' ? 'BLUE' : 'RED';
    const d2Color = activeTeam === 'rbr' ? 'AMBER' : 'AMBER';
    ctx.fillText(`DRIVER SELECTION RIBBON (${d1Color}: ${d1Name}, AMBER: ${d2Name})`, padding.left, barY + 20);

    // DRS Zones shading
    if (showDrs) {
      ctx.fillStyle = 'rgba(101, 120, 135, 0.15)';
      let inDrs = false;
      let drsStart = 0;
      activeData.forEach(pt => {
        if (pt.drs && !inDrs) {
          inDrs = true;
          drsStart = pt.s;
        } else if (!pt.drs && inDrs) {
          inDrs = false;
          const x1 = padding.left + (drsStart / maxDist) * chartW;
          const x2 = padding.left + (pt.s / maxDist) * chartW;
          ctx.fillRect(x1, padding.top, x2 - x1, chartH);
        }
      });
    }

    // 1. Theoretical Donor Speed Line
    if (showDonor) {
      ctx.beginPath();
      ctx.strokeStyle = '#FFAEAA';
      ctx.lineWidth = 1.5;
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

    // 2. Physics-Constrained Feasible Speed Line
    if (showFeasible) {
      ctx.beginPath();
      ctx.strokeStyle = '#657887';
      ctx.lineWidth = 2.5;

      activeData.forEach((pt, i) => {
        const x = padding.left + (pt.s / maxDist) * chartW;
        const y = padding.top + chartH - ((pt.v_feas - minSpeed) / (maxSpeed - minSpeed)) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Hover Crosshair & Indicator
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
      ctx.fillStyle = '#657887';
      ctx.beginPath();
      ctx.arc(hx, hyFeas, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Donor dot
      ctx.fillStyle = '#FFAEAA';
      ctx.beginPath();
      ctx.arc(hx, hyDonor, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Interactive Hover Event
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const chartW = rect.width - padding.left - padding.right;

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
    tooltip.style.left = `${Math.min(e.clientX - rect.left + 15, rect.width - 200)}px`;
    tooltip.style.top = `${e.clientY - rect.top - 10}px`;

    const d1Code = activeTeam === 'rbr' ? 'VER' : 'LEC';
    const d1Label = activeTeam === 'rbr' ? 'Verstappen' : 'Leclerc';
    const d2Label = activeTeam === 'rbr' ? 'Perez' : 'Sainz';
    const d1Color = activeTeam === 'rbr' ? '#7AB3F0' : '#FFAEAA';
    const d2Color = '#FBBF24';
    tooltip.innerHTML = `
      <div style="font-weight:700; color:#F4F1EA; margin-bottom:4px;">s = ${pt.s.toFixed(0)} m</div>
      <div style="color:#657887;">Feasible: <strong>${pt.v_feas.toFixed(1)} km/h</strong></div>
      <div style="color:#FFAEAA;">Theoretical: <strong>${pt.v_donor.toFixed(1)} km/h</strong></div>
      <div style="color:#A3A199;">Deficit: <span style="color:#E0564C;">-${deltaV} km/h</span></div>
      <div style="color:#A3A199;">Donor: <span style="color:${pt.driver === d1Code ? d1Color : d2Color}">${pt.driver === d1Code ? d1Label : d2Label}</span></div>
      <div style="color:#85847F; font-size:10px;">Curvature: ${pt.kappa.toFixed(5)} m⁻¹</div>
    `;
  });

  canvas.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    render(-1);
  });

  resizeCanvas();

  // Register team-switch callback
  if (window._registerTeamRenders) {
    // We re-register after all three are ready (done in initSensitivityControls)
  }
  window._telemSwitchFn = (team) => {
    activeTeam = team;
    activeData = team === 'rbr'
      ? (window.RBR_RESEARCH_DATA ? window.RBR_RESEARCH_DATA.telemetryProfile : activeData)
      : window.F1_RESEARCH_DATA.telemetryProfile;
    resizeCanvas();
  };
}

// 4. Waterfall Gap Attribution Visualization
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
      html += `
        <div class="waterfall-item">
          <div class="waterfall-header">
            <span><strong>${item.symbol}:</strong> ${item.name}</span>
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

    // Total summary
    html += `
      <div class="waterfall-item" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--color-border-dark);">
        <div class="waterfall-header">
          <span><strong>Total Theoretical-to-Feasible Gap:</strong> (T_feasible &minus; T_theoretical)</span>
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
  }

  renderWaterfall('ferrari');
  window._waterfallSwitchFn = renderWaterfall;
}

// 5. Sensitivity Controls (50m, 100m, 250m)
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
        <strong>Boundary Kinematics:</strong> Maximum velocity step jump: <strong>${item.max_dv_mps.toFixed(3)} m/s (${item.max_dv_kmh.toFixed(2)} km/h)</strong>. 
        Total absolute kinetic energy mismatch: <strong>${item.total_ke_kj.toFixed(2)} kJ</strong>.
        Driver distance allocation: ${d1Label} <strong>${item[d1Key]}%</strong> | ${d2Label} <strong>${item[d2Key]}%</strong>.
      </div>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const res = btn.getAttribute('data-res');
      updateResolution(res);
    });
  });

  // Default to 100m canonical
  updateResolution('100m');

  window._sensSwitchFn = (team) => {
    activeTeamCtx = team;
    activeSensitivity = (team === 'rbr' && window.RBR_RESEARCH_DATA)
      ? window.RBR_RESEARCH_DATA.sensitivity
      : window.F1_RESEARCH_DATA.sensitivity;
    updateResolution(currentRes);
  };

  // Now all three chart functions are initialized — register them all
  if (window._registerTeamRenders) {
    window._registerTeamRenders(
      (team) => { if (window._telemSwitchFn) window._telemSwitchFn(team); },
      (team) => { if (window._waterfallSwitchFn) window._waterfallSwitchFn(team); },
      (team) => { if (window._sensSwitchFn) window._sensSwitchFn(team); }
    );
  }
}

// 6. Plot Lightbox Modal
function initPlotLightbox() {
  const modal = document.getElementById('plotModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  if (!modal || !modalImg || !modalClose) return;

  document.querySelectorAll('.plot-img-container').forEach(container => {
    container.addEventListener('click', () => {
      const img = container.querySelector('img');
      const card = container.closest('.plot-card');
      const title = card ? card.querySelector('.plot-title').innerText : '';
      if (img) {
        modalImg.src = img.src;
        modalCaption.innerText = title;
        modal.classList.add('active');
      }
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

// 7. Team Switcher
function initTeamSwitcher() {
  const btnFerrari = document.getElementById('teamBtnFerrari');
  const btnRbr = document.getElementById('teamBtnRbr');
  if (!btnFerrari || !btnRbr) return;

  // Ferrari-specific sections (visible by default)
  const ferrariSections = [
    document.getElementById('overview'),
    document.getElementById('telemetry'),
    document.getElementById('experiments'),
    document.getElementById('method'),
    document.getElementById('results'),
    document.getElementById('conclusion'),
    document.getElementById('about'),
  ].filter(Boolean);

  // Red Bull-specific sections (hidden by default)
  const rbrSections = [
    document.getElementById('redbull-study'),
    document.getElementById('cross-team'),
  ].filter(Boolean);

  function applyTeam(team) {
    const isRbr = (team === 'rbr');

    // Button active states
    btnFerrari.classList.toggle('active', !isRbr);
    btnFerrari.setAttribute('aria-pressed', String(!isRbr));
    btnRbr.classList.toggle('active', isRbr);
    btnRbr.setAttribute('aria-pressed', String(isRbr));

    // Body class for CSS theming
    document.body.classList.toggle('team-rbr', isRbr);

    // Hero badge
    const badge = document.getElementById('heroBadge');
    if (badge) {
      badge.innerHTML = isRbr
        ? '<span class="hero-badge-dot"></span>ORACLE RED BULL RACING RB19 &bull; 2023 BAHRAIN GP Q3'
        : '<span class="hero-badge-dot"></span>SCUDERIA FERRARI SF-23 &bull; 2023 BAHRAIN GP Q3';
    }

    // Stat bar update
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

    // Show/hide sections
    ferrariSections.forEach(s => { s.style.display = isRbr ? 'none' : ''; });
    rbrSections.forEach(s => { s.style.display = isRbr ? '' : 'none'; });

    // Re-render charts with active team data
    if (window._telemetryRenderFn) window._telemetryRenderFn(team);
    if (window._waterfallRenderFn) window._waterfallRenderFn(team);
    if (window._sensitivityRenderFn) window._sensitivityRenderFn(team);

    // Scroll to top gently
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  btnFerrari.addEventListener('click', () => applyTeam('ferrari'));
  btnRbr.addEventListener('click', () => applyTeam('rbr'));

  // Register render hooks called by applyTeam
  window._registerTeamRenders = (telem, waterfall, sensitivity) => {
    window._telemetryRenderFn = telem;
    window._waterfallRenderFn = waterfall;
    window._sensitivityRenderFn = sensitivity;
  };

  // Default: Ferrari
  applyTeam('ferrari');
}
