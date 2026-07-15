// ===================================================
// OGUSMÃO DIGITAL — Admin Dashboard JS
// ===================================================

(function() {
  'use strict';

  // --- RESTAURAR DADOS DO LOCALSTORAGE ANTES DE TUDO ---
  try {
    var savedContent = localStorage.getItem('ogusmao_site_content');
    if (savedContent) {
      var root = document.getElementById('root');
      if (root) {
        root.innerHTML = savedContent;
      }
    }
  } catch(e) { console.warn('Erro ao restaurar localStorage:', e); }

  // --- ATALHO DE TECLADO ---
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.altKey && (e.key === 'm' || e.key === 'M')) {
      e.preventDefault();
      showLoginModal();
    }
  });

  // --- HELPERS PARA SELECTORS SEGUROS ---
  function qsEscape(selector) {
    return selector.replace(/([[\]\/\#\(\)\%])/g, '\\$1');
  }

  // --- 1. MODAL DE LOGIN ---
  function showLoginModal() {
    if (document.getElementById('admin-modal')) return;

    // Desativar cursores para o mouse aparecer
    document.body.classList.remove('has-cursor');
    var cursorEls = document.querySelectorAll('.cursor-dot, .cursor-ring');
    for (var i = 0; i < cursorEls.length; i++) { cursorEls[i].style.display = 'none'; }

    var modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(15px);font-family:Inter,sans-serif;';

    modal.innerHTML = '<div style="background:#121212;padding:40px;border-radius:16px;border:1px solid rgba(255,255,255,0.05);width:100%;max-width:400px;text-align:center;">'
      + '<div style="width:48px;height:48px;background:#D7FF00;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-weight:800;color:#000;font-size:24px;">O</div>'
      + '<h2 style="color:white;margin-bottom:8px;font-size:20px;">Ogusmão Admin</h2>'
      + '<p style="color:#666;margin-bottom:32px;font-size:14px;">Acesso restrito ao painel de controle</p>'
      + '<div style="text-align:left;margin-bottom:16px;">'
      + '<label style="display:block;font-size:12px;color:#A0A0A0;margin-bottom:8px;">Usuário</label>'
      + '<input type="text" id="admin-user" style="width:100%;padding:12px 16px;border-radius:8px;background:#0A0A0A;border:1px solid rgba(255,255,255,0.1);color:white;outline:none;font-size:14px;">'
      + '</div>'
      + '<div style="text-align:left;margin-bottom:32px;">'
      + '<label style="display:block;font-size:12px;color:#A0A0A0;margin-bottom:8px;">Senha</label>'
      + '<input type="password" id="admin-pass" style="width:100%;padding:12px 16px;border-radius:8px;background:#0A0A0A;border:1px solid rgba(255,255,255,0.1);color:white;outline:none;font-size:14px;">'
      + '</div>'
      + '<button id="admin-login-btn" style="width:100%;padding:14px;border-radius:8px;background:#D7FF00;color:#000;border:none;font-weight:600;cursor:pointer;font-size:14px;">Entrar no Dashboard</button>'
      + '</div>';

    document.body.appendChild(modal);

    document.getElementById('admin-login-btn').onclick = function() {
      var u = document.getElementById('admin-user').value;
      var p = document.getElementById('admin-pass').value;
      if (u === 'JoAliDigital' && p === '06072006') {
        modal.remove();
        initDashboard();
      } else {
        alert('Credenciais incorretas.');
      }
    };
  }

  // --- 2. INICIAR DASHBOARD ---
  function initDashboard() {
    document.getElementById('root').style.display = 'none';

    var dashboard = document.createElement('div');
    dashboard.id = 'ogusmao-admin-panel';

    dashboard.innerHTML = '<div class="oadmin-sidebar">'
      + '<div class="oadmin-brand"><div class="oadmin-brand-icon">O</div><div><div class="oadmin-brand-text">Ogusmão</div><div class="oadmin-brand-sub">Digital Admin</div></div></div>'
      + '<div class="oadmin-nav-group">'
      + '<div class="oadmin-nav-title">Gerenciar Conteúdo</div>'
      + '<div class="oadmin-nav-item active" data-tab="hero">✨ Início (Hero)</div>'
      + '<div class="oadmin-nav-item" data-tab="services">📱 Serviços</div>'
      + '<div class="oadmin-nav-item" data-tab="portfolio">💼 Portfólio</div>'
      + '<div class="oadmin-nav-item" data-tab="sobre">ℹ️ Sobre</div>'
      + '<div class="oadmin-nav-item" data-tab="depoimentos">💬 Depoimentos</div>'
      + '<div class="oadmin-nav-item" data-tab="contato">📞 Contato</div>'
      + '<div class="oadmin-nav-item" data-tab="stats">📊 Números e Dados</div>'
      + '</div>'
      + '<div class="oadmin-sidebar-footer"><div class="oadmin-btn-exit" id="oadmin-exit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Sair do Painel</div></div>'
      + '</div>'
      + '<div class="oadmin-main">'
      + '<div class="oadmin-header"><div class="oadmin-header-title">Editar Seção <span style="color:#666;font-size:14px;font-weight:400;margin-left:8px;" id="oadmin-current-tab">Hero / Início</span></div>'
      + '<div class="oadmin-header-actions"><button class="oadmin-btn-view" id="oadmin-view-site">Ver site ↗</button>'
      + '<div style="display:flex;align-items:center;gap:12px;margin-left:16px;padding-left:16px;border-left:1px solid rgba(255,255,255,0.1);"><div style="width:32px;height:32px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;">AD</div><div style="font-size:12px;color:#FFF;">Administrador<br><span style="color:#666;">admin@ogusmao.com</span></div></div></div></div>'
      + '<div class="oadmin-content" id="oadmin-form-container"></div>'
      + '</div>';

    document.body.appendChild(dashboard);

    document.getElementById('oadmin-exit').onclick = closeDashboard;
    document.getElementById('oadmin-view-site').onclick = closeDashboard;

    var tabs = dashboard.querySelectorAll('.oadmin-nav-item');
    for (var i = 0; i < tabs.length; i++) {
      (function(tab) {
        tab.onclick = function() {
          for (var j = 0; j < tabs.length; j++) { tabs[j].classList.remove('active'); }
          tab.classList.add('active');
          document.getElementById('oadmin-current-tab').innerText = tab.innerText.replace(/^[^\w]*/, '');
          renderForm(tab.getAttribute('data-tab'));
        };
      })(tabs[i]);
    }

    renderForm('hero');
  }

  function closeDashboard() {
    var dash = document.getElementById('ogusmao-admin-panel');
    if (dash) dash.remove();
    document.getElementById('root').style.display = 'block';
  }

  // --- 3. EXTRATORES DE DADOS ---

  function getHeroData() {
    var section = document.getElementById('inicio');
    if (!section) return { titleHTML:'', subtitle:'', btn1Text:'', btn1Link:'', btn2Text:'', btn2Link:'' };
    var h1 = section.querySelector('h1');
    var pEls = section.querySelectorAll('p');
    var subtitle = '';
    for (var i = 0; i < pEls.length; i++) {
      if (pEls[i].innerText.indexOf('Transformamos') !== -1 || pEls[i].className.indexOf('text-white') !== -1) {
        subtitle = pEls[i].innerText;
        break;
      }
    }
    var btn1 = section.querySelector('.btn-primary');
    var btn2 = section.querySelector('.btn-outline');
    return {
      titleHTML: h1 ? h1.innerHTML : '',
      subtitle: subtitle,
      btn1Text: btn1 ? btn1.innerText.trim() : '',
      btn1Link: btn1 ? (btn1.getAttribute('href') || '') : '',
      btn2Text: btn2 ? btn2.innerText.trim() : '',
      btn2Link: btn2 ? (btn2.getAttribute('href') || '') : ''
    };
  }

  function getServicesData() {
    var section = document.getElementById('servicos');
    if (!section) return { label:'', titleHTML:'', cards:[] };
    var labelEl = section.querySelector('.section-label');
    var h2 = section.querySelector('h2');
    var cardEls = section.querySelectorAll('.group');
    var cards = [];
    for (var i = 0; i < cardEls.length; i++) {
      var card = cardEls[i];
      var iconEl = card.querySelector('.text-2xl');
      var titleEl = card.querySelector('h3');
      var descEl = card.querySelector('p');
      cards.push({
        icon: iconEl ? iconEl.innerText : '',
        title: titleEl ? titleEl.innerText : '',
        desc: descEl ? descEl.innerText : ''
      });
    }
    return {
      label: labelEl ? labelEl.innerText : '',
      titleHTML: h2 ? h2.innerHTML : '',
      cards: cards
    };
  }

  function getPortfolioData() {
    var section = document.getElementById('portfolio');
    if (!section) return { titleHTML:'', items:[] };
    var h2 = section.querySelector('h2');
    var itemEls = section.querySelectorAll('.break-inside-avoid');
    var items = [];
    for (var i = 0; i < itemEls.length; i++) {
      var item = itemEls[i];
      var emojiEl = item.querySelector('.text-5xl');
      var imgEl = emojiEl ? emojiEl.querySelector('img') : null;
      var titleEl = item.querySelector('.font-black');
      var catEls = item.querySelectorAll('.font-semibold');
      var category = '';
      for (var j = 0; j < catEls.length; j++) {
        if (catEls[j].className.indexOf('tracking-widest') !== -1) {
          category = catEls[j].innerText;
          break;
        }
      }
      
      var icon = '';
      var imgUrl = '';
      if (imgEl) {
        imgUrl = imgEl.getAttribute('src') || '';
      } else if (emojiEl) {
        icon = emojiEl.innerText.replace(/[\n\r]/g, '').trim();
      }

      items.push({
        emoji: icon,
        imgUrl: imgUrl,
        title: titleEl ? titleEl.innerText : '',
        category: category
      });
    }
    return {
      titleHTML: h2 ? h2.innerHTML : '',
      items: items
    };
  }

  function getSobreData() {
    var section = document.getElementById('sobre');
    if (!section) return { label:'', titleHTML:'', steps:[] };
    var labelEl = section.querySelector('.section-label');
    var h2 = section.querySelector('h2');
    
    // Pegar apenas os primeiros 5 elementos (Desktop) já que os mobile são cópias
    var h3s = section.querySelectorAll('h3');
    var ps = section.querySelectorAll('p');
    var emojisDesktop = section.querySelectorAll('.w-16.h-16'); // As bolinhas com emoji
    
    var steps = [];
    for (var i = 0; i < 5 && i < h3s.length; i++) {
      // Limpar texto dentro do ícone (tirar os números se existirem acidentalmente)
      var emoji = emojisDesktop[i] ? emojisDesktop[i].innerText.replace(/[a-zA-Z0-9\n]/g, '').trim() : '';
      steps.push({
        title: h3s[i] ? h3s[i].innerText : '',
        desc: ps[i] ? ps[i].innerText : '',
        emoji: emoji
      });
    }
    return {
      label: labelEl ? labelEl.innerText : '',
      titleHTML: h2 ? h2.innerHTML : '',
      steps: steps
    };
  }

  function getDepoimentosData() {
    var section = document.getElementById('depoimentos');
    if (!section) return { label:'', titleHTML:'', quote:'', authorName:'', authorRoleHTML:'' };
    var labelEl = section.querySelector('.section-label');
    var h2 = section.querySelector('h2');
    // Encontrar o <p> do depoimento
    var pEls = section.querySelectorAll('p');
    var quote = '';
    for (var i = 0; i < pEls.length; i++) {
      if (pEls[i].className.indexOf('text-xl') !== -1 || pEls[i].className.indexOf('text-2xl') !== -1) {
        quote = pEls[i].innerText;
        break;
      }
    }
    var authorNameEl = section.querySelector('.text-white.font-bold.text-sm');
    // Pegar o container com o cargo (tem class text-xs)
    var allDivs = section.querySelectorAll('div');
    var authorRoleHTML = '';
    for (var j = 0; j < allDivs.length; j++) {
      if (allDivs[j].className.indexOf('text-white/40') !== -1 && allDivs[j].className.indexOf('text-xs') !== -1 && allDivs[j].innerHTML.indexOf('CEO') !== -1) {
        authorRoleHTML = allDivs[j].innerHTML;
        break;
      }
    }
    return {
      label: labelEl ? labelEl.innerText : '',
      titleHTML: h2 ? h2.innerHTML : '',
      quote: quote,
      authorName: authorNameEl ? authorNameEl.innerText : '',
      authorRoleHTML: authorRoleHTML
    };
  }

  function getContatoData() {
    var section = document.getElementById('contato');
    if (!section) return { label:'', titleHTML:'', desc:'', btnText:'', btnLink:'' };
    var labelEl = section.querySelector('.section-label');
    var h2 = section.querySelector('h2');
    var descEl = section.querySelector('p');
    var btn = section.querySelector('.btn-primary');
    return {
      label: labelEl ? labelEl.innerText : '',
      titleHTML: h2 ? h2.innerHTML : '',
      desc: descEl ? descEl.innerText : '',
      btnText: btn ? btn.innerText.trim() : '',
      btnLink: btn ? (btn.getAttribute('href') || '') : ''
    };
  }

  function getFooterContatoEls() {
    var footer = document.querySelector('footer');
    var els = { address: null, email: null, wppA: null };
    if (!footer) return els;
    
    var cols = footer.querySelectorAll('h4');
    var contatoCol = null;
    for (var i=0; i<cols.length; i++) {
       if (cols[i].innerText.indexOf('Contato') !== -1) {
           contatoCol = cols[i].parentElement;
       }
    }
    
    if (contatoCol) {
       var lis = contatoCol.querySelectorAll('li');
       if (lis.length >= 3) {
           els.address = lis[0];
           els.email = lis[1];
           els.wppA = lis[2].querySelector('a');
       }
    }
    return els;
  }

  function getStatsElements() {
    var section = document.getElementById('inicio');
    if (!section) return { empresas: null, empresasSub: null, satisfacao: null };
    
    var elEmpresas = section.querySelector('[data-admin="stat-empresas"]');
    var elEmpresasSub = section.querySelector('[data-admin="stat-empresas-sub"]');
    var elSatisfacao = section.querySelector('[data-admin="stat-satisfacao"]');
    
    if (!elEmpresas || !elEmpresasSub || !elSatisfacao) {
      var allDivs = section.querySelectorAll('div');
      for (var i = 0; i < allDivs.length; i++) {
        var el = allDivs[i];
        if (el.children.length === 0) { // Somente elementos de texto finais
          var text = el.innerText || el.textContent || '';
          
          if (!elEmpresas && text.toLowerCase().indexOf('empresas') !== -1 && text.indexOf('+') !== -1) {
            elEmpresas = el;
            elEmpresas.setAttribute('data-admin', 'stat-empresas');
          }
          else if (!elEmpresasSub && text.toLowerCase().indexOf('cresceram') !== -1) {
            elEmpresasSub = el;
            elEmpresasSub.setAttribute('data-admin', 'stat-empresas-sub');
          }
          else if (!elSatisfacao && text.indexOf('%') !== -1 && text.length < 10) {
            elSatisfacao = el;
            elSatisfacao.setAttribute('data-admin', 'stat-satisfacao');
          }
        }
      }
    }
    
    var darkStatsSection = document.querySelector('section.py-20.bg-\\[\\#1A1A1A\\]');
    var darkStats = [];
    if (darkStatsSection) {
      var numberEls = darkStatsSection.querySelectorAll('.font-black.text-\\[\\#D7FF00\\]');
      var labelEls = darkStatsSection.querySelectorAll('.text-white\\/50.text-sm');
      for (var j = 0; j < 4; j++) {
        if (numberEls[j] || labelEls[j]) {
          darkStats.push({
            numEl: numberEls[j] || null,
            labelEl: labelEls[j] || null
          });
        }
      }
    }
    
    return {
      empresas: elEmpresas,
      empresasSub: elEmpresasSub,
      satisfacao: elSatisfacao,
      darkStats: darkStats
    };
  }

  function getStatsData() {
    var els = getStatsElements();
    var ds = [];
    if (els.darkStats) {
      for(var i=0; i<els.darkStats.length; i++) {
        ds.push({
          num: els.darkStats[i].numEl ? els.darkStats[i].numEl.innerText : '',
          label: els.darkStats[i].labelEl ? els.darkStats[i].labelEl.innerText : ''
        });
      }
    }
    return {
      empresas: els.empresas ? els.empresas.innerText : '',
      empresasSub: els.empresasSub ? els.empresasSub.innerText : '',
      satisfacao: els.satisfacao ? els.satisfacao.innerText : '',
      darkStats: ds
    };
  }

  // --- 4. RENDERIZAR FORMULÁRIOS ---
  function renderForm(tabId) {
    var container = document.getElementById('oadmin-form-container');
    var html = '';

    if (tabId === 'hero') {
      var data = getHeroData();
      html = '<div class="oadmin-card"><div class="oadmin-card-title">Conteúdo Principal (Hero)</div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Título da Página (HTML)</label>'
        + '<textarea class="oadmin-textarea" id="hero-title" style="min-height:80px;font-family:monospace;">' + data.titleHTML + '</textarea></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Subtítulo</label>'
        + '<textarea class="oadmin-textarea" id="hero-subtitle" style="min-height:60px;">' + data.subtitle + '</textarea></div>'
        + '<div class="oadmin-form-row"><div class="oadmin-form-group"><label class="oadmin-label">Texto Botão Primário</label>'
        + '<input type="text" class="oadmin-input" id="hero-btn1-text" value="' + escAttr(data.btn1Text) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Link Botão Primário</label>'
        + '<input type="text" class="oadmin-input" id="hero-btn1-link" value="' + escAttr(data.btn1Link) + '"></div></div>'
        + '<div class="oadmin-form-row"><div class="oadmin-form-group"><label class="oadmin-label">Texto Botão Secundário</label>'
        + '<input type="text" class="oadmin-input" id="hero-btn2-text" value="' + escAttr(data.btn2Text) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Link Botão Secundário</label>'
        + '<input type="text" class="oadmin-input" id="hero-btn2-link" value="' + escAttr(data.btn2Link) + '"></div></div>'
        + '</div>'
        + '<div class="oadmin-form-actions"><button class="oadmin-btn-cancel" id="cancel-hero">Cancelar</button>'
        + '<button class="oadmin-btn-save" id="save-hero">💾 Salvar alterações</button></div>';

      container.innerHTML = html;
      document.getElementById('cancel-hero').onclick = closeDashboard;
      document.getElementById('save-hero').onclick = function() {
        var section = document.getElementById('inicio');
        var h1 = section.querySelector('h1');
        if (h1) h1.innerHTML = document.getElementById('hero-title').value;
        var btn1 = section.querySelector('.btn-primary');
        if (btn1) {
          var svgBackup1 = btn1.querySelector('svg');
          btn1.textContent = document.getElementById('hero-btn1-text').value;
          if (svgBackup1) btn1.appendChild(svgBackup1);
          btn1.setAttribute('href', document.getElementById('hero-btn1-link').value);
        }
        var btn2 = section.querySelector('.btn-outline');
        if (btn2) {
          var svgBackup2 = btn2.querySelector('svg');
          btn2.textContent = document.getElementById('hero-btn2-text').value;
          if (svgBackup2) btn2.appendChild(svgBackup2);
          btn2.setAttribute('href', document.getElementById('hero-btn2-link').value);
        }
        var pEls = section.querySelectorAll('p');
        for (var i = 0; i < pEls.length; i++) {
          if (pEls[i].className.indexOf('text-white') !== -1 && pEls[i].className.indexOf('text-lg') !== -1) {
            pEls[i].innerText = document.getElementById('hero-subtitle').value;
            break;
          }
        }
        persistChanges();
      };
    }

    else if (tabId === 'services') {
      var data = getServicesData();
      var cardsHtml = '';
      for (var i = 0; i < data.cards.length; i++) {
        var c = data.cards[i];
        cardsHtml += '<div class="oadmin-list-item" style="flex-direction:column;align-items:stretch;">'
          + '<div style="font-weight:bold;margin-bottom:8px;">Serviço ' + (i+1) + '</div>'
          + '<div class="oadmin-form-row"><div class="oadmin-form-group" style="flex:0 0 80px;"><label class="oadmin-label">Ícone</label>'
          + '<input type="text" class="oadmin-input serv-icon" value="' + escAttr(c.icon) + '"></div>'
          + '<div class="oadmin-form-group"><label class="oadmin-label">Título</label>'
          + '<input type="text" class="oadmin-input serv-title" value="' + escAttr(c.title) + '"></div></div>'
          + '<div class="oadmin-form-group"><label class="oadmin-label">Descrição</label>'
          + '<textarea class="oadmin-textarea serv-desc" style="min-height:60px;">' + c.desc + '</textarea></div></div>';
      }
      html = '<div class="oadmin-card"><div class="oadmin-card-title">Cabeçalho de Serviços</div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Tagline</label>'
        + '<input type="text" class="oadmin-input" id="serv-label" value="' + escAttr(data.label) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Título Principal (HTML)</label>'
        + '<textarea class="oadmin-textarea" id="serv-main-title" style="min-height:80px;">' + data.titleHTML + '</textarea></div></div>'
        + '<div class="oadmin-card"><div class="oadmin-card-title">Cards de Serviços</div>' + cardsHtml + '</div>'
        + '<div class="oadmin-form-actions"><button class="oadmin-btn-cancel" id="cancel-serv">Cancelar</button>'
        + '<button class="oadmin-btn-save" id="save-serv">💾 Salvar alterações</button></div>';

      container.innerHTML = html;
      document.getElementById('cancel-serv').onclick = closeDashboard;
      document.getElementById('save-serv').onclick = function() {
        var section = document.getElementById('servicos');
        var labelEl = section.querySelector('.section-label');
        if (labelEl) labelEl.innerText = document.getElementById('serv-label').value;
        var h2 = section.querySelector('h2');
        if (h2) h2.innerHTML = document.getElementById('serv-main-title').value;
        var cardsDom = section.querySelectorAll('.group');
        var icons = document.querySelectorAll('.serv-icon');
        var titles = document.querySelectorAll('.serv-title');
        var descs = document.querySelectorAll('.serv-desc');
        for (var i = 0; i < cardsDom.length && i < icons.length; i++) {
          var iconTarget = cardsDom[i].querySelector('.text-2xl');
          if (iconTarget) iconTarget.innerText = icons[i].value;
          var h3 = cardsDom[i].querySelector('h3');
          if (h3) h3.innerText = titles[i].value;
          var p = cardsDom[i].querySelector('p');
          if (p) p.innerText = descs[i].value;
        }
        persistChanges();
      };
    }

    else if (tabId === 'portfolio') {
      var data = getPortfolioData();
      var itemsHtml = '';
      for (var i = 0; i < data.items.length; i++) {
        var it = data.items[i];
        itemsHtml += '<div class="oadmin-list-item" style="flex-wrap:wrap;">'
          + '<div class="oadmin-form-group" style="flex:0 0 60px;"><label class="oadmin-label">Emoji</label>'
          + '<input type="text" class="oadmin-input port-emoji" value="' + escAttr(it.emoji) + '"></div>'
          + '<div class="oadmin-form-group" style="flex:1; min-width:200px;"><label class="oadmin-label">Imagem URL (Se preenchida, substitui Emoji)</label>'
          + '<input type="text" class="oadmin-input port-img" value="' + escAttr(it.imgUrl) + '"></div>'
          + '<div class="oadmin-form-group" style="flex:1;"><label class="oadmin-label">Nome</label>'
          + '<input type="text" class="oadmin-input port-title" value="' + escAttr(it.title) + '"></div>'
          + '<div class="oadmin-form-group" style="flex:1;"><label class="oadmin-label">Categoria</label>'
          + '<input type="text" class="oadmin-input port-cat" value="' + escAttr(it.category) + '"></div></div>';
      }
      html = '<div class="oadmin-card"><div class="oadmin-card-title">Título do Portfólio</div>'
        + '<div class="oadmin-form-group"><textarea class="oadmin-textarea" id="port-main-title" style="min-height:80px;">' + data.titleHTML + '</textarea></div></div>'
        + '<div class="oadmin-card"><div class="oadmin-card-title">Projetos</div>' + itemsHtml + '</div>'
        + '<div class="oadmin-form-actions"><button class="oadmin-btn-cancel" id="cancel-port">Cancelar</button>'
        + '<button class="oadmin-btn-save" id="save-port">💾 Salvar alterações</button></div>';

      container.innerHTML = html;
      document.getElementById('cancel-port').onclick = closeDashboard;
      document.getElementById('save-port').onclick = function() {
        var section = document.getElementById('portfolio');
        var h2 = section.querySelector('h2');
        if (h2) h2.innerHTML = document.getElementById('port-main-title').value;
        var itemsDom = section.querySelectorAll('.break-inside-avoid');
        var emojis = document.querySelectorAll('.port-emoji');
        var imgs = document.querySelectorAll('.port-img');
        var titles = document.querySelectorAll('.port-title');
        var cats = document.querySelectorAll('.port-cat');
        for (var i = 0; i < itemsDom.length && i < emojis.length; i++) {
          var previewContainer = itemsDom[i].querySelector('.h-64') || itemsDom[i].querySelector('.h-44');
          var emojiTarget = itemsDom[i].querySelector('.text-5xl');
          var nameInPreview = previewContainer ? previewContainer.querySelector('.font-black') : null;
          
          if (imgs[i].value.trim() !== '') {
            // Imagem fornecida
            var imgSrc = imgs[i].value.trim();
            
            if (emojiTarget) {
              // Limpar emoji e colocar img dentro do .text-5xl (onde getPortfolioData lê)
              emojiTarget.textContent = '';
              var oldImg = emojiTarget.querySelector('img');
              if (oldImg) oldImg.remove();
              var imgTag = document.createElement('img');
              imgTag.src = imgSrc;
              imgTag.alt = titles[i] ? titles[i].value : '';
              imgTag.style.cssText = 'width:100%; height:100%; object-fit:cover; border-radius:8px;';
              emojiTarget.appendChild(imgTag);
              // Expandir o container do emoji para preencher toda a área
              emojiTarget.style.cssText = 'width:100%; height:100%; position:absolute; inset:0; margin:0; padding:0; font-size:inherit;';
            }
            
            // Esconder o nome do projeto que fica sobre a imagem dentro do preview
            if (nameInPreview) nameInPreview.style.display = 'none';
            
            // Esconder o radial gradient overlay
            if (previewContainer) {
              var gradientDiv = previewContainer.querySelector('.opacity-30');
              if (gradientDiv) gradientDiv.style.display = 'none';
              // Garantir que o parent do emoji/img é relative
              var relativeDiv = previewContainer.querySelector('.relative.text-center');
              if (relativeDiv) {
                relativeDiv.style.cssText = 'position:absolute; inset:0; width:100%; height:100%;';
              }
            }
            
          } else if (emojiTarget) {
            // Sem imagem: restaurar emoji
            var oldImg2 = emojiTarget.querySelector('img');
            if (oldImg2) oldImg2.remove();
            emojiTarget.textContent = emojis[i].value;
            emojiTarget.style.cssText = '';
            if (nameInPreview) nameInPreview.style.display = '';
            if (previewContainer) {
              var gradientDiv2 = previewContainer.querySelector('.opacity-30');
              if (gradientDiv2) gradientDiv2.style.display = '';
              var relativeDiv2 = previewContainer.querySelector('.relative.text-center');
              if (relativeDiv2) relativeDiv2.style.cssText = '';
            }
          }
          
          var titleTarget = itemsDom[i].querySelector('.font-black');
          if (titleTarget) titleTarget.innerText = titles[i].value;
          var catTargets = itemsDom[i].querySelectorAll('.font-semibold');
          for (var j = 0; j < catTargets.length; j++) {
            if (catTargets[j].className.indexOf('tracking-widest') !== -1) {
              catTargets[j].innerText = cats[i].value;
              break;
            }
          }
          var nameTargets = itemsDom[i].querySelectorAll('.text-white.text-sm');
          for (var j = 0; j < nameTargets.length; j++) {
            nameTargets[j].innerText = titles[i].value;
          }
        }
        persistChanges();
      };
    }

    else if (tabId === 'sobre') {
      var data = getSobreData();
      var stepsHtml = '';
      for (var i = 0; i < data.steps.length; i++) {
        var s = data.steps[i];
        stepsHtml += '<div class="oadmin-list-item" style="flex-direction:column;align-items:stretch;">'
          + '<div style="font-weight:bold;margin-bottom:8px;">Etapa ' + (i+1) + '</div>'
          + '<div class="oadmin-form-row"><div class="oadmin-form-group" style="flex:0 0 80px;"><label class="oadmin-label">Ícone</label>'
          + '<input type="text" class="oadmin-input sobre-emoji" value="' + escAttr(s.emoji) + '"></div>'
          + '<div class="oadmin-form-group"><label class="oadmin-label">Título da Etapa</label>'
          + '<input type="text" class="oadmin-input sobre-title" value="' + escAttr(s.title) + '"></div></div>'
          + '<div class="oadmin-form-group"><label class="oadmin-label">Descrição</label>'
          + '<textarea class="oadmin-textarea sobre-desc" style="min-height:60px;">' + s.desc + '</textarea></div></div>';
      }
      
      html = '<div class="oadmin-card"><div class="oadmin-card-title">Cabeçalho (Como Funciona)</div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Tagline</label>'
        + '<input type="text" class="oadmin-input" id="sobre-label" value="' + escAttr(data.label) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Título Principal (HTML)</label>'
        + '<textarea class="oadmin-textarea" id="sobre-title" style="min-height:80px;">' + data.titleHTML + '</textarea></div></div>'
        + '<div class="oadmin-card"><div class="oadmin-card-title">Etapas do Processo</div>' + stepsHtml + '</div>'
        + '<div class="oadmin-form-actions"><button class="oadmin-btn-cancel" id="cancel-sobre">Cancelar</button>'
        + '<button class="oadmin-btn-save" id="save-sobre">💾 Salvar alterações</button></div>';
        
      container.innerHTML = html;
      document.getElementById('cancel-sobre').onclick = closeDashboard;
      document.getElementById('save-sobre').onclick = function() {
        var section = document.getElementById('sobre');
        var labelEl = section.querySelector('.section-label');
        if (labelEl) labelEl.innerText = document.getElementById('sobre-label').value;
        var h2 = section.querySelector('h2');
        if (h2) h2.innerHTML = document.getElementById('sobre-title').value;
        
        // Atualizar nos dois lugares (desktop e mobile)
        var h3s = section.querySelectorAll('h3');
        var ps = section.querySelectorAll('p');
        
        var inpsEmoji = document.querySelectorAll('.sobre-emoji');
        var inpsTitle = document.querySelectorAll('.sobre-title');
        var inpsDesc = document.querySelectorAll('.sobre-desc');
        
        // Desktop (0-4) e Mobile (5-9)
        for (var i = 0; i < 5; i++) {
          if (h3s[i]) h3s[i].innerText = inpsTitle[i].value;
          if (ps[i]) ps[i].innerText = inpsDesc[i].value;
          if (h3s[i+5]) h3s[i+5].innerText = inpsTitle[i].value;
          if (ps[i+5]) ps[i+5].innerText = inpsDesc[i].value;
        }
        
        persistChanges();
      };
    }

    else if (tabId === 'depoimentos') {
      var data = getDepoimentosData();
      html = '<div class="oadmin-card"><div class="oadmin-card-title">Cabeçalho (Depoimentos)</div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Tagline</label>'
        + '<input type="text" class="oadmin-input" id="depo-label" value="' + escAttr(data.label) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Título Principal (HTML)</label>'
        + '<textarea class="oadmin-textarea" id="depo-title" style="min-height:80px;">' + data.titleHTML + '</textarea></div></div>'
        
        + '<div class="oadmin-card"><div class="oadmin-card-title">Conteúdo do Depoimento</div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Texto do Depoimento</label>'
        + '<textarea class="oadmin-textarea" id="depo-quote" style="min-height:100px;">' + data.quote + '</textarea></div>'
        + '<div class="oadmin-form-row"><div class="oadmin-form-group"><label class="oadmin-label">Nome do Cliente</label>'
        + '<input type="text" class="oadmin-input" id="depo-author" value="' + escAttr(data.authorName) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Cargo / Empresa (HTML)</label>'
        + '<input type="text" class="oadmin-input" id="depo-role" value="' + escAttr(data.authorRoleHTML) + '"></div></div></div>'
        
        + '<div class="oadmin-form-actions"><button class="oadmin-btn-cancel" id="cancel-depo">Cancelar</button>'
        + '<button class="oadmin-btn-save" id="save-depo">💾 Salvar alterações</button></div>';
        
      container.innerHTML = html;
      document.getElementById('cancel-depo').onclick = closeDashboard;
      document.getElementById('save-depo').onclick = function() {
        var section = document.getElementById('depoimentos');
        var labelEl = section.querySelector('.section-label');
        if (labelEl) labelEl.innerText = document.getElementById('depo-label').value;
        var h2 = section.querySelector('h2');
        if (h2) h2.innerHTML = document.getElementById('depo-title').value;
        
        var pEls = section.querySelectorAll('p');
        for (var i = 0; i < pEls.length; i++) {
          if (pEls[i].className.indexOf('text-xl') !== -1 || pEls[i].className.indexOf('text-2xl') !== -1) {
            pEls[i].innerText = document.getElementById('depo-quote').value;
            break;
          }
        }
        var authorNameEl = section.querySelector('.text-white.font-bold.text-sm');
        if (authorNameEl) authorNameEl.innerText = document.getElementById('depo-author').value;
        
        var allDivs = section.querySelectorAll('div');
        for (var j = 0; j < allDivs.length; j++) {
          if (allDivs[j].className.indexOf('text-white/40') !== -1 && allDivs[j].className.indexOf('text-xs') !== -1 && allDivs[j].innerHTML.indexOf('CEO') !== -1) {
            allDivs[j].innerHTML = document.getElementById('depo-role').value;
            break;
          }
        }
        
        persistChanges();
      };
    }

    else if (tabId === 'contato') {
      var data = getContatoData();
      var fData = getFooterContatoEls();
      var fAddrText = (fData.address && fData.address.lastChild) ? fData.address.lastChild.textContent.trim() : '';
      var fEmailText = (fData.email && fData.email.lastChild) ? fData.email.lastChild.textContent.trim() : '';
      var fWppText = (fData.wppA && fData.wppA.firstChild) ? fData.wppA.firstChild.textContent.trim() : '';
      var fWppLink = fData.wppA ? (fData.wppA.getAttribute('href') || '') : '';

      html = '<div class="oadmin-card"><div class="oadmin-card-title">Seção Contato</div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Tagline</label>'
        + '<input type="text" class="oadmin-input" id="ct-label" value="' + escAttr(data.label) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Título Principal (HTML)</label>'
        + '<textarea class="oadmin-textarea" id="ct-title" style="min-height:80px;">' + data.titleHTML + '</textarea></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Descrição</label>'
        + '<textarea class="oadmin-textarea" id="ct-desc" style="min-height:80px;">' + data.desc + '</textarea></div>'
        + '<div class="oadmin-form-row"><div class="oadmin-form-group"><label class="oadmin-label">Botão Principal</label>'
        + '<input type="text" class="oadmin-input" id="ct-btn-text" value="' + escAttr(data.btnText) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Link do Botão</label>'
        + '<input type="text" class="oadmin-input" id="ct-btn-link" value="' + escAttr(data.btnLink) + '"></div></div></div>'
        
        + '<div class="oadmin-card"><div class="oadmin-card-title">Rodapé (Footer)</div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Endereço</label>'
        + '<input type="text" class="oadmin-input" id="ct-f-addr" value="' + escAttr(fAddrText) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">E-mail</label>'
        + '<input type="text" class="oadmin-input" id="ct-f-email" value="' + escAttr(fEmailText) + '"></div>'
        + '<div class="oadmin-form-row"><div class="oadmin-form-group"><label class="oadmin-label">Texto WhatsApp</label>'
        + '<input type="text" class="oadmin-input" id="ct-f-wpp-txt" value="' + escAttr(fWppText) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Link WhatsApp</label>'
        + '<input type="text" class="oadmin-input" id="ct-f-wpp-lnk" value="' + escAttr(fWppLink) + '"></div></div></div>'

        
        + '<div class="oadmin-form-actions"><button class="oadmin-btn-cancel" id="cancel-ct">Cancelar</button>'
        + '<button class="oadmin-btn-save" id="save-ct">💾 Salvar alterações</button></div>';
        
      container.innerHTML = html;
      document.getElementById('cancel-ct').onclick = closeDashboard;
      document.getElementById('save-ct').onclick = function() {
        var section = document.getElementById('contato');
        var labelEl = section.querySelector('.section-label');
        if (labelEl) labelEl.innerText = document.getElementById('ct-label').value;
        var h2 = section.querySelector('h2');
        if (h2) h2.innerHTML = document.getElementById('ct-title').value;
        var p = section.querySelector('p');
        if (p) p.innerText = document.getElementById('ct-desc').value;
        
        var btn = section.querySelector('.btn-primary');
        if (btn) {
          var svgBackup = btn.querySelector('svg');
          btn.textContent = document.getElementById('ct-btn-text').value;
          if (svgBackup) btn.insertBefore(svgBackup, btn.firstChild);
          btn.setAttribute('href', document.getElementById('ct-btn-link').value);
        }

        var fDataToSave = getFooterContatoEls();
        if (fDataToSave.address && fDataToSave.address.lastChild) {
           fDataToSave.address.lastChild.textContent = document.getElementById('ct-f-addr').value;
        }
        if (fDataToSave.email && fDataToSave.email.lastChild) {
           fDataToSave.email.lastChild.textContent = document.getElementById('ct-f-email').value;
        }
        if (fDataToSave.wppA) {
           if (fDataToSave.wppA.firstChild && fDataToSave.wppA.firstChild.nodeType === 3) {
               fDataToSave.wppA.firstChild.textContent = document.getElementById('ct-f-wpp-txt').value;
           } else {
               // Fallback if firstChild is not text
               var aSvg = fDataToSave.wppA.querySelector('svg');
               fDataToSave.wppA.textContent = document.getElementById('ct-f-wpp-txt').value;
               if (aSvg) fDataToSave.wppA.appendChild(aSvg);
           }
           fDataToSave.wppA.setAttribute('href', document.getElementById('ct-f-wpp-lnk').value);
        }
        
        persistChanges();
      };
    }

    else if (tabId === 'stats') {
      var data = getStatsData();
      html = '<div class="oadmin-card"><div class="oadmin-card-title">Números Iniciais (Hero)</div>'
        + '<div class="oadmin-form-row"><div class="oadmin-form-group"><label class="oadmin-label">Valor (ex: +120 empresas)</label>'
        + '<input type="text" class="oadmin-input" id="stat-emp" value="' + escAttr(data.empresas) + '"></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Legenda</label>'
        + '<input type="text" class="oadmin-input" id="stat-emp-sub" value="' + escAttr(data.empresasSub) + '"></div></div>'
        + '<div class="oadmin-form-group"><label class="oadmin-label">Satisfação %</label>'
        + '<input type="text" class="oadmin-input" id="stat-sat" value="' + escAttr(data.satisfacao) + '"></div></div>';

      if (data.darkStats && data.darkStats.length > 0) {
        html += '<div class="oadmin-card"><div class="oadmin-card-title">Quatro Grandes Estatísticas</div>';
        for (var i = 0; i < data.darkStats.length; i++) {
          html += '<div class="oadmin-form-row">'
            + '<div class="oadmin-form-group"><label class="oadmin-label">Número '+(i+1)+'</label>'
            + '<input type="text" class="oadmin-input" id="dstat-num-'+i+'" value="' + escAttr(data.darkStats[i].num) + '"></div>'
            + '<div class="oadmin-form-group"><label class="oadmin-label">Rótulo '+(i+1)+'</label>'
            + '<input type="text" class="oadmin-input" id="dstat-lbl-'+i+'" value="' + escAttr(data.darkStats[i].label) + '"></div>'
            + '</div>';
        }
        html += '</div>';
      }

      html += '<div class="oadmin-form-actions"><button class="oadmin-btn-cancel" id="cancel-stats">Cancelar</button>'
        + '<button class="oadmin-btn-save" id="save-stats">💾 Salvar alterações</button></div>';

      container.innerHTML = html;
      document.getElementById('cancel-stats').onclick = closeDashboard;
      document.getElementById('save-stats').onclick = function() {
        var els = getStatsElements();
        
        if (els.empresas) els.empresas.innerText = document.getElementById('stat-emp').value;
        if (els.empresasSub) els.empresasSub.innerText = document.getElementById('stat-emp-sub').value;
        if (els.satisfacao) els.satisfacao.innerText = document.getElementById('stat-sat').value;
        
        if (els.darkStats) {
          for(var i=0; i<els.darkStats.length; i++) {
             var numInp = document.getElementById('dstat-num-'+i);
             var lblInp = document.getElementById('dstat-lbl-'+i);
             if (els.darkStats[i].numEl && numInp) els.darkStats[i].numEl.innerText = numInp.value;
             if (els.darkStats[i].labelEl && lblInp) els.darkStats[i].labelEl.innerText = lblInp.value;
          }
        }
        
        persistChanges();
      };
    }
  }

  // Escapa aspas para uso em atributos HTML
  function escAttr(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // --- 5. SALVAMENTO ---
  function persistChanges() {
    var root = document.getElementById('root');
    var clone = root.cloneNode(true);
    clone.style.display = 'block';
    
    // Limpar classes de animação antes de salvar
    var animated = clone.querySelectorAll('.is-visible, .is-hidden');
    for (var i = 0; i < animated.length; i++) {
      animated[i].classList.remove('is-visible', 'is-hidden');
    }
    var mTrack = clone.querySelector('.marquee-track');
    if (mTrack) mTrack.style.removeProperty('animation');

    try {
      localStorage.setItem('ogusmao_site_content', clone.innerHTML);
      var btn = document.querySelector('.oadmin-btn-save');
      if (btn) {
        var orig = btn.innerHTML;
        btn.innerHTML = '✅ Salvo com sucesso!';
        btn.style.background = '#4CAF50';
        setTimeout(function() { btn.innerHTML = orig; btn.style.background = '#D7FF00'; }, 2000);
      }
    } catch(err) {
      alert('Erro ao salvar! O localStorage pode estar cheio.');
    }
  }

})();
