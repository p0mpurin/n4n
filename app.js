(function () {
  "use strict";

  var STORAGE_KEY = "niche4niche-project-v2";

  var el = {
    app: document.getElementById("studio-app"),
    profileSelect: document.getElementById("profile-select"),
    btnNewProfile: document.getElementById("btn-new-profile"),
    btnDuplicateProfile: document.getElementById("btn-duplicate-profile"),
    btnDeleteProfile: document.getElementById("btn-delete-profile"),
    profileHandle: document.getElementById("profile-handle"),
    profileDisplayName: document.getElementById("profile-display-name"),
    profileBio: document.getElementById("profile-bio"),
    layoutMode: document.getElementById("layout-mode"),
    layoutMaxWidth: document.getElementById("layout-max-width"),
    layoutColumns: document.getElementById("layout-columns"),
    layoutGap: document.getElementById("layout-gap"),
    layoutPadding: document.getElementById("layout-padding"),
    layoutCardStyle: document.getElementById("layout-card-style"),
    layoutRadius: document.getElementById("layout-radius"),
    layoutAlign: document.getElementById("layout-align"),
    
    htmlBefore: document.getElementById("html-before"),
    htmlAfter: document.getElementById("html-after"),
    customCss: document.getElementById("custom-css"),
    
    publicUrl: document.getElementById("public-url"),
    preview: document.getElementById("preview"),
    
    btnOpenPublic: document.getElementById("btn-open-public"),
    btnExport: document.getElementById("btn-export"),
    importFile: document.getElementById("import-file"),
    btnReset: document.getElementById("btn-reset"),

    // Studio Layout
    blockListUi: document.getElementById("block-list-ui"),
    blockEmpty: document.getElementById("block-empty"),
    btnAddBlock: document.getElementById("btn-add-block"),
    
    tabBtnBlock: document.getElementById("tab-btn-block"),
    tabBtnGlobal: document.getElementById("tab-btn-global"),
    tabContentBlock: document.getElementById("tab-content-block"),
    tabContentGlobal: document.getElementById("tab-content-global"),

    // Config Panel
    blockConfigEmpty: document.getElementById("block-config-empty"),
    blockConfigForm: document.getElementById("block-config-form"),
    configBlockType: document.getElementById("config-block-type"),
    configBlockName: document.getElementById("config-block-name"),
    configFields: document.getElementById("config-fields"),
    btnDeleteBlock: document.getElementById("btn-delete-block"),

    // Modals
    modalBackdrop: document.getElementById("modal-backdrop"),
    modalAddBlock: document.getElementById("modal-add-block"),
    btnCloseModal: document.getElementById("btn-close-modal"),
    blockBtns: document.querySelectorAll(".block-btn")
  };

  var saveTimer = null;

  function uid(prefix) { return (prefix || "id") + "_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36); }
  function slugify(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 32) || "profile"; }
  function safeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function safeStyle(s) { return String(s || "").replace(/<\/style/gi, "<\\/style"); }
  function clampNumber(n, min, max, fallback) {
    var x = Number(n);
    if (!Number.isFinite(x)) return fallback;
    return Math.max(min, Math.min(max, x));
  }
  function defaultLayout() {
    return {
      mode: "stack",
      maxWidth: 980,
      columns: 1,
      gap: 18,
      padding: 26,
      cardStyle: "soft",
      radius: 14,
      align: "left",
    };
  }
  function ensureLayout(layout) {
    var base = defaultLayout();
    var l = layout || {};
    return {
      mode: (l.mode === "grid" || l.mode === "masonry") ? l.mode : base.mode,
      maxWidth: clampNumber(l.maxWidth, 560, 1600, base.maxWidth),
      columns: clampNumber(l.columns, 1, 3, base.columns),
      gap: clampNumber(l.gap, 0, 80, base.gap),
      padding: clampNumber(l.padding, 0, 120, base.padding),
      cardStyle: (l.cardStyle === "none" || l.cardStyle === "glass" || l.cardStyle === "solid") ? l.cardStyle : base.cardStyle,
      radius: clampNumber(l.radius, 0, 48, base.radius),
      align: l.align === "center" ? "center" : "left",
    };
  }

  function defaultCss() {
    return [
      "body {",
      "  margin: 0;",
      "  min-height: 100vh;",
      "  font-family: Inter, system-ui, sans-serif;",
      "  background: radial-gradient(circle at 5% 0%, #17122b, #0a0a0f 46%);",
      "  color: #f4f2fb;",
      "}",
      ".n4n-shell { margin: 0 auto; display: flex; flex-direction: column; }",
      ".n4n-blocks { display: grid; }",
      ".n4n-block { overflow: hidden; }",
      ".n4n-hero { text-align: center; padding: 1.5rem 0; }",
      ".n4n-hero img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 2px solid rgba(255,255,255,0.1); }",
      ".n4n-hero h1 { font-size: 2.2rem; margin: 0; letter-spacing: -0.02em; }",
      ".n4n-hero p { color: #a4a4b8; font-size: 1.1rem; margin: 0.5rem 0 0; }",
      ".n4n-text p { line-height: 1.6; color: #cfcfdf; margin: 0 0 1rem; font-size: 1.05rem; }",
      ".n4n-section-header { margin-top: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem; }",
      ".n4n-section-header h2 { margin: 0; font-size: 1.5rem; }",
      ".n4n-section-header p { color: #8e8e9e; margin: 0.4rem 0 0; }",
      ".n4n-embed iframe { width: 100%; border: 0; border-radius: 12px; display: block; background: rgba(0,0,0,0.3); }",
      ".n4n-embed-label { font-size: 0.85rem; color: #a0a0b0; margin-bottom: 0.5rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }",
      ".n4n-embed.compact iframe { max-width: 480px; }",
      ".n4n-embed-row-container .n4n-embed-row { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }",
      ".n4n-divider { border: none; height: 1px; background: rgba(255,255,255,0.1); margin: 2rem 0; }",
      ".n4n-divider.dots { background: transparent; text-align: center; position: relative; }",
      ".n4n-divider.dots::after { content: '•••'; color: rgba(255,255,255,0.2); letter-spacing: 1em; font-size: 1.5rem; }",
      ".n4n-divider.space { height: 2rem; background: transparent; margin: 0; }",
      ".n4n-link-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 0.85rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1rem; transition: transform 0.2s, background 0.2s; width: 100%; max-width: 400px; margin: 0 auto; }",
      ".n4n-link-btn.filled { background: #eaeaef; color: #0a0a0f; }",
      ".n4n-link-btn.filled:hover { background: #ffffff; transform: translateY(-2px); }",
      ".n4n-link-btn.outline { background: transparent; color: #eaeaef; border: 1px solid rgba(255,255,255,0.2); }",
      ".n4n-link-btn.outline:hover { background: rgba(255,255,255,0.05); border-color: #fff; transform: translateY(-2px); }",
      ".align-center { text-align: center; }",
      ".align-left { text-align: left; }",
      "@media (max-width: 900px) { .n4n-blocks { grid-template-columns: 1fr !important; } }"
    ].join("\n");
  }

  function createBlock(type) {
    var b = { id: uid("blk"), type: type };
    if (type === "hero") {
      b.title = "Hello!";
      b.subtitle = "Welcome to my vibe space";
      b.avatarUrl = "";
      b.align = "center";
    } else if (type === "text") {
      b.markdown = "Write something about yourself here.";
    } else if (type === "section-header") {
      b.title = "New Section";
      b.subtitle = "";
    } else if (type === "embed" || type === "embed-row") {
      b.label = "";
      b.rawInput = "";
      b.size = "normal"; // normal, compact
    } else if (type === "link-button") {
      b.text = "My Website";
      b.href = "https://";
      b.icon = "🌐";
      b.style = "filled"; // filled, outline
    } else if (type === "divider") {
      b.style = "line"; // line, dots, space
    } else if (type === "custom-html") {
      b.html = "<div>Custom HTML</div>";
    }
    return b;
  }

  function createProfile(displayName, handle) {
    var d = displayName || "Untitled profile";
    var h = slugify(handle || d);
    return {
      id: uid("pro"),
      handle: h,
      displayName: d,
      bio: "",
      htmlBefore: "",
      htmlAfter: "",
      layout: defaultLayout(),
      customCss: defaultCss(),
      blocks: [createBlock("hero")],
      selectedBlockId: null,
    };
  }

  function defaultProject() {
    var p = createProfile("purin", "purin");
    p.bio = "Personal test profile";
    p.blocks = [createBlock("hero")];
    p.blocks[0].title = "purin";
    p.blocks[0].subtitle = "Now building my own Niche4Niche layout";
    p.selectedBlockId = p.blocks[0].id;
    return { profiles: [p], activeProfileId: p.id };
  }

  var project = normalizeInitialProject(loadProject());

  function normalizeInitialProject(data) {
    if (!data || !Array.isArray(data.profiles) || data.profiles.length !== 1) return data;
    var only = data.profiles[0];
    var looksDemo = only && only.handle === "demo" && only.displayName && only.displayName.toLowerCase().indexOf("demo") >= 0;
    if (!looksDemo) return data;

    var replacement = createProfile("purin", "purin");
    replacement.bio = "Personal test profile";
    replacement.blocks[0].title = "purin";
    replacement.blocks[0].subtitle = "Testing custom layouts and unique vibe pages";
    replacement.selectedBlockId = replacement.blocks[0].id;
    return { profiles: [replacement], activeProfileId: replacement.id };
  }

  function hydrateProject(data) {
    if (!data || typeof data !== "object" || !Array.isArray(data.profiles) || !data.profiles.length) {
      return null;
    }
    var seenHandles = {};
    var profiles = data.profiles.map(function (p, idx) {
      var profile = {
        id: String(p.id || uid("pro")),
        handle: uniqueHandle(slugify((p.handle) || (p.displayName) || ("profile-" + idx)), seenHandles),
        displayName: String(p.displayName || "Untitled"),
        bio: String(p.bio || ""),
        htmlBefore: String(p.htmlBefore || ""),
        htmlAfter: String(p.htmlAfter || ""),
        layout: ensureLayout(p.layout),
        customCss: typeof p.customCss === "string" && p.customCss.trim() ? p.customCss : defaultCss(),
        blocks: [],
        selectedBlockId: null
      };

      // V2 Migration: Convert sections[] to blocks[]
      if (Array.isArray(p.sections) && p.sections.length && !Array.isArray(p.blocks)) {
        p.sections.forEach(function (sec) {
          var header = createBlock("section-header");
          header.title = sec.title;
          header.subtitle = sec.subtitle;
          profile.blocks.push(header);

          if (Array.isArray(sec.tracks)) {
            sec.tracks.forEach(function (trk) {
              if (!trk || !trk.embedSrc) return;
              var emb = createBlock("embed");
              emb.label = trk.label || "";
              emb.rawInput = trk.embedSrc; // Treat legacy URL as raw input
              profile.blocks.push(emb);
            });
          }
        });
      } else if (Array.isArray(p.blocks)) {
        // Hydrate v3 blocks
        profile.blocks = p.blocks.map(function (b) {
          return Object.assign(createBlock(b.type), b);
        });
      }

      if (!profile.blocks.length) profile.blocks = [createBlock("hero")];

      profile.selectedBlockId = String(p.selectedBlockId || profile.blocks[0].id);
      if (!profile.blocks.some(function (b) { return b.id === profile.selectedBlockId; })) {
        profile.selectedBlockId = profile.blocks[0].id;
      }

      return profile;
    });

    var actId = data.activeProfileId;
    if (!profiles.some(function (p) { return p.id === actId; })) actId = profiles[0].id;

    return { profiles: profiles, activeProfileId: actId };
  }

  function loadProject() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var hydrated = hydrateProject(JSON.parse(raw));
        if (hydrated) return hydrated;
      }
    } catch (e) { console.warn("Load failed", e); }
    return defaultProject();
  }

  function uniqueHandle(base, seen) {
    var h = base || "profile";
    var i = 1;
    while (seen[h]) { i++; h = base + "-" + i; }
    seen[h] = true;
    return h;
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveTimer = null;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); } catch (e) { }
    }, 150);
  }

  function getActiveProfile() { return project.profiles.find(function (p) { return p.id === project.activeProfileId; }) || null; }

  // ----------------------------------------------------
  // Embed Parsing Logic (from older logic but wrapped)
  // ----------------------------------------------------
  function defaultHeightForProvider(provider) {
    if (provider === "youtube") return 315;
    if (provider === "soundcloud") return 166;
    return 152;
  }
  function inferProviderFromSrc(src) {
    var s = String(src || "").toLowerCase();
    if (s.indexOf("spotify.com") >= 0) return "spotify";
    if (s.indexOf("youtube.com") >= 0 || s.indexOf("youtu.be") >= 0) return "youtube";
    if (s.indexOf("soundcloud.com") >= 0 || s.indexOf("w.soundcloud.com") >= 0) return "soundcloud";
    return "embed";
  }
  function parseSpotifyUrl(url) {
    var m = url.match(/spotify\.com\/(?:intl-\w+\/)?(track|album|playlist)\/([a-zA-Z0-9]+)/i);
    if (!m) return null;
    return { provider: "spotify", embedSrc: "https://open.spotify.com/embed/" + m[1].toLowerCase() + "/" + m[2] + "?utm_source=generator", height: m[1].toLowerCase() === "track" ? 152 : 352 };
  }
  function parseYouTubeUrl(url) {
    var u; try { u = new URL(url); } catch (e) { return null; }
    var host = u.hostname.toLowerCase(), id = "";
    if (host === "youtu.be") id = u.pathname.replace(/^\//, "").split("/")[0];
    else if (host.indexOf("youtube.com") >= 0) {
      if (u.pathname.indexOf("/watch") === 0) id = u.searchParams.get("v") || "";
      else if (u.pathname.indexOf("/shorts/") === 0) id = u.pathname.split("/")[2] || "";
      else if (u.pathname.indexOf("/embed/") === 0) id = u.pathname.split("/")[2] || "";
    }
    if (!id) return null;
    return { provider: "youtube", embedSrc: "https://www.youtube.com/embed/" + id, height: 315 };
  }
  function parseSoundCloudUrl(url) {
    var u; try { u = new URL(url); } catch (e) { return null; }
    if (u.hostname.toLowerCase().indexOf("soundcloud.com") === -1) return null;
    return { provider: "soundcloud", embedSrc: "https://w.soundcloud.com/player/?url=" + encodeURIComponent(url), height: 166 };
  }
  function parseIframeHtml(text) {
    var srcMatch = text.match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (!srcMatch) return null;
    var provider = inferProviderFromSrc(srcMatch[1]);
    var hm = text.match(/height=["']?(\d+)/i);
    return { provider: provider, embedSrc: srcMatch[1], height: hm ? Number(hm[1]) : defaultHeightForProvider(provider) };
  }

  function parseSingleLine(line) {
    var t = line.trim();
    if (!t) return null;
    var parsed = parseIframeHtml(t) || parseSpotifyUrl(t) || parseYouTubeUrl(t) || parseSoundCloudUrl(t);
    // fallback if raw user link didn't match anything specific, just try treating it as raw iframe src
    return parsed || { provider: inferProviderFromSrc(t), embedSrc: t, height: defaultHeightForProvider("embed") };
  }

  function getEmbedsFromRaw(raw) {
    var lines = (raw || "").trim().split("\n");
    return lines.map(parseSingleLine).filter(Boolean);
  }

  function buildEmbedIframe(embedData) {
    var allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    if (embedData.provider === "youtube") allow += "; accelerometer; gyroscope; web-share";
    return '<iframe src="' + safeHtml(embedData.embedSrc) + '" width="100%" height="' + embedData.height + '" frameborder="0" allow="' + allow + '" loading="lazy"></iframe>';
  }

  // ----------------------------------------------------
  // Document Builder
  // ----------------------------------------------------
  function renderBlockHtml(block) {
    var b = block;
    switch (b.type) {
      case "hero":
        var av = b.avatarUrl ? '<img src="' + safeHtml(b.avatarUrl) + '" alt="Avatar" />' : "";
        return '<div class="n4n-block n4n-hero align-' + b.align + '">' + av + '<h1>' + safeHtml(b.title) + '</h1><p>' + safeHtml(b.subtitle) + '</p></div>';
      case "text":
        var paras = safeHtml(b.markdown).split(/\n\n+/).filter(function(p){return p.trim()}).map(function(p){return "<p>"+p+"</p>"}).join("");
        return '<div class="n4n-block n4n-text">' + paras + '</div>';
      case "section-header":
        var sub = b.subtitle ? '<p>' + safeHtml(b.subtitle) + '</p>' : "";
        return '<div class="n4n-block n4n-section-header"><h2>' + safeHtml(b.title) + '</h2>' + sub + '</div>';
      case "divider":
        return '<hr class="n4n-block n4n-divider ' + b.style + '" />';
      case "embed":
        var embLabel = b.label ? '<div class="n4n-embed-label">' + safeHtml(b.label) + '</div>' : "";
        var parsedArr = getEmbedsFromRaw(b.rawInput);
        if(!parsedArr.length) return "";
        return '<div class="n4n-block n4n-embed ' + b.size + '">' + embLabel + buildEmbedIframe(parsedArr[0]) + '</div>';
      case "embed-row":
        var rowLbl = b.label ? '<div class="n4n-embed-label">' + safeHtml(b.label) + '</div>' : "";
        var parsedRow = getEmbedsFromRaw(b.rawInput);
        if(!parsedRow.length) return "";
        var frames = parsedRow.map(function(obj) { return '<div class="n4n-embed-col">' + buildEmbedIframe(obj) + '</div>'; }).join("");
        return '<div class="n4n-block n4n-embed-row-container">' + rowLbl + '<div class="n4n-embed-row">' + frames + '</div></div>';
      case "link-button":
        var iconStr = b.icon ? '<span>' + safeHtml(b.icon) + '</span>' : "";
        var alignWrap = b.style === 'filled' || b.style === 'outline' ? 'align-center' : 'align-left';
        return '<div class="n4n-block n4n-link-btn-wrap ' + alignWrap + '"><a href="' + safeHtml(b.href) + '" target="_blank" class="n4n-link-btn ' + b.style + '">' + iconStr + '<span>' + safeHtml(b.text) + '</span></a></div>';
      case "custom-html":
        return '<div class="n4n-block n4n-custom-html">' + b.html + '</div>';
    }
    return "";
  }

  function buildProfileDocument(profile) {
    var title = safeHtml(profile.displayName || profile.handle || "Niche4Niche");
    var htmlContent = profile.blocks.map(renderBlockHtml).join("\n");
    var metaDesc = profile.bio ? '<meta name="description" content="'+safeHtml(profile.bio)+'">' : "";
    var layout = ensureLayout(profile.layout);
    var columnsValue = layout.mode === "stack" ? 1 : layout.columns;
    var flow = layout.mode === "masonry" ? "dense" : "row";
    var cardStyle = layout.cardStyle;
    var shellClass = "n4n-shell align-" + layout.align;
    var blocksClass = "n4n-blocks layout-" + layout.mode + " card-" + cardStyle;
    var layoutCss = [
      ":root {",
      "  --n4n-max-width: " + layout.maxWidth + "px;",
      "  --n4n-gap: " + layout.gap + "px;",
      "  --n4n-padding: " + layout.padding + "px;",
      "  --n4n-radius: " + layout.radius + "px;",
      "  --n4n-columns: " + columnsValue + ";",
      "}",
      ".n4n-shell { max-width: var(--n4n-max-width); padding: var(--n4n-padding); gap: var(--n4n-gap); }",
      ".n4n-blocks { gap: var(--n4n-gap); grid-auto-flow: " + flow + "; grid-template-columns: repeat(var(--n4n-columns), minmax(0, 1fr)); }",
      ".n4n-block { border-radius: var(--n4n-radius); }",
      ".n4n-blocks.card-none .n4n-block { background: transparent; border: 0; padding: 0; box-shadow: none; }",
      ".n4n-blocks.card-soft .n4n-block { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 1rem 1.05rem; }",
      ".n4n-blocks.card-glass .n4n-block { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(12px); padding: 1rem 1.05rem; }",
      ".n4n-blocks.card-solid .n4n-block { background: #171722; border: 1px solid #2a2a3a; padding: 1rem 1.05rem; }",
      ".n4n-blocks.layout-stack { grid-template-columns: 1fr !important; }",
      "@media (max-width: 900px) { .n4n-shell { padding: calc(var(--n4n-padding) * 0.7); } .n4n-blocks { grid-template-columns: 1fr !important; } }"
    ].join("\n");

    return [
      "<!DOCTYPE html>",
      '<html lang="en">',
      "<head>",
      '  <meta charset="utf-8" />',
      '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
      "  <title>" + title + "</title>",
      metaDesc,
      '  <style id="n4n-layout-css">' + layoutCss + "</style>",
      '  <style id="n4n-custom-css">' + safeStyle(profile.customCss || "") + "</style>",
      "</head>",
      "<body>",
      '  <div class="' + shellClass + '">',
      "    " + (profile.htmlBefore || ""),
      '    <main class="' + blocksClass + '">' + htmlContent + "</main>",
      "    " + (profile.htmlAfter || ""),
      "  </div>",
      "</body>",
      "</html>"
    ].join("\n");
  }

  // ----------------------------------------------------
  // Studio UI
  // ----------------------------------------------------
  function switchTab(tabId) {
    [el.tabBtnBlock, el.tabBtnGlobal].forEach(function(b) { b.classList.remove("active"); });
    [el.tabContentBlock, el.tabContentGlobal].forEach(function(c) { c.classList.add("hidden"); });
    
    if (tabId === "global") {
      el.tabBtnGlobal.classList.add("active");
      el.tabContentGlobal.classList.remove("hidden");
    } else {
      el.tabBtnBlock.classList.add("active");
      el.tabContentBlock.classList.remove("hidden");
    }
  }

  function getBlockTypeInfo(type) {
    var d = {
      "hero": { icon: "🟣", label: "Hero Header" },
      "text": { icon: "📝", label: "Rich Text" },
      "section-header": { icon: "🏷️", label: "Section Header"},
      "embed": { icon: "🎵", label: "Single Embed"},
      "embed-row": { icon: "🎹", label: "Embed Row"},
      "divider": { icon: "➖", label: "Divider"},
      "link-button": { icon: "🔗", label: "Link Button"},
      "custom-html": { icon: "⚙️", label: "Custom HTML"}
    };
    return d[type] || { icon: "🧱", label: "Block" };
  }

  function getReadableBlockName(block) {
    if (block.type === "hero") return block.title;
    if (block.type === "text") return block.markdown.slice(0, 20) + "...";
    if (block.type === "section-header") return block.title;
    if (block.type === "link-button") return block.text;
    if (block.type === "embed" || block.type === "embed-row") return block.label || block.rawInput.slice(0, 20) || "Empty embed";
    if (block.type === "divider") return block.style + " divider";
    if (block.type === "custom-html") return "Raw HTML Code";
    return block.type;
  }

  function renderField(profile, block, id, type, label, valKey, placeholder, extraFields) {
    var fieldEl = document.createElement("div");
    
    var fLabel = document.createElement("label");
    fLabel.className = "label"; fLabel.textContent = label;
    fieldEl.appendChild(fLabel);

    if (type === "textarea") {
      var ta = document.createElement("textarea");
      ta.className = "textarea mono"; ta.rows = (extraFields && extraFields.rows) ? extraFields.rows : 4;
      ta.placeholder = placeholder || "";
      ta.value = block[valKey];
      ta.oninput = function() { block[valKey] = ta.value; scheduleSave(); refreshConfigName(); refreshPreview(); };
      fieldEl.appendChild(ta);
    } else if (type === "select") {
      var sel = document.createElement("select");
      sel.className = "input";
      (extraFields.options || []).forEach(function(opt) {
        var op = document.createElement("option");
        op.value = opt.value; op.textContent = opt.label;
        sel.appendChild(op);
      });
      sel.value = block[valKey];
      sel.onchange = function() { block[valKey] = sel.value; scheduleSave(); refreshPreview(); };
      fieldEl.appendChild(sel);
    } else {
      var inp = document.createElement("input");
      inp.className = "input"; inp.type = type;
      inp.placeholder = placeholder || "";
      inp.value = block[valKey];
      inp.oninput = function() { block[valKey] = inp.value; scheduleSave(); refreshConfigName(); refreshPreview(); };
      fieldEl.appendChild(inp);
    }
    return fieldEl;
  }

  function refreshConfigName() {
    var p = getActiveProfile(); if (!p) return;
    var b = p.blocks.find(function(x){return x.id === p.selectedBlockId});
    if (!b) return;
    el.configBlockName.textContent = getReadableBlockName(b) || "Untitled format";
    renderBlockList(); // updates sidebar text realtime
  }

  function moveBlock(profile, idx, offset) {
    if (idx + offset < 0 || idx + offset >= profile.blocks.length) return;
    var tmp = profile.blocks[idx];
    profile.blocks[idx] = profile.blocks[idx + offset];
    profile.blocks[idx + offset] = tmp;
    scheduleSave();
    renderBlockList();
    refreshPreview();
  }

  function renderBlockList() {
    var profile = getActiveProfile();
    if (!profile) return;
    el.blockListUi.innerHTML = "";
    if (!profile.blocks.length) {
      el.blockEmpty.classList.remove("hidden");
    } else {
      el.blockEmpty.classList.add("hidden");
      profile.blocks.forEach(function (block, idx) {
        var info = getBlockTypeInfo(block.type);
        var li = document.createElement("li");
        li.className = "block-item" + (block.id === profile.selectedBlockId ? " active" : "");
        li.innerHTML = [
          '<div class="block-item-drag">≡</div>',
          '<div class="block-item-icon">' + info.icon + '</div>',
          '<div class="block-item-name">' + safeHtml(getReadableBlockName(block)) + '</div>',
          '<div class="block-item-actions">',
            '<button class="btn-icon" data-action="up"' + (idx === 0 ? " disabled" : "") + '>↑</button>',
            '<button class="btn-icon" data-action="down"' + (idx === profile.blocks.length - 1 ? " disabled" : "") + '>↓</button>',
          '</div>'
        ].join("");
        
        li.addEventListener("click", function (e) {
          if (e.target.tagName.toLowerCase() === "button") return; // Let actions handle themselves
          switchTab("block");
          profile.selectedBlockId = block.id;
          scheduleSave();
          renderBlockList();
          renderConfigPanel();
        });

        var btns = li.querySelectorAll("button");
        if(btns[0]) btns[0].onclick = function() { moveBlock(profile, idx, -1); };
        if(btns[1]) btns[1].onclick = function() { moveBlock(profile, idx, 1); };

        el.blockListUi.appendChild(li);
      });
    }
  }

  function renderConfigPanel() {
    var profile = getActiveProfile();
    if (!profile) return;
    var block = profile.blocks.find(function(b){ return b.id === profile.selectedBlockId; });
    
    if (!block) {
      el.blockConfigEmpty.classList.remove("hidden");
      el.blockConfigForm.classList.add("hidden");
      return;
    }
    el.blockConfigEmpty.classList.add("hidden");
    el.blockConfigForm.classList.remove("hidden");

    var info = getBlockTypeInfo(block.type);
    el.configBlockType.textContent = info.icon + " " + info.label;
    el.configBlockName.textContent = getReadableBlockName(block) || "Empty Block";
    
    el.configFields.innerHTML = "";

    var makeFld = function(t, lbl, key, p, x) { el.configFields.appendChild(renderField(profile, block, block.id, t, lbl, key, p, x)); };

    switch(block.type) {
      case "hero":
        makeFld("text", "Title", "title", "Your Name");
        makeFld("textarea", "Subtitle", "subtitle", "Vibe description", {rows: 2});
        makeFld("text", "Avatar URL", "avatarUrl", "https://...");
        makeFld("select", "Alignment", "align", "", {options: [{value:"center", label:"Center"}, {value:"left", label:"Left"}]});
        break;
      case "text":
        makeFld("textarea", "Markdown Content (supports empty lines)", "markdown", "...", {rows: 8});
        break;
      case "section-header":
        makeFld("text", "Title", "title", "Section Title");
        makeFld("text", "Subtitle", "subtitle", "Optional description");
        break;
      case "divider":
        makeFld("select", "Style", "style", "", {options: [{value:"line", label:"Thin Line"}, {value:"dots", label:"Dots"}, {value:"space", label:"Empty Space"}]});
        break;
      case "embed":
        makeFld("text", "Label (Optional)", "label", "My favorite track");
        makeFld("textarea", "URL or Iframe", "rawInput", "https://open.spotify.com/...", {rows: 4});
        makeFld("select", "Size", "size", "", {options: [{value:"normal", label:"Full width"}, {value:"compact", label:"Compact (480px)"}]});
        break;
      case "embed-row":
        makeFld("text", "Row Label (Optional)", "label", "Gallery");
        makeFld("textarea", "URLs (Paste one per line)", "rawInput", "https://...\nhttps://...", {rows: 6});
        break;
      case "link-button":
        makeFld("text", "Button Text", "text", "Hover me");
        makeFld("text", "Destination URL", "href", "https://");
        makeFld("text", "Icon Emoji", "icon", "🚀");
        makeFld("select", "Button Style", "style", "", {options: [{value:"filled", label:"Filled Banner"}, {value:"outline", label:"Outline"}]});
        break;
      case "custom-html":
        makeFld("textarea", "Raw HTML Code", "html", "<div>...</div>", {rows: 8});
        break;
    }
  }

  function renderStudioForm() {
    var profile = getActiveProfile();
    if (!profile) return;

    el.profileSelect.innerHTML = "";
    project.profiles.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p.id; opt.textContent = p.displayName + " (@" + p.handle + ")";
      el.profileSelect.appendChild(opt);
    });
    el.profileSelect.value = profile.id;

    el.profileHandle.value = profile.handle;
    el.profileDisplayName.value = profile.displayName;
    el.profileBio.value = profile.bio;
    profile.layout = ensureLayout(profile.layout);
    el.layoutMode.value = profile.layout.mode;
    el.layoutMaxWidth.value = String(profile.layout.maxWidth);
    el.layoutColumns.value = String(profile.layout.columns);
    el.layoutGap.value = String(profile.layout.gap);
    el.layoutPadding.value = String(profile.layout.padding);
    el.layoutCardStyle.value = profile.layout.cardStyle;
    el.layoutRadius.value = String(profile.layout.radius);
    el.layoutAlign.value = profile.layout.align;
    el.htmlBefore.value = profile.htmlBefore;
    el.htmlAfter.value = profile.htmlAfter;
    el.customCss.value = profile.customCss;

    renderBlockList();
    renderConfigPanel();

    el.publicUrl.textContent = "#/p/" + encodeURIComponent(profile.handle);
    document.title = "Studio - @" + profile.handle;
  }

  var previewTimer = null;
  function refreshPreview() {
    if (previewTimer) clearTimeout(previewTimer);
    previewTimer = setTimeout(function () {
      var profile = getActiveProfile();
      if (profile) el.preview.srcdoc = buildProfileDocument(profile);
    }, 150);
  }

  function openModal() { el.modalBackdrop.classList.remove("hidden"); el.modalAddBlock.classList.remove("hidden"); }
  function closeModal() { el.modalBackdrop.classList.add("hidden"); el.modalAddBlock.classList.add("hidden"); }

  function bindStudioEvents() {
    el.tabBtnBlock.onclick = function() { switchTab("block"); };
    el.tabBtnGlobal.onclick = function() { switchTab("global"); };

    el.profileSelect.addEventListener("change", function () {
      project.activeProfileId = el.profileSelect.value;
      scheduleSave();
      renderStudioForm();
      refreshPreview();
    });

    el.btnNewProfile.addEventListener("click", function () {
      var name = prompt("Display name for new profile:", "Untitled");
      if (!name) return;
      var p = createProfile(name, name);
      ensureUniqueHandle(p, p.handle);
      project.profiles.push(p);
      project.activeProfileId = p.id;
      scheduleSave(); renderStudioForm(); refreshPreview();
    });

    el.btnDuplicateProfile.addEventListener("click", function () {
      var current = getActiveProfile(); if (!current) return;
      var copy = JSON.parse(JSON.stringify(current));
      copy.id = uid("pro"); copy.displayName += " copy";
      ensureUniqueHandle(copy, current.handle + "-copy");
      copy.blocks.forEach(function(b){ b.id = uid("blk"); });
      project.profiles.push(copy); project.activeProfileId = copy.id;
      scheduleSave(); renderStudioForm(); refreshPreview();
    });

    el.btnDeleteProfile.addEventListener("click", function () {
      if (project.profiles.length === 1) { alert("Cannot delete last profile."); return; }
      var current = getActiveProfile();
      if (!confirm("Delete profile @" + current.handle + "?")) return;
      project.profiles = project.profiles.filter(function(p){return p.id !== current.id});
      project.activeProfileId = project.profiles[0].id;
      scheduleSave(); renderStudioForm(); refreshPreview();
    });

    function ensureUniqueHandle(profile, preferred) {
      var base = slugify(preferred || "profile"), candidate = base, i = 1;
      while (project.profiles.some(function (p) { return p.id !== profile.id && p.handle === candidate; })) {
        i++; candidate = base + "-" + i;
      }
      profile.handle = candidate;
    }

    el.profileHandle.oninput = function () { var p = getActiveProfile(); if(!p)return; ensureUniqueHandle(p, el.profileHandle.value); el.profileHandle.value = p.handle; scheduleSave(); refreshPreview(); el.publicUrl.textContent = "#/p/" + encodeURIComponent(p.handle); };
    el.profileDisplayName.oninput = function () { var p = getActiveProfile(); if(!p)return; p.displayName = el.profileDisplayName.value; scheduleSave(); refreshPreview(); };
    el.profileBio.oninput = function () { var p = getActiveProfile(); if(!p)return; p.bio = el.profileBio.value; scheduleSave(); refreshPreview(); };
    el.layoutMode.onchange = function () { var p = getActiveProfile(); if(!p)return; p.layout = ensureLayout(p.layout); p.layout.mode = el.layoutMode.value; scheduleSave(); refreshPreview(); };
    el.layoutMaxWidth.oninput = function () { var p = getActiveProfile(); if(!p)return; p.layout = ensureLayout(p.layout); p.layout.maxWidth = clampNumber(el.layoutMaxWidth.value, 560, 1600, p.layout.maxWidth); scheduleSave(); refreshPreview(); };
    el.layoutColumns.onchange = function () { var p = getActiveProfile(); if(!p)return; p.layout = ensureLayout(p.layout); p.layout.columns = clampNumber(el.layoutColumns.value, 1, 3, 1); scheduleSave(); refreshPreview(); };
    el.layoutGap.oninput = function () { var p = getActiveProfile(); if(!p)return; p.layout = ensureLayout(p.layout); p.layout.gap = clampNumber(el.layoutGap.value, 0, 80, p.layout.gap); scheduleSave(); refreshPreview(); };
    el.layoutPadding.oninput = function () { var p = getActiveProfile(); if(!p)return; p.layout = ensureLayout(p.layout); p.layout.padding = clampNumber(el.layoutPadding.value, 0, 120, p.layout.padding); scheduleSave(); refreshPreview(); };
    el.layoutCardStyle.onchange = function () { var p = getActiveProfile(); if(!p)return; p.layout = ensureLayout(p.layout); p.layout.cardStyle = el.layoutCardStyle.value; scheduleSave(); refreshPreview(); };
    el.layoutRadius.oninput = function () { var p = getActiveProfile(); if(!p)return; p.layout = ensureLayout(p.layout); p.layout.radius = clampNumber(el.layoutRadius.value, 0, 48, p.layout.radius); scheduleSave(); refreshPreview(); };
    el.layoutAlign.onchange = function () { var p = getActiveProfile(); if(!p)return; p.layout = ensureLayout(p.layout); p.layout.align = el.layoutAlign.value; scheduleSave(); refreshPreview(); };
    el.htmlBefore.oninput = function () { var p = getActiveProfile(); if(!p)return; p.htmlBefore = el.htmlBefore.value; scheduleSave(); refreshPreview(); };
    el.htmlAfter.oninput = function () { var p = getActiveProfile(); if(!p)return; p.htmlAfter = el.htmlAfter.value; scheduleSave(); refreshPreview(); };
    el.customCss.oninput = function () { var p = getActiveProfile(); if(!p)return; p.customCss = el.customCss.value; scheduleSave(); refreshPreview(); };

    el.btnExport.onclick = function () {
      var blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "niche4niche-blocks.json"; a.click(); URL.revokeObjectURL(a.href);
    };

    el.importFile.onchange = function () {
      if(!el.importFile.files[0]) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var h = hydrateProject(JSON.parse(reader.result));
          if (!h) throw new Error("");
          project = h; localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
          renderStudioForm(); refreshPreview();
        } catch (e) { alert("Invalid project JSON."); }
        el.importFile.value = "";
      };
      reader.readAsText(el.importFile.files[0]);
    };

    el.btnReset.onclick = function () {
      if (!confirm("Wipe completely and reset?")) return;
      project = defaultProject(); localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      renderStudioForm(); refreshPreview();
    };

    el.btnOpenPublic.onclick = function () {
      var p = getActiveProfile(); if (p) window.open("#/p/" + encodeURIComponent(p.handle), "_blank");
    };

    // Block logic
    el.btnAddBlock.onclick = openModal;
    el.btnCloseModal.onclick = closeModal;
    el.modalBackdrop.onclick = closeModal;

    el.blockBtns.forEach(function(btn) {
      btn.onclick = function() {
        var p = getActiveProfile(); if (!p) return;
        var b = createBlock(btn.dataset.type);
        p.blocks.push(b);
        p.selectedBlockId = b.id;
        scheduleSave();
        closeModal();
        switchTab("block");
        renderBlockList();
        renderConfigPanel();
        refreshPreview();
      };
    });

    el.btnDeleteBlock.onclick = function() {
      var p = getActiveProfile(); if (!p) return;
      if (!confirm("Delete this block?")) return;
      p.blocks = p.blocks.filter(function(b){ return b.id !== p.selectedBlockId; });
      if (p.blocks.length) p.selectedBlockId = p.blocks[0].id;
      else p.selectedBlockId = null;
      scheduleSave();
      renderBlockList();
      renderConfigPanel();
      refreshPreview();
    };
  }

  function renderPublicPage(handle) {
    var profile = project.profiles.find(function (p) { return p.handle === handle; });
    if (!profile) {
      document.body.innerHTML = '<div class="public-shell"><div class="public-card"><h1>Profile not found</h1><p>Does not exist here.</p><p><a href="#/">Back to studio</a></p></div></div>';
      document.title = "Not found";
      return;
    }
    document.open(); document.write(buildProfileDocument(profile)); document.close();
  }

  function boot() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); } catch (e) {}
    var hm = location.hash.match(/^#\/p\/([^/?#]+)/i);
    if (hm) { renderPublicPage(decodeURIComponent(hm[1])); return; }
    renderStudioForm();
    bindStudioEvents();
    refreshPreview();
  }

  boot();
})();
