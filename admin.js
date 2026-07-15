// ===================================================
// OGUSMÃO DIGITAL — Sistema de Administração Local
// ===================================================

(function() {
  'use strict';

  // 1. Restaurar dados do localStorage ANTES de iniciar animações
  const savedContent = localStorage.getItem('ogusmao_site_content');
  if (savedContent) {
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = savedContent;
    }
  }

  // 2. Atalho do Teclado para Admin (Ctrl + Shift + Alt + M)
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.altKey && (e.key === 'm' || e.key === 'M')) {
      e.preventDefault();
      showLoginModal();
    }
  });

  function showLoginModal() {
    if (document.getElementById('admin-modal')) return;

    // Remove imediatamente o cursor customizado para que o mouse padrão volte e apareça por cima do modal
    document.body.classList.remove('has-cursor');
    const dots = document.querySelectorAll('.cursor-dot, .cursor-ring');
    dots.forEach(el => el.style.display = 'none');

    const modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100000;
      display: flex; align-items: center; justify-content: center; backdrop-filter: blur(15px);
      font-family: 'Space Grotesk', sans-serif;
    `;

    modal.innerHTML = `
      <div style="background: #1A1A1A; padding: 40px; border-radius: 20px; border: 1px solid rgba(215,255,0,0.3); box-shadow: 0 0 50px rgba(215,255,0,0.1); width: 100%; max-width: 400px; text-align: center; transform: scale(0.9); animation: modalIn 0.3s forwards;">
        <h2 style="color: white; margin-bottom: 8px; font-size: 24px;">Área Administrativa</h2>
        <p style="color: rgba(255,255,255,0.5); margin-bottom: 24px; font-size: 14px;">Insira suas credenciais para editar o site</p>
        <input type="text" id="admin-user" placeholder="Usuário" style="width: 100%; padding: 14px; margin-bottom: 16px; border-radius: 10px; background: #0D0D0D; border: 1px solid rgba(255,255,255,0.1); color: white; font-family: inherit; outline: none;" autocomplete="off">
        <input type="password" id="admin-pass" placeholder="Senha" style="width: 100%; padding: 14px; margin-bottom: 24px; border-radius: 10px; background: #0D0D0D; border: 1px solid rgba(255,255,255,0.1); color: white; font-family: inherit; outline: none;">
        <div style="display: flex; gap: 12px;">
          <button id="admin-cancel" style="flex: 1; padding: 14px; border-radius: 10px; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.2s;">Cancelar</button>
          <button id="admin-login" style="flex: 1; padding: 14px; border-radius: 10px; background: #D7FF00; color: #0D0D0D; border: none; font-weight: bold; cursor: pointer; transition: 0.2s;">Acessar</button>
        </div>
      </div>
      <style>
        @keyframes modalIn { to { transform: scale(1); } }
        #admin-user:focus, #admin-pass:focus { border-color: #D7FF00 !important; }
        #admin-cancel:hover { background: rgba(255,255,255,0.1) !important; }
        #admin-login:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(215,255,0,0.3); }
      </style>
    `;
    document.body.appendChild(modal);

    document.getElementById('admin-cancel').onclick = () => modal.remove();
    document.getElementById('admin-login').onclick = handleLogin;
    document.getElementById('admin-pass').addEventListener('keypress', (e) => { if (e.key === 'Enter') handleLogin(); });

    function handleLogin() {
      const u = document.getElementById('admin-user').value;
      const p = document.getElementById('admin-pass').value;
      if (u === 'JoAliDigital' && p === '06072006') {
        modal.remove();
        activateAdminMode();
      } else {
        alert('❌ Usuário ou senha incorretos.');
      }
    }
  }

  function activateAdminMode() {
    if (document.getElementById('admin-toolbar')) return;

    // Pausar animação de letreiro
    const marquee = document.querySelectorAll('.marquee-track');
    marquee.forEach(el => el.style.animation = 'none');

    // Injetar CSS de destaque de edição
    const style = document.createElement('style');
    style.id = 'admin-highlight-styles';
    style.innerHTML = `
      * { cursor: auto !important; }
      .admin-editable { outline: 1px dashed rgba(215,255,0,0.3); outline-offset: 4px; transition: outline 0.2s; cursor: text !important; }
      .admin-editable:hover { outline: 2px solid #D7FF00; background: rgba(215,255,0,0.05); }
      .admin-editable:focus { outline: 2px solid #00D4FF; background: rgba(0,212,255,0.05); }
      .admin-link { position: relative; cursor: pointer !important; }
      .admin-link::after { content: '🔗'; position: absolute; top: -10px; right: -10px; font-size: 12px; pointer-events: none; opacity: 0.7; }
    `;
    document.head.appendChild(style);

    // Toolbar de controle
    const toolbar = document.createElement('div');
    toolbar.id = 'admin-toolbar';
    toolbar.style.cssText = `
      position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
      background: #D7FF00; color: #0D0D0D; padding: 12px 24px; border-radius: 50px;
      font-weight: bold; font-family: 'Space Grotesk', sans-serif; z-index: 100000;
      box-shadow: 0 10px 40px rgba(215,255,0,0.4); display: flex; align-items: center; gap: 20px;
    `;
    toolbar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px; animation: pulse 2s infinite;">🟢</span> Modo Edição
      </div>
      <button id="admin-save-btn" style="background: #0D0D0D; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer; transition: 0.2s;">
        💾 Salvar Alterações
      </button>
    `;
    document.body.appendChild(toolbar);

    // Evento de Salvar
    document.getElementById('admin-save-btn').onclick = saveChanges;
    document.getElementById('admin-save-btn').onmouseover = function() { this.style.transform = 'translateY(-2px)'; };
    document.getElementById('admin-save-btn').onmouseout = function() { this.style.transform = 'none'; };

    // ----------------------------------------------------
    // MÁGICA: Tornar tudo editável!
    // ----------------------------------------------------
    const root = document.getElementById('root');

    // 1. Encontrar todos os nós de texto e tornar seus pais contenteditable
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const textNodes = [];
    while(node = walker.nextNode()) {
      if(node.nodeValue.trim() !== '' && node.parentElement) {
        textNodes.push(node.parentElement);
      }
    }
    
    const uniqueElements = [...new Set(textNodes)];
    uniqueElements.forEach(el => {
      // Evitar scripts, styles ou containers muito grandes
      if (['SCRIPT','STYLE','svg','path'].includes(el.tagName)) return;
      el.setAttribute('contenteditable', 'true');
      el.classList.add('admin-editable');
    });

    // 2. Prevenir links de navegar e permitir alteração do HREF com duplo clique
    const links = root.querySelectorAll('a');
    links.forEach(a => {
      a.classList.add('admin-link');
      a.addEventListener('click', (e) => e.preventDefault()); // Evita sair da página
      a.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        const url = prompt('🔗 Alterar URL/Destino deste link:', this.getAttribute('href') || '');
        if (url !== null) {
          this.setAttribute('href', url);
        }
      });
    });

    // 3. Imagens / Emojis (Duplo clique para substituir HTML)
    // O site usa emojis ou div de cores em vez de <img>. Vamos permitir editar o HTML de qualquer ícone.
    const icons = root.querySelectorAll('.text-5xl, .w-14.h-14, .w-12.h-12'); // Classes dos ícones/emojis no site
    icons.forEach(icon => {
      icon.title = "Duplo clique para editar o ícone/imagem";
      icon.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        const html = prompt('🖼️ Alterar Ícone ou Emoji (Pode colar código HTML ou Emojis):', this.innerHTML);
        if (html !== null) {
          this.innerHTML = html;
        }
      });
    });

    alert('✨ MODO EDIÇÃO ATIVADO ✨\n\n- Clique em qualquer texto para editar.\n- Dê DUPLO CLIQUE em Links/Botões para mudar a URL de destino.\n- Dê DUPLO CLIQUE em Ícones/Emojis para trocá-los.\n- Clique no botão SALVAR embaixo quando terminar.');
  }

  function saveChanges() {
    const root = document.getElementById('root');
    const clone = root.cloneNode(true);

    // 1. Limpar todas as classes e atributos do admin
    clone.querySelectorAll('.admin-editable').forEach(el => {
      el.removeAttribute('contenteditable');
      el.classList.remove('admin-editable');
    });
    clone.querySelectorAll('.admin-link').forEach(el => {
      el.classList.remove('admin-link');
    });

    // 2. Limpar classes do scroll reveal e mobile menu para que na recarga as animações funcionem limpas
    clone.querySelectorAll('.reveal, .is-visible, .hero-animate, .is-hidden').forEach(el => {
      // Remove is-visible para que o IntersectionObserver possa animá-los de novo no reload
      el.classList.remove('is-visible', 'is-hidden'); 
      // Manter as classes de tipo (reveal-up, etc) para a engine de JS ler depois
    });

    // 3. Restaurar marquee e limpar cursor
    const mTrack = clone.querySelector('.marquee-track');
    if (mTrack) mTrack.style.removeProperty('animation');
    
    // Pegar o HTML final limpo
    const finalHtml = clone.innerHTML;

    // Salvar no localStorage
    try {
      localStorage.setItem('ogusmao_site_content', finalHtml);
      
      const successModal = document.createElement('div');
      successModal.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #D7FF00; color: #0D0D0D;
        padding: 16px 24px; border-radius: 12px; font-weight: bold; z-index: 100000;
        box-shadow: 0 4px 15px rgba(215,255,0,0.4); animation: slideIn 0.3s forwards;
        font-family: 'Space Grotesk', sans-serif;
      `;
      successModal.innerHTML = '✅ Alterações salvas com sucesso!';
      document.body.appendChild(successModal);

      setTimeout(() => {
        window.location.reload(); // Recarrega para aplicar o modo visual normal
      }, 1500);

    } catch(err) {
      alert('Erro ao salvar! O espaço do localStorage pode estar cheio.');
      console.error(err);
    }
  }

})();
