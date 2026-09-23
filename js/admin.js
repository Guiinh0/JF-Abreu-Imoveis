/**
 * JF ABREU IMÓVEIS - Admin & Property Manager Controller
 * Allows adding, managing, previewing, and exporting properties
 * Supports direct computer image uploads (FileReader API + Canvas Compression)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('admin-property-form');
  const previewContainer = document.getElementById('live-card-preview-container');
  const propertiesList = document.getElementById('admin-properties-list');
  const totalCountSpan = document.getElementById('total-properties-count');
  const codeContainer = document.getElementById('code-export-container');
  const codeOutput = document.getElementById('code-output');
  const btnCopyCode = document.getElementById('btn-copy-code');
  const btnGenerateCode = document.getElementById('btn-generate-code');
  const btnClearForm = document.getElementById('btn-clear-form');
  const btnResetDefaults = document.getElementById('btn-reset-defaults');

  // ==========================================
  // AUTHENTICATION & SECURITY MANAGEMENT
  // ==========================================
  const loginScreen = document.getElementById('admin-login-screen');
  const dashboardWrap = document.getElementById('admin-dashboard-wrap');
  const authBar = document.getElementById('admin-auth-bar');
  const loggedUserName = document.getElementById('admin-logged-user-name');
  const loginForm = document.getElementById('admin-login-form');
  const loginUser = document.getElementById('admin-user');
  const loginPass = document.getElementById('admin-pass');
  const loginRemember = document.getElementById('admin-remember');
  const loginAlert = document.getElementById('admin-login-alert');
  const btnTogglePassword = document.getElementById('btn-toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const eyeText = document.getElementById('eye-text');
  const btnLogout = document.getElementById('btn-admin-logout');

  // Modal Change Password Elements
  const modalChangePwd = document.getElementById('modal-change-password');
  const btnOpenChangePwd = document.getElementById('btn-open-change-password');
  const btnClosePwdModal = document.getElementById('btn-close-pwd-modal');
  const btnCancelChangePwd = document.getElementById('btn-cancel-change-pwd');
  const formChangePwd = document.getElementById('form-change-password');
  const pwdCurrent = document.getElementById('pwd-current');
  const pwdNew = document.getElementById('pwd-new');
  const pwdConfirm = document.getElementById('pwd-confirm');
  const pwdChangeAlert = document.getElementById('pwd-change-alert');

  // SHA-256 for secure password comparison
  async function sha256(text) {
    if (window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Basic fallback if crypto.subtle is unavailable
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + hash;
  }

  // Default credentials: admin / admin123
  // sha256 of 'admin123': '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
  const DEFAULT_CREDENTIALS = {
    username: 'admin',
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
  };

  function getStoredCredentials() {
    try {
      const saved = localStorage.getItem('jf_admin_auth_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading admin credentials:', e);
    }
    return DEFAULT_CREDENTIALS;
  }

  function saveStoredCredentials(creds) {
    try {
      localStorage.setItem('jf_admin_auth_data', JSON.stringify(creds));
      return true;
    } catch (e) {
      console.error('Error saving credentials:', e);
      return false;
    }
  }

  function isSessionAuthenticated() {
    return (
      sessionStorage.getItem('jf_admin_authenticated') === 'true' ||
      localStorage.getItem('jf_admin_remember_login') === 'true'
    );
  }

  function showDashboardView() {
    if (loginScreen) loginScreen.style.display = 'none';
    if (dashboardWrap) dashboardWrap.style.display = 'block';
    if (authBar) authBar.style.display = 'flex';

    const creds = getStoredCredentials();
    if (loggedUserName) {
      loggedUserName.textContent = creds.username || 'Administrador';
    }

    // Initialize or refresh dashboard preview and property list
    updateLivePreview();
    renderPropertiesList();
  }

  function showLoginView(message = '', isError = true) {
    if (dashboardWrap) dashboardWrap.style.display = 'none';
    if (authBar) authBar.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';

    if (loginAlert) {
      if (message) {
        loginAlert.className = isError ? 'admin-login-alert alert-error' : 'admin-login-alert alert-success';
        loginAlert.innerHTML = `${isError ? '⚠️' : '✅'} <span>${message}</span>`;
        loginAlert.style.display = 'flex';
      } else {
        loginAlert.style.display = 'none';
      }
    }

    setTimeout(() => loginUser?.focus(), 100);
  }

  // Handle Login Submission
  async function handleLoginSubmit(e) {
    e.preventDefault();
    const userVal = loginUser?.value.trim();
    const passVal = loginPass?.value;

    if (!userVal || !passVal) {
      showLoginView('Por favor, informe o usuário e a senha.', true);
      return;
    }

    const creds = getStoredCredentials();
    const hashedInput = await sha256(passVal);

    const isUserValid = userVal.toLowerCase() === creds.username.toLowerCase();
    const isPassValid = hashedInput === creds.passwordHash;

    if (isUserValid && isPassValid) {
      // Set session
      sessionStorage.setItem('jf_admin_authenticated', 'true');
      if (loginRemember?.checked) {
        localStorage.setItem('jf_admin_remember_login', 'true');
      } else {
        localStorage.removeItem('jf_admin_remember_login');
      }

      // Show success feedback
      if (loginAlert) {
        loginAlert.className = 'admin-login-alert alert-success';
        loginAlert.innerHTML = '✅ <span>Autenticado com sucesso! Carregando painel...</span>';
        loginAlert.style.display = 'flex';
      }

      setTimeout(() => {
        if (loginAlert) loginAlert.style.display = 'none';
        showDashboardView();
      }, 400);
    } else {
      showLoginView('Usuário ou senha incorretos. Verifique suas credenciais.', true);
      if (loginPass) {
        loginPass.value = '';
        loginPass.focus();
      }
    }
  }

  // Handle Logout
  function handleLogout() {
    if (confirm('Deseja realmente encerrar a sessão do painel de administração?')) {
      sessionStorage.removeItem('jf_admin_authenticated');
      localStorage.removeItem('jf_admin_remember_login');
      if (loginPass) loginPass.value = '';
      showLoginView('Você saiu com segurança do painel.', false);
    }
  }

  // Password Toggle (Show / Hide)
  btnTogglePassword?.addEventListener('click', () => {
    if (!loginPass) return;
    const isPassword = loginPass.type === 'password';
    loginPass.type = isPassword ? 'text' : 'password';
    if (eyeIcon) eyeIcon.textContent = isPassword ? '🙈' : '👁️';
    if (eyeText) eyeText.textContent = isPassword ? 'Ocultar' : 'Mostrar';
    btnTogglePassword.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
  });

  // Modal Change Password
  btnOpenChangePwd?.addEventListener('click', () => {
    if (modalChangePwd) {
      if (pwdChangeAlert) pwdChangeAlert.style.display = 'none';
      if (formChangePwd) formChangePwd.reset();
      modalChangePwd.showModal();
      setTimeout(() => pwdCurrent?.focus(), 100);
    }
  });

  function closePasswordModal() {
    if (modalChangePwd) {
      modalChangePwd.close();
      if (formChangePwd) formChangePwd.reset();
      if (pwdChangeAlert) pwdChangeAlert.style.display = 'none';
    }
  }

  btnClosePwdModal?.addEventListener('click', closePasswordModal);
  btnCancelChangePwd?.addEventListener('click', closePasswordModal);

  modalChangePwd?.addEventListener('click', (e) => {
    const rect = modalChangePwd.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
      && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      closePasswordModal();
    }
  });

  formChangePwd?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentVal = pwdCurrent?.value;
    const newVal = pwdNew?.value;
    const confirmVal = pwdConfirm?.value;

    const creds = getStoredCredentials();
    const hashedCurrent = await sha256(currentVal);

    if (hashedCurrent !== creds.passwordHash) {
      if (pwdChangeAlert) {
        pwdChangeAlert.className = 'admin-login-alert alert-error';
        pwdChangeAlert.innerHTML = '⚠️ <span>A senha atual está incorreta.</span>';
        pwdChangeAlert.style.display = 'flex';
      }
      pwdCurrent?.focus();
      return;
    }

    if (!newVal || newVal.length < 6) {
      if (pwdChangeAlert) {
        pwdChangeAlert.className = 'admin-login-alert alert-error';
        pwdChangeAlert.innerHTML = '⚠️ <span>A nova senha deve ter no mínimo 6 caracteres.</span>';
        pwdChangeAlert.style.display = 'flex';
      }
      pwdNew?.focus();
      return;
    }

    if (newVal !== confirmVal) {
      if (pwdChangeAlert) {
        pwdChangeAlert.className = 'admin-login-alert alert-error';
        pwdChangeAlert.innerHTML = '⚠️ <span>A confirmação de senha não confere com a nova senha.</span>';
        pwdChangeAlert.style.display = 'flex';
      }
      pwdConfirm?.focus();
      return;
    }

    // Save new password
    const hashedNew = await sha256(newVal);
    saveStoredCredentials({
      username: creds.username,
      passwordHash: hashedNew
    });

    if (pwdChangeAlert) {
      pwdChangeAlert.className = 'admin-login-alert alert-success';
      pwdChangeAlert.innerHTML = '✅ <span>Senha alterada com sucesso!</span>';
      pwdChangeAlert.style.display = 'flex';
    }

    setTimeout(() => {
      closePasswordModal();
      alert('Sua senha de administrador foi atualizada com sucesso!');
    }, 1200);
  });

  // Attach login & logout listeners
  loginForm?.addEventListener('submit', handleLoginSubmit);
  btnLogout?.addEventListener('click', handleLogout);

  // File Upload Elements
  const dropzoneMain = document.getElementById('dropzone-main');
  const fileInputMain = document.getElementById('adm-file-main');
  const dropzoneContentMain = document.getElementById('dropzone-content-main');
  const previewMainBox = document.getElementById('preview-main-box');
  const previewMainImg = document.getElementById('preview-main-img');
  const previewMainFilename = document.getElementById('preview-main-filename');
  const btnRemoveMainImg = document.getElementById('btn-remove-main-img');
  const toggleManualUrl = document.getElementById('toggle-manual-url');
  const manualMainUrlWrap = document.getElementById('manual-main-url-wrap');
  const admImageInput = document.getElementById('adm-image');

  const dropzoneGallery = document.getElementById('dropzone-gallery');
  const fileInputGallery = document.getElementById('adm-file-gallery');
  const galleryPreviewGrid = document.getElementById('gallery-preview-grid');
  const toggleManualGallery = document.getElementById('toggle-manual-gallery');
  const manualGalleryUrlWrap = document.getElementById('manual-gallery-url-wrap');
  const admGalleryInput = document.getElementById('adm-gallery');

  // State for Uploaded Images
  let uploadedMainImage = null; // Base64 data URL
  let uploadedGalleryImages = []; // Array of Base64 data URLs

  // Load custom properties from localStorage
  function getCustomProperties() {
    try {
      return JSON.parse(localStorage.getItem('jf_custom_properties') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCustomProperties(list) {
    try {
      localStorage.setItem('jf_custom_properties', JSON.stringify(list));
      return true;
    } catch (e) {
      console.warn('localStorage storage limit reached, applying automatic compression:', e);
      try {
        // Prune older items or gallery images to stay well within browser limits
        const optimized = list.slice(0, 15).map(item => ({
          ...item,
          gallery: Array.isArray(item.gallery) ? item.gallery.slice(0, 4) : []
        }));
        localStorage.setItem('jf_custom_properties', JSON.stringify(optimized));
        return true;
      } catch (err2) {
        console.error('Failed to write to localStorage:', err2);
        return false;
      }
    }
  }

  // Canvas Image Compression (Optimizes image size to ~960px max for instant loading and safe localStorage storage)
  function compressImage(file, maxWidth = 960, quality = 0.72) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Output as JPEG data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve({
            dataUrl: compressedDataUrl,
            name: file.name
          });
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Setup Main Photo Upload
  function setupMainUpload() {
    if (!dropzoneMain || !fileInputMain) return;

    // File selection
    fileInputMain.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files[0]) {
        handleMainFile(e.target.files[0]);
      }
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzoneMain.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzoneMain.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzoneMain.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzoneMain.classList.remove('dragover');
      }, false);
    });

    dropzoneMain.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleMainFile(e.dataTransfer.files[0]);
      }
    });

    // Remove / Replace
    btnRemoveMainImg?.addEventListener('click', (e) => {
      e.stopPropagation();
      uploadedMainImage = null;
      fileInputMain.value = '';
      previewMainBox.style.display = 'none';
      dropzoneContentMain.style.display = 'flex';
      updateLivePreview();
    });

    // Toggle manual URL input
    toggleManualUrl?.addEventListener('click', () => {
      manualMainUrlWrap.style.display = manualMainUrlWrap.style.display === 'none' ? 'block' : 'none';
    });
  }

  async function handleMainFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem (JPG, PNG ou WebP).');
      return;
    }

    try {
      const res = await compressImage(file, 960, 0.75);
      uploadedMainImage = res.dataUrl;

      previewMainImg.src = res.dataUrl;
      previewMainFilename.textContent = `Arquivo: ${res.name}`;
      previewMainBox.style.display = 'flex';
      dropzoneContentMain.style.display = 'none';

      // Update manual input if empty
      if (admImageInput && !admImageInput.value) {
        admImageInput.value = `[Foto do computador: ${res.name}]`;
      }

      updateLivePreview();
    } catch (err) {
      console.error('Error compressing main image:', err);
      alert('Não foi possível carregar a foto selecionada.');
    }
  }

  // Setup Gallery Upload (Multiple Files)
  function setupGalleryUpload() {
    if (!dropzoneGallery || !fileInputGallery) return;

    fileInputGallery.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleGalleryFiles(e.target.files);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzoneGallery.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzoneGallery.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzoneGallery.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzoneGallery.classList.remove('dragover');
      }, false);
    });

    dropzoneGallery.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleGalleryFiles(e.dataTransfer.files);
      }
    });

    toggleManualGallery?.addEventListener('click', () => {
      manualGalleryUrlWrap.style.display = manualGalleryUrlWrap.style.display === 'none' ? 'block' : 'none';
    });
  }

  async function handleGalleryFiles(files) {
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        try {
          const res = await compressImage(file, 960, 0.72);
          uploadedGalleryImages.push({
            dataUrl: res.dataUrl,
            name: file.name
          });
        } catch (err) {
          console.error('Error compressing gallery image:', err);
        }
      }
    }
    renderGalleryThumbnails();
  }

  function renderGalleryThumbnails() {
    if (!galleryPreviewGrid) return;

    if (uploadedGalleryImages.length === 0) {
      galleryPreviewGrid.style.display = 'none';
      return;
    }

    galleryPreviewGrid.style.display = 'grid';
    galleryPreviewGrid.innerHTML = uploadedGalleryImages.map((img, idx) => `
      <div class="gallery-thumb-item" title="${img.name}">
        <img src="${img.dataUrl}" alt="" />
        <button type="button" class="gallery-thumb-remove" data-remove-thumb="${idx}" title="Remover esta foto">✕</button>
      </div>
    `).join('');

    galleryPreviewGrid.querySelectorAll('[data-remove-thumb]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-remove-thumb'), 10);
        uploadedGalleryImages.splice(index, 1);
        renderGalleryThumbnails();
      });
    });
  }

  // Live Card Preview
  function updateLivePreview() {
    const ref = document.getElementById('adm-ref')?.value || '000';
    const title = document.getElementById('adm-title')?.value || 'Título do Imóvel';
    const purpose = document.getElementById('adm-purpose')?.value || 'venda';
    const priceNum = parseInt(document.getElementById('adm-price')?.value, 10) || 0;
    const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(priceNum);
    const location = `${document.getElementById('adm-neighborhood')?.value || 'Costa do Sol'}, Bertioga - SP`;
    const distance = document.getElementById('adm-distance')?.value || 'Perto da Praia';
    const beds = document.getElementById('adm-beds')?.value || 3;
    const suites = document.getElementById('adm-suites')?.value || 2;
    const baths = document.getElementById('adm-baths')?.value || 2;
    const land = document.getElementById('adm-land')?.value || '373 m²';
    const badge = document.getElementById('adm-badge')?.value || 'Alto Padrão';
    
    // Choose image: uploaded file > manual text > fallback
    let image = 'assets/properties/ref-001.webp';
    if (uploadedMainImage) {
      image = uploadedMainImage;
    } else if (admImageInput?.value && !admImageInput.value.startsWith('[Foto')) {
      image = admImageInput.value;
    }

    previewContainer.innerHTML = `
      <article class="property-card" style="box-shadow:var(--shadow-md);">
        <div class="card-image-wrap">
          <img src="${image}" alt="${title}" onerror="this.src='assets/properties/ref-001.webp'" />
          <div class="card-badge-top">
            <span class="badge-ref">REF ${ref}</span>
            <span class="badge-feature">${badge}</span>
          </div>
          <div class="card-distance-tag">
            🌊 ${distance}
          </div>
        </div>
        <div class="card-content">
          <div class="card-location">📍 ${location}</div>
          <h3 class="card-title">${title}</h3>
          <div class="card-specs">
            <div class="spec-item">
              <span class="spec-value">${beds}</span>
              <span class="spec-label">Quartos</span>
            </div>
            <div class="spec-item">
              <span class="spec-value">${suites}</span>
              <span class="spec-label">Suítes</span>
            </div>
            <div class="spec-item">
              <span class="spec-value">${baths}</span>
              <span class="spec-label">Banh.</span>
            </div>
            <div class="spec-item">
              <span class="spec-value">${land}</span>
              <span class="spec-label">Área</span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-price-block">
              <span class="price-label">${purpose === 'locacao' ? 'Locação' : 'Venda'}</span>
              <span class="price-value">${priceFormatted}</span>
            </div>
            <div class="card-actions">
              <a href="imovel.html?ref=${ref}" target="_blank" class="btn-card-details">
                Ver Página →
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Render Existing List
  function renderPropertiesList() {
    const all = typeof getActiveProperties === 'function' ? getActiveProperties() : PROPERTIES_DATA;
    if (totalCountSpan) totalCountSpan.textContent = all.length;

    if (!propertiesList) return;

    if (all.length === 0) {
      propertiesList.innerHTML = `
        <div style="text-align:center; padding:32px 16px; background:var(--color-sand-50); border:1.5px dashed var(--color-gray-300); border-radius:var(--radius-md);">
          <div style="font-size:2.2rem; margin-bottom:8px;">🏖️</div>
          <div style="font-weight:700; color:var(--color-navy-900); font-size:1rem; margin-bottom:6px;">Nenhum imóvel ativo no catálogo</div>
          <p style="font-size:0.82rem; color:var(--color-gray-500); margin-bottom:14px; max-width:320px; margin-left:auto; margin-right:auto;">
            Todos os imóveis foram removidos. Você pode cadastrar novos imóveis exclusivos no formulário ao lado ou restaurar os exemplos originais.
          </p>
          <button type="button" id="btn-empty-restore" style="padding:7px 14px; background:var(--color-navy-900); color:var(--color-gold-400); border-radius:var(--radius-sm); font-size:0.8rem; font-weight:700; cursor:pointer;">
            🔄 Restaurar Imóveis Padrão
          </button>
        </div>
      `;
      document.getElementById('btn-empty-restore')?.addEventListener('click', () => {
        if (typeof restoreDefaultProperties === 'function') {
          restoreDefaultProperties();
        }
        renderPropertiesList();
      });
      return;
    }

    propertiesList.innerHTML = all.map((item) => {
      return `
        <div class="admin-property-item">
          <div class="admin-property-item-left">
            <img src="${item.image}" alt="" class="admin-property-item-thumb" />
            <div class="admin-property-item-info">
              <div class="admin-property-item-title">
                Ref. ${item.ref} - ${item.title}
              </div>
              <div class="admin-property-item-meta">
                ${item.priceFormatted} • ${item.neighborhood || 'Bertioga'}
              </div>
            </div>
          </div>
          <div class="admin-property-item-actions">
            <a href="imovel.html?ref=${item.ref}" target="_blank" class="btn-item-view" title="Ver página deste imóvel">
              Ver ↗
            </a>
            <button type="button" data-delete-ref="${item.ref}" class="btn-item-delete" title="Excluir imóvel (vendido ou removido)">
              🗑️ Excluir
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Hook delete buttons
    propertiesList.querySelectorAll('[data-delete-ref]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ref = btn.getAttribute('data-delete-ref');
        if (confirm(`Tem certeza que deseja excluir o imóvel Ref. ${ref}?\n\nEle será removido imediatamente do site e do catálogo público.`)) {
          if (typeof deleteProperty === 'function') {
            deleteProperty(ref);
          } else {
            const currentCustom = getCustomProperties().filter(p => String(p.ref).trim().toLowerCase() !== String(ref).trim().toLowerCase());
            saveCustomProperties(currentCustom);
          }
          renderPropertiesList();
        }
      });
    });
  }

  // Build property object from form
  function getFormData() {
    const ref = document.getElementById('adm-ref').value.trim();
    const title = document.getElementById('adm-title').value.trim();
    const subtitle = document.getElementById('adm-subtitle').value.trim();
    const purpose = document.getElementById('adm-purpose').value;
    const type = document.getElementById('adm-type').value;
    const neighborhood = document.getElementById('adm-neighborhood').value;
    const price = parseInt(document.getElementById('adm-price').value, 10) || 0;
    const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price);
    const distanceBeach = document.getElementById('adm-distance').value.trim();
    const bedrooms = parseInt(document.getElementById('adm-beds').value, 10) || 1;
    const suites = parseInt(document.getElementById('adm-suites').value, 10) || 0;
    const bathrooms = parseInt(document.getElementById('adm-baths').value, 10) || 1;
    const parking = parseInt(document.getElementById('adm-parking').value, 10) || 1;
    const landArea = document.getElementById('adm-land').value.trim() || '373 m²';
    const builtArea = document.getElementById('adm-built').value.trim() || '250 m²';
    const badge = document.getElementById('adm-badge').value;
    
    // Choose Main Image
    let image = 'assets/properties/ref-001.webp';
    if (uploadedMainImage) {
      image = uploadedMainImage;
    } else if (admImageInput?.value && !admImageInput.value.startsWith('[Foto')) {
      image = admImageInput.value.trim();
    }

    // Choose Gallery Images
    let gallery = [];
    if (uploadedGalleryImages.length > 0) {
      gallery = uploadedGalleryImages.map(img => img.dataUrl);
    } else {
      const galleryRaw = document.getElementById('adm-gallery').value.trim();
      gallery = galleryRaw ? galleryRaw.split(',').map(s => s.trim()).filter(Boolean) : [image];
    }
    if (!gallery.includes(image)) {
      gallery.unshift(image);
    }

    const description = document.getElementById('adm-desc').value.trim();
    const featuresRaw = document.getElementById('adm-features').value.trim();
    const features = featuresRaw ? featuresRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    return {
      id: `ref-${ref}`,
      ref: ref,
      title: title,
      subtitle: subtitle || 'Imóvel exclusivo em Bertioga',
      purpose: purpose,
      type: type,
      price: price,
      priceFormatted: priceFormatted,
      location: `${neighborhood}, Bertioga - SP`,
      neighborhood: neighborhood,
      distanceBeach: distanceBeach,
      bedrooms: bedrooms,
      suites: suites,
      bathrooms: bathrooms,
      parking: parking,
      landArea: landArea,
      builtArea: builtArea,
      featured: true,
      badge: badge,
      image: image,
      gallery: gallery,
      description: description,
      features: features
    };
  }

  // Attach input listeners
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', updateLivePreview);
    input.addEventListener('change', updateLivePreview);
  });

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const prop = getFormData();
    if (!prop.ref || !prop.title || !prop.price) {
      alert('Por favor, preencha a referência, título e preço do imóvel.');
      return;
    }

    const cleanRef = String(prop.ref).trim();

    // 1. Save to localStorage array (filtering previous duplicate of same ref)
    const currentCustom = getCustomProperties().filter(p => String(p.ref).trim().toLowerCase() !== cleanRef.toLowerCase());
    currentCustom.unshift(prop);
    const saved = saveCustomProperties(currentCustom);

    // 2. Save direct key in sessionStorage and localStorage for instant lookup
    try {
      sessionStorage.setItem('jf_last_saved_property', JSON.stringify(prop));
      sessionStorage.setItem('jf_property_' + cleanRef.toLowerCase(), JSON.stringify(prop));
      sessionStorage.setItem('jf_property_' + cleanRef, JSON.stringify(prop));
      localStorage.setItem('jf_property_' + cleanRef.toLowerCase(), JSON.stringify(prop));
      localStorage.setItem('jf_property_' + cleanRef, JSON.stringify(prop));
    } catch (err) {
      console.warn('Direct property save note:', err);
    }

    renderPropertiesList();

    if (!saved) {
      alert('Aviso: Armazenamento local do navegador atingiu o limite de fotos. O imóvel foi salvo para visualização imediata nesta sessão, mas considere restaurar padrões para liberar espaço.');
    }

    const openSingle = confirm(`🎉 Imóvel Ref. ${prop.ref} salvo com sucesso no site!\n\nDeseja abrir a página individual do imóvel agora?`);
    if (openSingle) {
      window.open(`imovel.html?ref=${encodeURIComponent(cleanRef)}`, '_blank');
    }
  });

  // Generate Code Handler
  btnGenerateCode?.addEventListener('click', () => {
    const prop = getFormData();
    // For exported code, keep gallery and image clean if base64
    const propToExport = { ...prop };
    if (propToExport.image && propToExport.image.startsWith('data:image')) {
      propToExport.image = `assets/properties/ref-${prop.ref}.jpg`;
    }
    propToExport.gallery = propToExport.gallery.map((g, i) => g.startsWith('data:image') ? `assets/properties/ref-${prop.ref}-${i + 1}.jpg` : g);

    const formattedJSON = JSON.stringify(propToExport, null, 2);
    codeOutput.textContent = `  // Adicione este bloco dentro do array BASE_PROPERTIES_DATA em js/properties-data.js:\n  ${formattedJSON},`;
    codeContainer.style.display = 'block';
    codeContainer.scrollIntoView({ behavior: 'smooth' });
  });

  // Copy Code Button
  btnCopyCode?.addEventListener('click', () => {
    navigator.clipboard.writeText(codeOutput.textContent);
    alert('Código copiado para a área de transferência! Cole em js/properties-data.js');
  });

  // Clear Form
  btnClearForm?.addEventListener('click', () => {
    form.reset();
    uploadedMainImage = null;
    uploadedGalleryImages = [];
    previewMainBox.style.display = 'none';
    dropzoneContentMain.style.display = 'flex';
    galleryPreviewGrid.style.display = 'none';
    galleryPreviewGrid.innerHTML = '';
    updateLivePreview();
    codeContainer.style.display = 'none';
  });

  // Clear All Properties
  const btnClearAll = document.getElementById('btn-clear-all-properties');
  btnClearAll?.addEventListener('click', () => {
    if (confirm('⚠️ ATENÇÃO: Tem certeza que deseja remover TODOS os imóveis do site?\n\nO catálogo ficará totalmente vazio para você cadastrar seus próprios imóveis exclusivos.')) {
      if (typeof clearAllProperties === 'function') {
        clearAllProperties();
      } else {
        localStorage.setItem('jf_clear_base', 'true');
        localStorage.setItem('jf_custom_properties', JSON.stringify([]));
        localStorage.setItem('jf_deleted_refs', JSON.stringify([]));
      }
      renderPropertiesList();
      alert('Todos os imóveis foram removidos do site!');
    }
  });

  // Reset defaults
  btnResetDefaults?.addEventListener('click', () => {
    if (confirm('Deseja restaurar o catálogo para os imóveis originais de demonstração?')) {
      if (typeof restoreDefaultProperties === 'function') {
        restoreDefaultProperties();
      } else {
        localStorage.removeItem('jf_clear_base');
        localStorage.setItem('jf_deleted_refs', JSON.stringify([]));
      }
      renderPropertiesList();
      alert('Imóveis originais restaurados com sucesso!');
    }
  });

  // Init
  setupMainUpload();
  setupGalleryUpload();

  // Check Authentication status
  if (isSessionAuthenticated()) {
    showDashboardView();
  } else {
    showLoginView();
  }
});
