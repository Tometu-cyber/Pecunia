/* @ds-bundle: {"format":4,"namespace":"Portail","components":[{"name":"AppIcon"},{"name":"AppTile"},{"name":"GlassButton"},{"name":"TabBar"},{"name":"Sidebar"},{"name":"Icon"},{"name":"Card"},{"name":"List"},{"name":"ListRow"},{"name":"Button"},{"name":"TextField"},{"name":"ProgressRing"},{"name":"BarChart"},{"name":"Menu"},{"name":"SegmentedControl"},{"name":"Toggle"},{"name":"DatePicker"},{"name":"AppHeader"},{"name":"Sheet"},{"name":"LineChart"},{"name":"Select"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  /* Liens : un composant avec `href` se rend en <a>, ou avec le composant de lien de l'app
     (Next.js Link, React Router Link…) passé à Portail.setLinkComponent ou en prop `linkAs`. */
  var linkComponent = null;
  function setLinkComponent(C) { linkComponent = C || null; }
  function linkTag(p) { return (p && p.linkAs) || linkComponent || 'a'; }

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }

  var PATHS = {
    home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    plus: 'M12 5v14M5 12h14',
    settings: 'M4 7h10M18 7h2M16 5v4M4 17h4M12 17h8M10 15v4',
    chevron: 'M9 6l6 6-6 6',
    finances: 'M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2zM16 14.5h.01',
    sport: 'M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12',
    alternance: 'M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M3 13h18',
    alimentation: 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 2.5-3 6s1 4 3 4v8',
    notes: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5',
    portail: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    calendar: 'M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 10h16M8 3v4M16 3v4',
    bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
    alert: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v5M12 16.5h.01',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    chart: 'M4 20h16M7 16v-5M12 16V7M17 16v-8',
    euro: 'M17 6.5A7 7 0 1 0 17 17.5M4 10h9M4 14h9',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
    updown: 'M8 9l4-4 4 4M8 15l4 4 4-4',
    more: 'M4.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M10.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M16.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0',
    edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
    copy: 'M9 9h10v11H9zM5 15V4h10',
    trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3',
    sort: 'M4 7h10M4 12h7M4 17h4M17 5v14M14 16l3 3 3-3',
    x: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
    back: 'M15 5l-7 7 7 7',
    filter: 'M4 6h16M7 12h10M10 18h4',
    card: 'M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 10.5h18M7 14.5h4',
    coins: 'M12 9c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
    swap: 'M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7',
    pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    trend: 'M3 17l6-6 4 4 8-8M15 7h6v6'
  };

  function Icon(props) {
    var size = props.size || 22;
    var d = PATHS[props.name] || PATHS.grid;
    return h('svg', {
      className: cx('pt-icon', props.className),
      width: size, height: size, viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor',
      strokeWidth: props.strokeWidth || 1.75, strokeLinecap: 'round', strokeLinejoin: 'round',
      'aria-hidden': props.label ? undefined : 'true',
      role: props.label ? 'img' : undefined,
      'aria-label': props.label
    }, h('path', { d: d }));
  }

  /* Icônes d'app façon iOS 26 : fond en dégradé, glyphe en couches (arrière translucide,
     avant en verre dépoli), ombre portée, reflet et liseré lumineux sur le bord. */
  var SQUIRCLE = 'M0 50C0 9 9 0 50 0S100 9 100 50 91 100 50 100 0 91 0 50Z';

  function glyph(app, F, G) {
    var back = 'pt-ic-back', det = 'pt-ic-detail';
    switch (app) {
      case 'finances': return [
        h('rect', { key: 1, className: back, x: 24, y: 24, width: 50, height: 32, rx: 7, transform: 'rotate(-12 49 40)' }),
        h('rect', { key: 2, fill: F, x: 20, y: 36, width: 60, height: 40, rx: 10 }),
        h('rect', { key: 3, className: det, x: 56, y: 48, width: 24, height: 16, rx: 8 }),
        h('circle', { key: 4, fill: F, cx: 64, cy: 56, r: 3.6 })
      ];
      case 'sport': return [
        h('rect', { key: 1, className: back, x: 13, y: 39, width: 10, height: 22, rx: 5 }),
        h('rect', { key: 2, className: back, x: 77, y: 39, width: 10, height: 22, rx: 5 }),
        h('rect', { key: 3, fill: F, x: 28, y: 46, width: 44, height: 8, rx: 4 }),
        h('rect', { key: 4, fill: F, x: 22, y: 28, width: 13, height: 44, rx: 6.5 }),
        h('rect', { key: 5, fill: F, x: 65, y: 28, width: 13, height: 44, rx: 6.5 }),
        h('rect', { key: 6, className: det, x: 26, y: 33, width: 5, height: 34, rx: 2.5, opacity: 0.35 }),
        h('rect', { key: 7, className: det, x: 69, y: 33, width: 5, height: 34, rx: 2.5, opacity: 0.35 })
      ];
      case 'alternance': return [
        h('rect', { key: 1, className: 'pt-ic-back-stroke', x: 37, y: 22, width: 26, height: 20, rx: 7, fill: 'none', strokeWidth: 6 }),
        h('rect', { key: 2, fill: F, x: 18, y: 36, width: 64, height: 42, rx: 11 }),
        h('rect', { key: 3, className: det, x: 18, y: 54, width: 64, height: 3, opacity: 0.3 }),
        h('rect', { key: 4, className: det, x: 43, y: 49, width: 14, height: 13, rx: 4 })
      ];
      case 'alimentation': return [
        h('path', { key: 1, className: 'pt-ic-back-stroke', fill: 'none', strokeWidth: 5, strokeLinecap: 'round', d: 'M38 38c-5-5 4-9 0-16M50 38c-5-5 4-9 0-16M62 38c-5-5 4-9 0-16' }),
        h('rect', { key: 2, className: back, x: 39, y: 72, width: 22, height: 8, rx: 4 }),
        h('path', { key: 3, fill: F, d: 'M20 50H80A30 27 0 0 1 20 50Z' }),
        h('rect', { key: 4, fill: F, x: 14, y: 45, width: 72, height: 9, rx: 4.5 }),
        h('rect', { key: 5, className: det, x: 30, y: 60, width: 40, height: 3.5, rx: 1.75, opacity: 0.35 })
      ];
      case 'notes': return [
        h('rect', { key: 1, className: back, x: 32, y: 19, width: 44, height: 60, rx: 9, transform: 'rotate(9 54 49)' }),
        h('rect', { key: 2, fill: F, x: 22, y: 20, width: 48, height: 62, rx: 9 }),
        h('path', { key: 3, className: det, d: 'M31 20h30a9 9 0 0 1 9 9v5H22v-5a9 9 0 0 1 9-9z' }),
        h('rect', { key: 4, className: det, x: 30, y: 45, width: 32, height: 4, rx: 2, opacity: 0.4 }),
        h('rect', { key: 5, className: det, x: 30, y: 56, width: 32, height: 4, rx: 2, opacity: 0.4 }),
        h('rect', { key: 6, className: det, x: 30, y: 67, width: 20, height: 4, rx: 2, opacity: 0.4 })
      ];
      default: return [
        h('rect', { key: 1, className: 'pt-ic-t1', x: 20, y: 20, width: 28, height: 28, rx: 9 }),
        h('rect', { key: 2, className: 'pt-ic-t2', x: 52, y: 20, width: 28, height: 28, rx: 14 }),
        h('rect', { key: 3, className: 'pt-ic-t3', x: 20, y: 52, width: 28, height: 28, rx: 14 }),
        h('rect', { key: 4, className: 'pt-ic-t4', x: 52, y: 52, width: 28, height: 28, rx: 9 }),
        h('rect', { key: 5, fill: G, x: 20, y: 20, width: 28, height: 28, rx: 9 }),
        h('rect', { key: 6, fill: G, x: 52, y: 20, width: 28, height: 28, rx: 14 }),
        h('rect', { key: 7, fill: G, x: 20, y: 52, width: 28, height: 28, rx: 14 }),
        h('rect', { key: 8, fill: G, x: 52, y: 52, width: 28, height: 28, rx: 9 })
      ];
    }
  }

  function AppIcon(props) {
    var size = props.size || 40;
    var app = props.app || 'portail';
    var look = props.appearance || 'auto';
    var uid = 'pt' + React.useId().replace(/[^A-Za-z0-9]/g, '');
    function u(n) { return 'url(#' + uid + n + ')'; }
    function stop(off, color, op) {
      return h('stop', { offset: off, style: { stopColor: color, stopOpacity: op == null ? 1 : op } });
    }
    var svg = h('svg', { viewBox: '0 0 100 100', width: size, height: size, className: 'pt-appicon-svg' },
      h('defs', null,
        h('linearGradient', { id: uid + 'bg', x1: 0, y1: 0, x2: 0.6, y2: 1 },
          stop(0, 'var(--ic-bg1)'), stop(1, 'var(--ic-bg2)')),
        h('radialGradient', { id: uid + 'sh', cx: 0.3, cy: 0.05, r: 0.85 },
          stop(0, '#ffffff', 0.55), stop(0.55, '#ffffff', 0)),
        h('linearGradient', { id: uid + 'fg', x1: 0, y1: 0, x2: 0.3, y2: 1 },
          stop(0, 'var(--ic-fg1)'), stop(1, 'var(--ic-fg2)')),
        h('linearGradient', { id: uid + 'gl', x1: 0, y1: 0, x2: 0, y2: 1 },
          stop(0, '#ffffff', 0.6), stop(0.5, '#ffffff', 0.08), stop(1, '#ffffff', 0)),
        h('linearGradient', { id: uid + 'rim', x1: 0, y1: 0, x2: 0, y2: 1 },
          stop(0, '#ffffff', 0.75), stop(0.3, '#ffffff', 0), stop(0.75, '#000000', 0), stop(1, '#000000', 0.18)),
        h('filter', { id: uid + 'ds', x: '-20%', y: '-20%', width: '140%', height: '150%' },
          h('feDropShadow', { dx: 0, dy: 2.5, stdDeviation: 2.6, floodColor: '#000000', floodOpacity: 0.24 }))
      ),
      h('path', { className: 'pt-ic-bg', d: SQUIRCLE, fill: u('bg') }),
      h('path', { className: 'pt-ic-sheen', d: SQUIRCLE, fill: u('sh') }),
      h('g', { filter: u('ds') }, glyph(app, u('fg'), u('gl'))),
      h('path', { className: 'pt-ic-rim', d: SQUIRCLE, fill: 'none', stroke: u('rim'), strokeWidth: 2 })
    );
    return h('span', {
      className: cx('pt-appicon', 'pt-app-' + app, look !== 'auto' && 'pt-appicon-' + look, props.className),
      style: { width: size, height: size },
      role: props.label ? 'img' : undefined,
      'aria-label': props.label,
      'aria-hidden': props.label ? undefined : 'true'
    }, svg);
  }

  function AppTile(props) {
    var app = props.app || 'portail';
    var p = typeof props.progress === 'number' ? Math.max(0, Math.min(1, props.progress)) : null;
    return h('button', {
      type: 'button',
      className: cx('pt-root', 'pt-tile', 'pt-app-' + app, props.variant === 'tinted' && 'pt-tile-tinted', props.className),
      onClick: props.onClick
    },
      h('span', { className: 'pt-tile-head' },
        h(AppIcon, { app: app, size: 44 }),
        h(Icon, { name: 'chevron', size: 18, className: 'pt-tile-chev' })
      ),
      h('span', { className: 'pt-tile-name' }, props.name),
      props.value != null ? h('span', { className: 'pt-tile-value' }, props.value) : null,
      props.detail ? h('span', { className: 'pt-tile-detail' }, props.detail) : null,
      p !== null ? h('span', {
        className: 'pt-tile-bar', role: 'progressbar',
        'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(p * 100)
      }, h('span', { style: { width: (p * 100) + '%' } })) : null
    );
  }

  function GlassButton(props) {
    var iconOnly = props.icon && !props.children;
    var cls = cx('pt-root', 'pt-gbtn', 'pt-app-' + (props.app || 'portail'),
      props.prominent ? 'pt-gbtn-prominent' : 'pt-glass',
      props.size === 'small' && 'pt-gbtn-small',
      iconOnly && 'pt-gbtn-icon', props.className);
    var content = [
      props.icon ? h(Icon, { key: 'i', name: props.icon, size: props.size === 'small' ? 16 : 22 }) : null,
      props.children != null ? h('span', { key: 'l', className: 'pt-label' }, props.children) : null
    ];
    var aria = iconOnly ? props.label : undefined;
    if (props.href) {
      if (props.disabled) return h('span', { className: cls, role: 'link', 'aria-disabled': 'true', 'aria-label': aria }, content);
      return h(linkTag(props), { href: props.href, className: cls, onClick: props.onClick, 'aria-label': aria }, content);
    }
    return h('button', {
      type: props.type || 'button', className: cls,
      onClick: props.disabled ? undefined : props.onClick,
      'aria-disabled': props.disabled ? 'true' : undefined,
      'aria-label': aria
    }, content);
  }

  /* Déplacement (px) au-delà duquel un toucher sur la barre devient un glissé. */
  var TAB_DRAG_THRESHOLD = 8;

  function TabBar(props) {
    var items = props.items || [];
    var st = React.useState(props.defaultActive || (items[0] && items[0].id));
    var ps = React.useState(null); /* onglet choisi au doigt, affiché pendant la navigation */
    var pending = ps[0], setPending = ps[1];
    var active = pending != null ? pending : (props.active != null ? props.active : st[0]);
    var draggable = !!props.draggable;
    var navRef = React.useRef(null), tabRefs = React.useRef([]), gesture = React.useRef(null);
    var rs = React.useState([]), rects = rs[0], setRects = rs[1];
    var ds = React.useState(null), drag = ds[0], setDrag = ds[1];

    React.useEffect(function () { setPending(null); }, [props.active]);
    React.useLayoutEffect(function () {
      if (!draggable) return;
      function measure() {
        setRects(tabRefs.current.slice(0, items.length).map(function (el) { return el ? { left: el.offsetLeft, width: el.offsetWidth } : { left: 0, width: 0 }; }));
      }
      measure();
      if (typeof ResizeObserver === 'undefined' || !navRef.current) return;
      var ro = new ResizeObserver(measure);
      ro.observe(navRef.current);
      return function () { ro.disconnect(); };
    }, [draggable, items.length]);

    function select(id) {
      if (props.active == null) st[1](id);
      if (props.onChange) props.onChange(id);
    }
    function indexAt(x) {
      var best = 0;
      rects.forEach(function (r, i) { if (x >= r.left) best = i; });
      return best;
    }
    function localX(e) { return e.clientX - navRef.current.getBoundingClientRect().left; }
    function onDown(e) {
      if (!e.isPrimary || e.button !== 0) return;
      gesture.current = { id: e.pointerId, startX: e.clientX, dragging: false, over: indexAt(localX(e)) };
    }
    function onMove(e) {
      var g = gesture.current;
      if (!g || g.id !== e.pointerId) return;
      if (!g.dragging) {
        if (Math.abs(e.clientX - g.startX) < TAB_DRAG_THRESHOLD) return;
        g.dragging = true; /* la barre garde le doigt, même en dehors */
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      var x = localX(e), over = indexAt(x);
      if (over !== g.over) { g.over = over; if (navigator.vibrate) navigator.vibrate(8); }
      setDrag({ x: x, over: over });
    }
    function onEnd(e, cancelled) {
      var g = gesture.current;
      gesture.current = null;
      if (!g || g.id !== e.pointerId || !g.dragging) return;
      setDrag(null);
      if (cancelled) return;
      var it = items[g.over];
      if (!it || it.id === active) return;
      if (navigator.vibrate) navigator.vibrate(10);
      if (props.active != null) setPending(it.id); /* contrôlé : affiché tout de suite, en attendant la nouvelle page */
      /* un vrai clic sur l'onglet : le lien (ou onChange) fait la navigation */
      var el = tabRefs.current[g.over];
      if (el) el.click(); else select(it.id);
    }

    var pill = null;
    if (draggable && rects.length === items.length && rects.length) {
      var ai = items.findIndex(function (it) { return it.id === active; });
      var base = rects[ai] || rects[0];
      if (drag) {
        var first = rects[0], last = rects[rects.length - 1];
        var w = (rects[drag.over] || base).width;
        var left = Math.min(Math.max(drag.x - w / 2, first.left), last.left + last.width - w);
        pill = { translate: left + 'px 0', width: w + 'px' };
      } else if (ai >= 0) {
        pill = { translate: base.left + 'px 0', width: base.width + 'px' };
      }
    }

    var bar = h('nav', {
      ref: navRef,
      className: cx('pt-tabbar', 'pt-glass', draggable && 'has-pill', drag && 'is-dragging'),
      'aria-label': props.label || 'Navigation principale',
      onPointerDown: draggable ? onDown : undefined,
      onPointerMove: draggable ? onMove : undefined,
      onPointerUp: draggable ? function (e) { onEnd(e, false); } : undefined,
      onPointerCancel: draggable ? function (e) { onEnd(e, true); } : undefined
    },
      pill ? h('span', { className: 'pt-tab-pill', style: pill, 'aria-hidden': 'true' }) : null,
      items.map(function (it, i) {
        var common = {
          key: it.id,
          ref: function (el) { tabRefs.current[i] = el; },
          className: cx('pt-tab', drag && drag.over === i && 'is-over'),
          'aria-current': it.id === active ? 'page' : undefined,
          onClick: function () { select(it.id); }
        };
        var content = [h(Icon, { key: 'i', name: it.icon, size: 24 }), h('span', { key: 'l' }, it.label)];
        if (it.href) return h(linkTag(props), Object.assign({ href: it.href, draggable: false }, common), content);
        return h('button', Object.assign({ type: 'button' }, common), content);
      }));
    var a = props.action;
    return h('div', { className: cx('pt-root', 'pt-tabbar-row', 'pt-app-' + (props.app || 'portail'), props.className) },
      bar,
      a ? h(GlassButton, { icon: a.icon, label: a.label, onClick: a.onClick, href: a.href, linkAs: props.linkAs, app: props.app, prominent: a.prominent }) : null
    );
  }

  function Sidebar(props) {
    var sections = props.sections || [];
    var first = sections[0] && sections[0].items[0] && sections[0].items[0].id;
    var st = React.useState(props.defaultActive || first);
    var active = props.active != null ? props.active : st[0];
    function select(id) {
      if (props.active == null) st[1](id);
      if (props.onSelect) props.onSelect(id);
    }
    return h('nav', {
      className: cx('pt-root', 'pt-sidebar', 'pt-glass-thick', props.app && 'pt-app-' + props.app, props.className),
      'aria-label': props.label || 'Apps'
    },
      props.windowControls === false ? null : h('div', { className: 'pt-traffic', 'aria-hidden': 'true' }, h('span'), h('span'), h('span')),
      sections.map(function (sec, i) {
        return h(React.Fragment, { key: sec.title || i },
          sec.title ? h('div', { className: 'pt-side-title' }, sec.title) : null,
          h('ul', { className: 'pt-side-list' }, sec.items.map(function (it) {
            var common = {
              className: cx('pt-side-item', it.app && 'pt-app-' + it.app),
              'aria-current': it.id === active ? 'page' : undefined,
              onClick: function () { select(it.id); }
            };
            var content = [
              it.app ? h(AppIcon, { key: 'i', app: it.app, icon: it.icon, size: 20 }) : h(Icon, { key: 'i', name: it.icon, size: 18 }),
              h('span', { key: 'l', className: 'pt-side-label' }, it.label),
              it.badge != null ? h('span', { key: 'b', className: 'pt-side-badge' }, it.badge) : null
            ];
            return h('li', { key: it.id },
              it.href ? h(linkTag(props), Object.assign({ href: it.href }, common), content)
                      : h('button', Object.assign({ type: 'button' }, common), content));
          }))
        );
      }),
      props.footer ? h('div', { className: 'pt-side-footer' }, props.footer) : null
    );
  }

  /* ——— Contenu ——— */
  function Card(props) {
    return h('section', { className: cx('pt-root', 'pt-card', 'pt-app-' + (props.app || 'portail'), props.className), style: props.style },
      (props.title || props.action) ? h('header', { className: 'pt-card-head' },
        h('div', { style: { minWidth: 0 } },
          props.title ? h('h3', { className: 'pt-card-title' }, props.title) : null,
          props.subtitle ? h('p', { className: 'pt-card-sub' }, props.subtitle) : null),
        props.action ? h(Button, { variant: 'plain', size: 'small', app: props.app, onClick: props.action.onClick }, props.action.label) : null
      ) : null,
      props.children
    );
  }

  function List(props) {
    return h('div', { className: cx('pt-root', 'pt-list-wrap', props.className) },
      props.header ? h('h4', { className: 'pt-list-header' }, props.header) : null,
      h('ul', { className: cx('pt-list', props.plain && 'pt-list-plain'), style: { '--sep-inset': props.inset === false ? '0px' : '58px' } },
        React.Children.map(props.children, function (c) { return c ? h('li', null, c) : null; })),
      props.footer ? h('p', { className: 'pt-list-footer' }, props.footer) : null
    );
  }

  function ListRow(props) {
    var app = props.app || 'portail';
    var lead = null;
    if (props.appIcon) lead = h(AppIcon, { app: app, size: 30 });
    else if (props.icon) lead = h('span', { className: 'pt-row-lead' }, h(Icon, { name: props.icon, size: 17, strokeWidth: 2 }));
    var interactive = !!(props.href || props.onClick);
    var Tag = props.href ? linkTag(props) : props.onClick ? 'button' : 'div';
    return h(Tag, { type: !props.href && props.onClick ? 'button' : undefined, href: props.href, className: cx('pt-row', 'pt-app-' + app, !lead && 'pt-row-nolead', props.className), onClick: props.onClick },
      lead,
      h('span', { className: 'pt-row-text' },
        h('span', { className: 'pt-row-title' }, props.title),
        props.subtitle ? h('span', { className: 'pt-row-sub' }, props.subtitle) : null),
      props.value != null ? h('span', { className: cx('pt-row-value', props.tone && 'pt-tone-' + props.tone) }, props.value) : null,
      interactive && props.chevron !== false ? h(Icon, { name: 'chevron', size: 16, strokeWidth: 2.2, className: 'pt-row-chev' }) : null
    );
  }

  function Button(props) {
    var v = props.variant || 'filled';
    var cls = cx('pt-root', 'pt-btn', 'pt-btn-' + v, 'pt-app-' + (props.app || 'portail'),
      props.size && props.size !== 'regular' && 'pt-btn-' + props.size, props.full && 'pt-btn-full', props.className);
    var content = [
      props.icon ? h(Icon, { key: 'i', name: props.icon, size: props.size === 'small' ? 15 : 20, strokeWidth: 2.2 }) : null,
      props.children != null ? h('span', { key: 'l', className: 'pt-label' }, props.children) : null
    ];
    var aria = props.children == null ? props.label : undefined;
    if (props.href) {
      if (props.disabled) return h('span', { className: cls, role: 'link', 'aria-disabled': 'true', 'aria-label': aria }, content);
      return h(linkTag(props), { href: props.href, className: cls, onClick: props.onClick, 'aria-label': aria }, content);
    }
    return h('button', {
      type: props.type || 'button', className: cls,
      onClick: props.disabled ? undefined : props.onClick,
      'aria-disabled': props.disabled ? 'true' : undefined,
      'aria-label': aria
    }, content);
  }

  function TextField(props) {
    var rid = React.useId();
    var id = props.id || 'ptf' + rid.replace(/[^A-Za-z0-9]/g, '');
    var search = props.variant === 'search';
    return h('div', { className: cx('pt-root', 'pt-field', 'pt-app-' + (props.app || 'portail'),
      search && 'pt-field-search', props.size === 'small' && 'pt-field-small', props.error && 'pt-field-error', props.className) },
      props.label ? h('label', { className: 'pt-field-label', htmlFor: id }, props.label) : null,
      h('div', { className: 'pt-field-box', onPointerDown: function (e) {
        /* un toucher à côté du champ (zone tactile agrandie, pictogramme, unité) le met au focus */
        var input = e.currentTarget.querySelector('input');
        if (input && e.target !== input) { e.preventDefault(); input.focus(); }
      } },
        (props.icon || search) ? h(Icon, { name: props.icon || 'search', size: props.size === 'small' ? 14 : 18, strokeWidth: 2 }) : null,
        h('input', {
          id: id, type: props.type || (search ? 'search' : 'text'), placeholder: props.placeholder,
          value: props.value, defaultValue: props.defaultValue, inputMode: props.inputMode,
          'aria-label': props.label ? undefined : props.placeholder,
          'aria-invalid': props.error ? 'true' : undefined,
          'aria-describedby': (props.error || props.hint) ? id + 'm' : undefined,
          onChange: props.onChange ? function (e) { props.onChange(e.target.value, e); } : undefined
        }),
        props.suffix ? h('span', { className: 'pt-field-suffix' }, props.suffix) : null),
      props.error ? h('div', { className: 'pt-field-msg', id: id + 'm' }, h(Icon, { name: 'alert', size: 14, strokeWidth: 2 }), props.error)
        : props.hint ? h('div', { className: 'pt-field-hint', id: id + 'm' }, props.hint) : null
    );
  }

  function ProgressRing(props) {
    var rings = props.rings || [];
    var size = props.size || 132;
    var t = props.thickness || Math.round(size * 0.11);
    var gap = 2;
    var c = size / 2;
    var summary = rings.map(function (r) { return (r.label || r.app) + ' ' + Math.round((r.value || 0) * 100) + ' %'; }).join(', ');
    var fig = h('div', { className: 'pt-rings-fig', style: { width: size, height: size }, role: 'img', 'aria-label': summary },
      h('svg', { width: size, height: size, viewBox: '0 0 ' + size + ' ' + size },
        rings.map(function (r, i) {
          var rad = c - t / 2 - i * (t + gap);
          var len = 2 * Math.PI * rad;
          var v = Math.max(0, Math.min(1, r.value || 0));
          return h('g', { key: i, className: 'pt-app-' + (r.app || 'portail') },
            h('circle', { className: 'pt-ring-track', cx: c, cy: c, r: rad, strokeWidth: t }),
            v > 0 ? h('circle', { className: 'pt-ring-bar', cx: c, cy: c, r: rad, strokeWidth: t, strokeLinecap: 'round',
              strokeDasharray: len, strokeDashoffset: len * (1 - v) }) : null);
        })),
      props.center ? h('div', { className: 'pt-rings-center', 'aria-hidden': 'true' },
        h('b', null, props.center.value), props.center.label ? h('span', null, props.center.label) : null) : null
    );
    var legend = props.legend === false || rings.length < 2 ? null : h('ul', { className: 'pt-legend' }, rings.map(function (r, i) {
      return h('li', { key: i, className: 'pt-app-' + (r.app || 'portail') },
        h('i', { 'aria-hidden': 'true' }),
        h('span', { className: 'pt-legend-name' }, r.label),
        h('span', { className: 'pt-legend-val' }, r.display != null ? r.display : Math.round((r.value || 0) * 100) + ' %'));
    }));
    return h('div', { className: cx('pt-root', 'pt-rings', props.className) }, fig, legend);
  }

  function BarChart(props) {
    var data = props.data || [];
    var height = props.height || 140;
    var fmt = props.format || function (v) { return String(v); };
    var max = props.max || Math.max.apply(null, data.map(function (d) { return d.value; }).concat([props.goal || 0, 1]));
    var hl = props.highlight;
    return h('figure', { className: cx('pt-root', 'pt-bars', 'pt-app-' + (props.app || 'portail'), props.className), style: { margin: 0 } },
      h('div', { className: 'pt-bars-plot', style: { height: height }, 'aria-hidden': 'true' },
        data.map(function (d, i) {
          var pct = Math.max(0, d.value) / max * 100;
          return h('div', { key: i, className: cx('pt-bars-col', i === hl && 'is-hl'), style: { '--h': pct + '%' } },
            h('span', { className: 'pt-bars-tip' }, d.label + ' · ' + fmt(d.value)),
            h('span', { className: 'pt-bars-bar', style: { height: pct + '%' } }));
        }),
        props.goal ? h('div', { className: 'pt-bars-goal', style: { bottom: (props.goal / max * 100) + '%' } },
          h('span', null, props.goalLabel || 'Objectif ' + fmt(props.goal))) : null
      ),
      h('div', { className: 'pt-bars-x', 'aria-hidden': 'true' }, data.map(function (d, i) {
        return h('span', { key: i, className: i === hl ? 'is-hl' : undefined }, d.label);
      })),
      h('table', { className: 'pt-sr' },
        props.title ? h('caption', null, props.title) : null,
        h('tbody', null, data.map(function (d, i) { return h('tr', { key: i }, h('th', null, d.label), h('td', null, fmt(d.value))); })))
    );
  }

  function Menu(props) {
    var items = props.items || [];
    var selecting = props.value !== undefined || props.defaultValue !== undefined;
    var vs = React.useState(props.defaultValue);
    var value = props.value !== undefined ? props.value : vs[0];
    var os = React.useState(!!props.defaultOpen);
    var open = os[0], setOpen = os[1];
    var rootRef = React.useRef(null), btnRef = React.useRef(null), listRef = React.useRef(null), byUser = React.useRef(false);
    var uid = 'ptm' + React.useId().replace(/[^A-Za-z0-9]/g, '');
    var small = props.size === 'small';
    var current = null;
    items.forEach(function (it) { if (it.id === value) current = it; });

    function focusables() { return listRef.current ? Array.prototype.slice.call(listRef.current.querySelectorAll('[role^="menuitem"]:not([aria-disabled="true"])')) : []; }
    function close(back) { setOpen(false); if (back && btnRef.current) btnRef.current.focus(); }
    function choose(it) {
      if (it.disabled) return;
      if (selecting) { if (props.value === undefined) vs[1](it.id); if (props.onChange) props.onChange(it.id); }
      if (it.onSelect) it.onSelect();
      if (props.onSelect) props.onSelect(it.id);
      close(!it.href); /* un lien change de page : pas de retour du focus sur le bouton */
    }

    React.useEffect(function () {
      if (!open) return;
      var els = focusables();
      var sel = listRef.current && listRef.current.querySelector('[aria-checked="true"]');
      if (byUser.current && (sel || els[0])) (sel || els[0]).focus();
      function onDown(e) { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); }
      document.addEventListener('mousedown', onDown);
      document.addEventListener('touchstart', onDown);
      return function () { document.removeEventListener('mousedown', onDown); document.removeEventListener('touchstart', onDown); };
    }, [open]);

    function onListKey(e) {
      var els = focusables(), i = els.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); els[(i + 1) % els.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); els[(i - 1 + els.length) % els.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); els[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); els[els.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') { close(false); }
    }
    function onBtnKey(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); byUser.current = true; setOpen(true); }
    }

    var label = selecting ? (current ? current.label : (props.placeholder || 'Choisir')) : props.label;
    var trigger = props.iconOnly
      ? h('button', { ref: btnRef, type: 'button', className: cx('pt-gbtn', 'pt-glass', 'pt-gbtn-icon', small && 'pt-gbtn-small'),
          'aria-label': props.label, 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': uid,
          onClick: function () { byUser.current = true; setOpen(!open); }, onKeyDown: onBtnKey },
          h(Icon, { name: props.icon || 'more', size: small ? 16 : 22 }))
      : h('button', { ref: btnRef, type: 'button', className: cx('pt-btn', 'pt-btn-' + (props.variant || 'gray'), 'pt-menu-trigger', small && 'pt-btn-small'),
          'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': uid,
          onClick: function () { byUser.current = true; setOpen(!open); }, onKeyDown: onBtnKey },
          (current && current.icon) || props.icon ? h(Icon, { name: (current && current.icon) || props.icon, size: small ? 15 : 18, strokeWidth: 2 }) : null,
          h('span', { className: 'pt-label' }, label),
          h(Icon, { name: 'updown', size: small ? 12 : 14, strokeWidth: 2.4, className: 'pt-menu-caret' }));

    var list = open ? h('div', {
      id: uid, ref: listRef, role: 'menu', 'aria-label': props.label || label,
      className: cx('pt-menu', 'pt-glass-thick', small && 'pt-menu-small', props.align === 'end' && 'pt-menu-end'),
      onKeyDown: onListKey
    }, items.map(function (it, i) {
      if (it.divider) return h('div', { key: 'd' + i, className: 'pt-menu-sep', role: 'separator' });
      if (it.section) return h('div', { key: 's' + i, className: 'pt-menu-section' }, it.section);
      var checked = selecting && it.id === value;
      var asLink = it.href && !it.disabled;
      return h(asLink ? linkTag(props) : 'button', {
        key: it.id, type: asLink ? undefined : 'button', href: asLink ? it.href : undefined, tabIndex: -1,
        role: selecting ? 'menuitemradio' : 'menuitem',
        'aria-checked': selecting ? String(checked) : undefined,
        'aria-disabled': it.disabled ? 'true' : undefined,
        className: cx('pt-menu-item', it.destructive && 'is-danger', it.app && 'pt-app-' + it.app),
        onClick: function () { choose(it); }
      },
        selecting ? h('span', { className: 'pt-menu-check', 'aria-hidden': 'true' }, checked ? h(Icon, { name: 'check', size: small ? 13 : 16, strokeWidth: 2.6 }) : null) : null,
        h('span', { className: 'pt-menu-text' }, h('span', { className: 'pt-label' }, it.label),
          it.hint ? h('span', { className: 'pt-menu-hint' }, it.hint) : null),
        it.app && !it.icon ? h(AppIcon, { app: it.app, size: small ? 16 : 22 }) :
        it.icon ? h(Icon, { name: it.icon, size: small ? 15 : 20, strokeWidth: 2 }) : null,
        it.shortcut ? h('kbd', { className: 'pt-menu-kbd' }, it.shortcut) : null
      );
    })) : null;

    return h('div', { ref: rootRef, className: cx('pt-root', 'pt-menu-wrap', 'pt-app-' + (props.app || 'portail'), props.className) }, trigger, list);
  }

  /* ——— Contrôles ——— */
  function SegmentedControl(props) {
    var items = props.items || [];
    var st = React.useState(props.defaultValue != null ? props.defaultValue : (items[0] && items[0].id));
    var value = props.value != null ? props.value : st[0];
    var idx = Math.max(0, items.findIndex(function (it) { return it.id === value; }));
    var refs = React.useRef([]);
    function pick(i, focus) {
      var it = items[i]; if (!it) return;
      if (props.value == null) st[1](it.id);
      if (props.onChange) props.onChange(it.id);
      if (focus && refs.current[i]) refs.current[i].focus();
    }
    function onKey(e) {
      var n = items.length;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick((idx + 1) % n, true); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick((idx - 1 + n) % n, true); }
      else if (e.key === 'Home') { e.preventDefault(); pick(0, true); }
      else if (e.key === 'End') { e.preventDefault(); pick(n - 1, true); }
    }
    return h('div', {
      role: 'radiogroup', 'aria-label': props.label,
      className: cx('pt-root', 'pt-seg', props.size === 'small' && 'pt-seg-small', props.size === 'auto' && 'pt-seg-auto', props.full && 'pt-seg-full', 'pt-app-' + (props.app || 'portail'), props.className),
      style: { '--n': items.length, '--i': idx }, onKeyDown: onKey
    },
      h('span', { className: 'pt-seg-thumb', 'aria-hidden': 'true' }),
      items.map(function (it, i) {
        return h('button', {
          key: it.id, ref: function (el) { refs.current[i] = el; }, type: 'button', role: 'radio',
          'aria-checked': i === idx ? 'true' : 'false', tabIndex: i === idx ? 0 : -1,
          className: 'pt-seg-item', onClick: function () { pick(i, false); }
        }, it.icon ? h(Icon, { name: it.icon, size: props.size === 'small' ? 14 : 17, strokeWidth: 2, label: it.label }) : h('span', { className: 'pt-label' }, it.label));
      })
    );
  }

  function Toggle(props) {
    var st = React.useState(!!props.defaultChecked);
    var on = props.checked != null ? props.checked : st[0];
    var rid = 'ptt' + React.useId().replace(/[^A-Za-z0-9]/g, '');
    function flip() {
      if (props.disabled) return;
      if (props.checked == null) st[1](!on);
      if (props.onChange) props.onChange(!on);
    }
    var sw = h('button', {
      id: rid, type: 'button', role: 'switch', 'aria-checked': on ? 'true' : 'false',
      'aria-label': props.label ? undefined : props.ariaLabel, 'aria-labelledby': props.label ? rid + 'l' : undefined,
      'aria-disabled': props.disabled ? 'true' : undefined,
      className: cx('pt-switch', props.size === 'small' && 'pt-switch-small', props.app ? 'pt-app-' + props.app : 'pt-switch-default'),
      onClick: flip
    }, h('span', { className: 'pt-switch-knob' }));
    if (!props.label) return h('span', { className: cx('pt-root', props.className) }, sw);
    return h('div', { className: cx('pt-root', 'pt-toggle-row', props.size === 'small' && 'pt-toggle-row-small', props.className) },
      h('span', { className: 'pt-toggle-text' },
        h('span', { id: rid + 'l', className: 'pt-toggle-label', onClick: flip }, props.label),
        props.hint ? h('span', { className: 'pt-toggle-hint' }, props.hint) : null),
      sw);
  }

  var FR_DAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  var FR_DAYS_LONG = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }

  function Calendar(props) {
    var value = props.value ? startOfDay(props.value) : null;
    var today = startOfDay(props.today || new Date());
    var fs = React.useState(value || today);
    var focus = fs[0], setFocus = fs[1];
    var gridRef = React.useRef(null);
    var month = new Date(focus.getFullYear(), focus.getMonth(), 1);
    var offset = (month.getDay() + 6) % 7;
    var start = addDays(month, -offset);
    var days = [];
    for (var i = 0; i < 42; i++) days.push(addDays(start, i));
    if (days[35].getMonth() !== month.getMonth()) days = days.slice(0, 35);
    var title = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(month);
    var full = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    function inRange(d) { return !(props.min && d < startOfDay(props.min)) && !(props.max && d > startOfDay(props.max)); }
    function moveMonth(n) { var d = new Date(focus); d.setDate(1); d.setMonth(d.getMonth() + n); var last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(focus.getDate(), last)); setFocus(d); }
    React.useEffect(function () {
      if (props.autoFocus && gridRef.current) { var el = gridRef.current.querySelector('[tabindex="0"]'); if (el) el.focus(); }
    }, [focus.getTime()]);
    function onKey(e) {
      var map = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
      if (map[e.key] != null) { e.preventDefault(); setFocus(addDays(focus, map[e.key])); }
      else if (e.key === 'PageDown') { e.preventDefault(); moveMonth(1); }
      else if (e.key === 'PageUp') { e.preventDefault(); moveMonth(-1); }
      else if (e.key === 'Home') { e.preventDefault(); setFocus(addDays(focus, -((focus.getDay() + 6) % 7))); }
      else if (e.key === 'End') { e.preventDefault(); setFocus(addDays(focus, 6 - (focus.getDay() + 6) % 7)); }
    }
    return h('div', { className: cx('pt-cal', 'pt-app-' + (props.app || 'portail')) },
      h('div', { className: 'pt-cal-head' },
        h('span', { className: 'pt-cal-title', 'aria-live': 'polite' }, title.charAt(0).toUpperCase() + title.slice(1)),
        h('button', { type: 'button', className: 'pt-cal-nav', 'aria-label': 'Mois précédent', onClick: function () { moveMonth(-1); } }, h(Icon, { name: 'chevron', size: 18, strokeWidth: 2.4, className: 'pt-flip' })),
        h('button', { type: 'button', className: 'pt-cal-nav', 'aria-label': 'Mois suivant', onClick: function () { moveMonth(1); } }, h(Icon, { name: 'chevron', size: 18, strokeWidth: 2.4 }))),
      h('div', { className: 'pt-cal-grid', role: 'grid', 'aria-label': title, ref: gridRef, onKeyDown: onKey },
        FR_DAYS.map(function (d, i) { return h('span', { key: 'h' + i, className: 'pt-cal-dow', role: 'columnheader', 'aria-label': FR_DAYS_LONG[i] }, d); }),
        days.map(function (d) {
          var out = d.getMonth() !== month.getMonth(), sel = sameDay(d, value), tod = sameDay(d, today), ok = inRange(d);
          return h('button', {
            key: d.getTime(), type: 'button', role: 'gridcell',
            tabIndex: sameDay(d, focus) ? 0 : -1,
            'aria-selected': sel ? 'true' : undefined, 'aria-current': tod ? 'date' : undefined,
            'aria-disabled': ok ? undefined : 'true', 'aria-label': full.format(d),
            className: cx('pt-cal-day', out && 'is-out', sel && 'is-sel', tod && 'is-today'),
            onClick: function () { if (!ok) return; setFocus(d); if (props.onChange) props.onChange(d); }
          }, d.getDate());
        }))
    );
  }

  function DatePicker(props) {
    var st = React.useState(props.defaultValue || null);
    var value = props.value !== undefined ? props.value : st[0];
    var os = React.useState(!!props.defaultOpen);
    var open = os[0], setOpen = os[1];
    var rootRef = React.useRef(null), btnRef = React.useRef(null), byUser = React.useRef(false);
    var small = props.size === 'small';
    var fmt = new Intl.DateTimeFormat('fr-FR', props.format || { day: 'numeric', month: 'short', year: 'numeric' });
    var uid = 'ptd' + React.useId().replace(/[^A-Za-z0-9]/g, '');
    function set(d) { if (props.value === undefined) st[1](d); if (props.onChange) props.onChange(d); setOpen(false); if (btnRef.current) btnRef.current.focus(); }
    React.useEffect(function () {
      if (!open || props.inline) return;
      function onDown(e) { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); }
      function onEsc(e) { if (e.key === 'Escape') { setOpen(false); if (btnRef.current) btnRef.current.focus(); } }
      document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onEsc);
      return function () { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onEsc); };
    }, [open]);
    if (props.inline) return h('div', { className: cx('pt-root', 'pt-datepicker-inline', props.className) },
      h(Calendar, { value: value, today: props.today, min: props.min, max: props.max, app: props.app, onChange: function (d) { if (props.value === undefined) st[1](d); if (props.onChange) props.onChange(d); } }));
    var trigger = h('button', {
      ref: btnRef, type: 'button', className: cx('pt-date-btn', small && 'pt-date-btn-small', open && 'is-open'),
      'aria-haspopup': 'dialog', 'aria-expanded': open, 'aria-controls': uid,
      'aria-label': (props.label ? props.label + ' : ' : '') + (value ? fmt.format(value) : (props.placeholder || 'Choisir une date')),
      onClick: function () { byUser.current = true; setOpen(!open); }
    }, h('span', { className: 'pt-label' }, value ? fmt.format(value) : (props.placeholder || 'Choisir')));
    return h('div', { ref: rootRef, className: cx('pt-root', 'pt-datepicker', 'pt-app-' + (props.app || 'portail'), props.className) },
      props.label ? h('span', { className: 'pt-date-label' }, props.label) : null,
      h('div', { className: 'pt-date-anchor' }, trigger,
        open ? h('div', { id: uid, role: 'dialog', 'aria-label': props.label || 'Calendrier', className: cx('pt-date-pop', 'pt-glass-thick', props.align === 'end' && 'pt-menu-end') },
          h(Calendar, { value: value, today: props.today, min: props.min, max: props.max, app: props.app, autoFocus: byUser.current, onChange: set })) : null)
    );
  }

  /* ——— Structure d'écran ——— */
  function scrollParent(el) {
    var p = el && el.parentElement;
    while (p && p !== document.body) {
      var o = getComputedStyle(p).overflowY;
      if (o === 'auto' || o === 'scroll') return p;
      p = p.parentElement;
    }
    return window;
  }

  function AppHeader(props) {
    var mac = props.platform === 'mac';
    var cs = React.useState(false);
    var collapsed = cs[0], setCollapsed = cs[1];
    var rootRef = React.useRef(null), bigRef = React.useRef(null);
    React.useEffect(function () {
      var sp = scrollParent(rootRef.current);
      function check() {
        var top = sp === window ? window.scrollY : sp.scrollTop;
        if (mac) { setCollapsed(top > 4); return; }
        var big = bigRef.current;
        var limit = big ? big.offsetTop + big.offsetHeight - 52 : 40;
        setCollapsed(top > limit);
      }
      check();
      sp.addEventListener('scroll', check, { passive: true });
      return function () { sp.removeEventListener('scroll', check); };
    }, []);
    var actions = (props.actions || []).map(function (a, i) {
      return h(a.menu ? Menu : GlassButton, Object.assign({ key: i, size: mac ? 'small' : undefined, app: a.prominent ? props.app : undefined, linkAs: props.linkAs }, a.menu ? a.menu : a), a.children);
    });
    var back = props.back ? h(GlassButton, { icon: 'back', label: props.back.label || 'Retour', size: mac ? 'small' : undefined, onClick: props.back.onClick, href: props.back.href, linkAs: props.linkAs }) : null;
    if (mac) {
      return h('header', { ref: rootRef, className: cx('pt-root', 'pt-hdr', 'pt-hdr-mac', collapsed && 'is-collapsed', 'pt-app-' + (props.app || 'portail'), props.className) },
        h('div', { className: 'pt-hdr-bar' },
          back,
          h('div', { className: 'pt-hdr-mac-titles' },
            h('h1', { className: 'pt-hdr-mac-title' }, props.title),
            props.subtitle ? h('p', { className: 'pt-hdr-mac-sub' }, props.subtitle) : null),
          props.center || null,
          h('div', { className: 'pt-hdr-actions' }, props.trailing || null, actions)));
    }
    return h(React.Fragment, null,
      h('header', { ref: rootRef, className: cx('pt-root', 'pt-hdr', 'pt-hdr-ios', collapsed && 'is-collapsed', 'pt-app-' + (props.app || 'portail'), props.className) },
        h('div', { className: 'pt-hdr-bar' },
          h('div', { className: 'pt-hdr-side' }, back),
          h('div', { className: 'pt-hdr-small', 'aria-hidden': collapsed ? undefined : 'true' }, props.title),
          h('div', { className: 'pt-hdr-side pt-hdr-actions' }, props.trailing || null, actions))),
      h('div', { ref: bigRef, className: cx('pt-root', 'pt-hdr-big', 'pt-app-' + (props.app || 'portail')) },
        props.eyebrow ? h('div', { className: 'pt-hdr-eyebrow' }, props.eyebrow) : null,
        h('h1', { className: 'pt-hdr-title' }, props.title),
        props.subtitle ? h('p', { className: 'pt-hdr-sub' }, props.subtitle) : null)
    );
  }

  function Sheet(props) {
    var open = !!props.open;
    var mq = React.useState(function () { return typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(min-width: 768px)').matches : false; });
    var mac = props.platform ? props.platform === 'mac' : mq[0];
    var panelRef = React.useRef(null), lastFocus = React.useRef(null);
    var uid = 'pts' + React.useId().replace(/[^A-Za-z0-9]/g, '');
    React.useEffect(function () {
      if (props.platform || !window.matchMedia) return;
      var m = window.matchMedia('(min-width: 768px)');
      function on() { mq[1](m.matches); }
      m.addEventListener ? m.addEventListener('change', on) : m.addListener(on);
      return function () { m.removeEventListener ? m.removeEventListener('change', on) : m.removeListener(on); };
    }, []);
    React.useEffect(function () {
      if (!open) return;
      lastFocus.current = document.activeElement;
      var p = panelRef.current;
      if (p && !props.noAutoFocus) {
        var f = p.querySelector('[data-autofocus]') || p.querySelector('input') || p.querySelector('button:not(.pt-sheet-close)');
        (f || p).focus();
      }
      function onKey(e) {
        if (e.key === 'Escape') { e.stopPropagation(); if (props.onClose) props.onClose(); }
        if (e.key === 'Tab' && p) {
          var els = Array.prototype.slice.call(p.querySelectorAll('button:not([disabled]), input, select, textarea, [tabindex="0"]'));
          if (!els.length) return;
          var first = els[0], last = els[els.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      document.addEventListener('keydown', onKey, true);
      return function () {
        document.removeEventListener('keydown', onKey, true);
        if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
      };
    }, [open]);
    if (!open) return null;
    var pa = props.primaryAction;
    var close = function () { if (props.onClose) props.onClose(); };
    var head = mac
      ? h('div', { className: 'pt-sheet-head pt-sheet-head-mac' }, h('h2', { id: uid, className: 'pt-sheet-title' }, props.title))
      : h('div', { className: 'pt-sheet-head' },
          h(GlassButton, { icon: 'x', label: props.cancelLabel || 'Annuler', onClick: close, className: 'pt-sheet-close' }),
          h('h2', { id: uid, className: 'pt-sheet-title' }, props.title),
          pa ? h(GlassButton, { icon: 'check', label: pa.label, prominent: true, app: props.app, onClick: pa.onClick }) : h('span', { style: { width: 44 } }));
    var foot = mac ? h('div', { className: 'pt-sheet-foot' },
      h(Button, { variant: 'gray', size: 'small', onClick: close }, props.cancelLabel || 'Annuler'),
      pa ? h(Button, { variant: 'filled', size: 'small', app: props.app, onClick: pa.onClick }, pa.label) : null) : null;
    var layer = h('div', { className: cx('pt-root', 'pt-sheet-layer', props.contained && 'is-contained', mac ? 'is-mac' : 'is-ios', 'pt-app-' + (props.app || 'portail')) },
      h('div', { className: 'pt-sheet-dim', onClick: props.dismissible === false ? undefined : close }),
      h('div', {
        ref: panelRef, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': uid, tabIndex: -1,
        className: cx('pt-sheet', props.detent === 'large' && 'is-large', props.className)
      },
        mac ? null : h('div', { className: 'pt-sheet-grabber', 'aria-hidden': 'true' }),
        head,
        h('div', { className: 'pt-sheet-body' }, props.children),
        foot));
    /* À la racine du document (portail React) : jamais coupée par un conteneur qui défile,
       ni sous une barre collante. La classe pt-app-<app> est recopiée sur la couche. */
    var RD = window.ReactDOM;
    if (props.contained || !RD || !RD.createPortal || typeof document === 'undefined') return layer;
    return RD.createPortal(layer, document.body);
  }

  /* ——— Graphique en courbe ——— */
  function LineChart(props) {
    var data = props.data || [];
    var height = props.height || 160;
    var fmt = props.format || function (v) { return String(v); };
    var uid = 'ptl' + React.useId().replace(/[^A-Za-z0-9]/g, '');
    var hs = React.useState(null);
    var hover = hs[0], setHover = hs[1];
    var plotRef = React.useRef(null);
    var vals = data.map(function (d) { return d.value; });
    var lo = props.min != null ? props.min : Math.min.apply(null, vals);
    var hi = props.max != null ? props.max : Math.max.apply(null, vals);
    if (props.goal != null) { lo = Math.min(lo, props.goal); hi = Math.max(hi, props.goal); }
    var pad = (hi - lo) * 0.12 || 1;
    if (props.min == null) lo -= pad;
    if (props.max == null) hi += pad;
    var n = data.length;
    function X(i) { return n < 2 ? 50 : (i / (n - 1)) * 100; }
    function Y(v) { return 100 - ((v - lo) / (hi - lo)) * 100; }
    var line = data.map(function (d, i) { return (i ? 'L' : 'M') + X(i).toFixed(3) + ' ' + Y(d.value).toFixed(3); }).join(' ');
    var area = line + ' L100 100 L0 100 Z';
    var last = n - 1;
    var shown = hover != null ? hover : (props.highlight != null ? props.highlight : last);
    function onMove(e) {
      var r = plotRef.current.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      setHover(Math.max(0, Math.min(n - 1, Math.round(x * (n - 1)))));
    }
    var every = props.labelEvery || Math.max(1, Math.ceil((n - 1) / 4));
    var ticks = props.ticks || [hi - pad, (hi + lo) / 2, lo + pad];
    return h('figure', { className: cx('pt-root', 'pt-line', 'pt-app-' + (props.app || 'portail'), props.className), style: { margin: 0 } },
      h('div', {
        className: 'pt-line-plot', ref: plotRef, style: { height: height },
        onPointerMove: onMove, onPointerLeave: function () { setHover(null); }, 'aria-hidden': 'true'
      },
        ticks.map(function (t, i) {
          return h('div', { key: 'g' + i, className: 'pt-line-grid', style: { top: Y(t) + '%' } }, h('span', null, fmt(Math.round(t))));
        }),
        props.goal != null ? h('div', { className: 'pt-bars-goal', style: { bottom: (100 - Y(props.goal)) + '%' } }, h('span', null, props.goalLabel || 'Objectif ' + fmt(props.goal))) : null,
        h('svg', { className: 'pt-line-svg', viewBox: '0 0 100 100', preserveAspectRatio: 'none' },
          h('defs', null, h('linearGradient', { id: uid, x1: 0, y1: 0, x2: 0, y2: 1 },
            h('stop', { offset: 0, style: { stopColor: 'var(--app)', stopOpacity: 0.28 } }),
            h('stop', { offset: 1, style: { stopColor: 'var(--app)', stopOpacity: 0 } }))),
          props.area === false ? null : h('path', { d: area, fill: 'url(#' + uid + ')' }),
          h('path', { d: line, className: 'pt-line-path', vectorEffect: 'non-scaling-stroke' })),
        hover != null ? h('div', { className: 'pt-line-cross', style: { left: X(hover) + '%' } }) : null,
        n ? h('div', { className: 'pt-line-dot', style: { left: X(shown) + '%', top: Y(data[shown].value) + '%' } }) : null,
        n ? h('div', { className: cx('pt-line-tip', X(shown) > 70 && 'is-left', X(shown) < 30 && 'is-right'), style: { left: X(shown) + '%', top: Y(data[shown].value) + '%' } },
          h('b', null, fmt(data[shown].value)), h('span', null, data[shown].label)) : null
      ),
      h('div', { className: 'pt-line-x', 'aria-hidden': 'true' }, data.map(function (d, i) {
        var show = i === last || (i % every === 0 && last - i >= every * 0.75);
        return show ? h('span', { key: i, className: i === 0 ? 'is-first' : i === last ? 'is-last' : undefined, style: { left: X(i) + '%' } }, d.label) : null;
      })),
      h('table', { className: 'pt-sr' },
        props.title ? h('caption', null, props.title) : null,
        h('tbody', null, data.map(function (d, i) { return h('tr', { key: i }, h('th', null, d.label), h('td', null, fmt(d.value))); })))
    );
  }


  /* ——— Select : liste déroulante (à la place du <select> natif) ——— */
  var SELECT_DESKTOP = '(min-width: 768px)';
  function Select(props) {
    var options = props.options || [];
    var vs = React.useState(props.defaultValue != null ? String(props.defaultValue) : '');
    var current = props.value !== undefined ? (props.value == null ? '' : String(props.value)) : vs[0];
    var selected = null;
    options.forEach(function (o) { if (String(o.value) === current) selected = o; });
    var os = React.useState(!!props.defaultOpen), open = os[0], setOpen = os[1];
    var as = React.useState(function () {
      var k = -1; options.forEach(function (o, i) { if (String(o.value) === current) k = i; }); return k;
    }), activeI = as[0], setActive = as[1];
    var ss = React.useState(function () { return isSmall(); }), small = ss[0], setSmall = ss[1];
    var pls = React.useState({}), place = pls[0], setPlace = pls[1];
    var btnRef = React.useRef(null), listRef = React.useRef(null), typed = React.useRef({ text: '', at: 0 });
    var uid = 'ptsel' + React.useId().replace(/[^A-Za-z0-9]/g, '');
    var cell = props.variant === 'cell';

    function textOf(o) { return typeof o.label === 'string' || typeof o.label === 'number' ? String(o.label) : String(o.value); }
    function enabledIndex(from, step) {
      for (var i = from; i >= 0 && i < options.length; i += step) if (!options[i].disabled) return i;
      return -1;
    }
    function isSmall() {
      if (props.size === 'small') return true;
      if (props.size === 'regular') return false;
      return typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(SELECT_DESKTOP).matches : false;
    }
    function show() {
      if (props.disabled) return;
      var i = -1;
      options.forEach(function (o, k) { if (String(o.value) === current) i = k; });
      setActive(i >= 0 ? i : enabledIndex(0, 1));
      setSmall(isSmall());
      setOpen(true);
    }
    function close(back) {
      setOpen(false);
      if (back !== false && btnRef.current) btnRef.current.focus({ preventScroll: true });
    }
    function choose(i) {
      var o = options[i];
      if (!o || o.disabled) return;
      var v = String(o.value);
      if (v !== current) {
        if (props.value === undefined) vs[1](v);
        if (props.onChange) props.onChange(v);
      }
      close();
    }

    /* Sous le champ, ou au-dessus s'il manque de place ; la liste suit le défilement */
    React.useLayoutEffect(function () {
      if (!open) return;
      function placeList() {
        var b = btnRef.current;
        if (!b) return;
        var r = b.getBoundingClientRect(), margin = 12;
        var below = window.innerHeight - r.bottom - margin, above = r.top - margin;
        var up = below < 220 && above > below;
        var maxHeight = Math.max(160, Math.min(360, up ? above : below) - 6);
        var width = Math.min(Math.max(r.width, small ? 200 : 240), window.innerWidth - 2 * margin);
        var left = Math.min(Math.max(margin, r.left), window.innerWidth - width - margin);
        var st = { position: 'fixed', left: left + 'px', right: 'auto', width: width + 'px', maxWidth: 'none', maxHeight: maxHeight + 'px', zIndex: 120,
          transformOrigin: up ? 'bottom left' : 'top left' };
        if (up) { st.top = 'auto'; st.bottom = (window.innerHeight - r.top + 6) + 'px'; }
        else { st.top = (r.bottom + 6) + 'px'; st.bottom = 'auto'; }
        setPlace(st);
      }
      placeList();
      window.addEventListener('resize', placeList);
      window.addEventListener('scroll', placeList, true);
      return function () { window.removeEventListener('resize', placeList); window.removeEventListener('scroll', placeList, true); };
    }, [open, small]);

    /* Clic ou toucher en dehors : fermeture */
    React.useEffect(function () {
      if (!open) return;
      function onDown(e) {
        var t = e.target;
        if ((listRef.current && listRef.current.contains(t)) || (btnRef.current && btnRef.current.contains(t))) return;
        close(false);
      }
      document.addEventListener('pointerdown', onDown, true);
      return function () { document.removeEventListener('pointerdown', onDown, true); };
    }, [open]);

    /* Choix actif visible */
    React.useEffect(function () {
      if (!open || !listRef.current) return;
      var el = listRef.current.querySelector('[data-index="' + activeI + '"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    }, [open, activeI]);

    function onKey(e) {
      if (props.disabled) return;
      function move(i) { e.preventDefault(); if (i >= 0) setActive(i); }
      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
        return;
      }
      if (e.key === 'ArrowDown') move(enabledIndex(activeI + 1, 1));
      else if (e.key === 'ArrowUp') move(enabledIndex(activeI - 1, -1));
      else if (e.key === 'Home') move(enabledIndex(0, 1));
      else if (e.key === 'End') move(enabledIndex(options.length - 1, -1));
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(activeI); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } /* ne ferme pas la Sheet autour */
      else if (e.key === 'Tab') close(false);
      else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        var now = Date.now();
        typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : '') + e.key.toLocaleLowerCase('fr-FR'), at: now };
        var found = -1;
        options.forEach(function (o, k) { if (found < 0 && !o.disabled && textOf(o).toLocaleLowerCase('fr-FR').indexOf(typed.current.text) === 0) found = k; });
        if (found >= 0) setActive(found);
      }
    }

    var appCls = 'pt-app-' + (props.app || 'portail');
    var listEl = open ? h('div', {
      ref: listRef, id: uid, role: 'listbox', 'aria-label': props['aria-label'] || props.label,
      className: cx('pt-root', appCls, 'pt-menu', 'pt-glass-thick', 'pt-select-list', small && 'pt-menu-small'),
      style: place
    }, options.map(function (o, i) {
      var checked = String(o.value) === current;
      return h('div', {
        key: String(o.value) + '-' + i, id: uid + '-' + i, 'data-index': i, role: 'option',
        'aria-selected': checked ? 'true' : 'false', 'aria-disabled': o.disabled ? 'true' : undefined,
        className: cx('pt-menu-item', i === activeI && 'is-active'),
        onPointerEnter: function () { if (!o.disabled) setActive(i); },
        onPointerDown: function (e) { e.preventDefault(); }, /* le focus reste sur le champ */
        onClick: function () { choose(i); }
      },
        h('span', { className: 'pt-menu-check', 'aria-hidden': 'true' }, checked ? h(Icon, { name: 'check', size: small ? 13 : 16, strokeWidth: 2.6 }) : null),
        h('span', { className: 'pt-menu-text' }, h('span', { className: 'pt-select-optlabel' }, o.label)));
    })) : null;
    var RD = window.ReactDOM;
    var portal = listEl && RD && RD.createPortal && typeof document !== 'undefined' ? RD.createPortal(listEl, document.body) : listEl;

    return h(React.Fragment, null,
      h('button', {
        ref: btnRef, id: props.id, type: 'button', role: 'combobox',
        'aria-haspopup': 'listbox', 'aria-expanded': open ? 'true' : 'false',
        'aria-controls': open ? uid : undefined,
        'aria-activedescendant': open && activeI >= 0 ? uid + '-' + activeI : undefined,
        'aria-label': props['aria-label'], 'aria-invalid': props['aria-invalid'] ? 'true' : undefined,
        'aria-required': props.required ? 'true' : undefined,
        disabled: props.disabled,
        className: cx('pt-root', 'pt-select', appCls, cell && 'pt-select-cell', props.size === 'small' && 'pt-select-small', props.size === 'regular' && 'pt-select-regular', open && 'is-open', props.className),
        onClick: function () { if (open) close(); else show(); },
        onKeyDown: onKey
      },
        h('span', { className: cx('pt-select-value', !selected && 'is-placeholder') }, selected ? selected.label : (props.placeholder || 'Choisir…')),
        h(Icon, { name: 'updown', size: 14, strokeWidth: 2.4, className: 'pt-select-caret' })),
      props.name ? h('input', { type: 'hidden', name: props.name, value: current }) : null,
      portal);
  }

  window.Portail = window.Portail || {};
  Object.assign(window.Portail, {
    AppIcon: AppIcon, AppTile: AppTile, GlassButton: GlassButton,
    TabBar: TabBar, Sidebar: Sidebar, Icon: Icon,
    Card: Card, List: List, ListRow: ListRow, Button: Button, TextField: TextField,
    ProgressRing: ProgressRing, BarChart: BarChart, Menu: Menu,
    SegmentedControl: SegmentedControl, Toggle: Toggle, DatePicker: DatePicker, Calendar: Calendar,
    AppHeader: AppHeader, Sheet: Sheet, LineChart: LineChart,
    Select: Select, setLinkComponent: setLinkComponent
  });
})();
