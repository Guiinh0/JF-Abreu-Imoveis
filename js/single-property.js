/**
 * JF ABREU IMÓVEIS - Single Property Page Controller
 * Handles URL parsing (?ref=...), dynamic data population, lightbox, contact modals, and sharing
 */

document.addEventListener('DOMContentLoaded', () => {
  // Helper to get all properties (base + custom from localStorage and sessionStorage)
  function getFullPropertiesList() {
    if (typeof getActiveProperties === 'function') {
      return getActiveProperties();
    }
    if (typeof PROPERTIES_DATA !== 'undefined' && Array.isArray(PROPERTIES_DATA)) {
      return PROPERTIES_DATA;
    }
    return (typeof BASE_PROPERTIES_DATA !== 'undefined') ? BASE_PROPERTIES_DATA : [];
  }

  // 1. Get Property Reference from URL (?ref=001 or ?id=ref-001)
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');
  const idParam = urlParams.get('id');

  const allProps = getFullPropertiesList();
  let property = null;

  if (refParam) {
    const cleanRef = String(refParam).trim().toLowerCase();
    // 1. Exact ref match
    property = allProps.find(p => String(p.ref).trim().toLowerCase() === cleanRef);
    // 2. ID match or ref- prefix match
    if (!property) {
      property = allProps.find(p => String(p.id).trim().toLowerCase() === cleanRef || String(p.id).trim().toLowerCase() === `ref-${cleanRef}`);
    }
    // 3. Numeric match (e.g. 008 vs 8, 999 vs 999)
    if (!property) {
      const numRef = parseInt(cleanRef, 10);
      if (!isNaN(numRef)) {
        property = allProps.find(p => parseInt(String(p.ref), 10) === numRef);
      }
    }
  } else if (idParam) {
    const cleanId = String(idParam).trim().toLowerCase();
    property = allProps.find(p => String(p.id).trim().toLowerCase() === cleanId || String(p.ref).trim().toLowerCase() === cleanId);
    if (!property) {
      const numId = parseInt(cleanId.replace(/\D/g, ''), 10);
      if (!isNaN(numId)) {
        property = allProps.find(p => parseInt(String(p.ref), 10) === numId);
      }
    }
  }

  // Direct key check as fallback in localStorage and sessionStorage
  if (!property && refParam) {
    const cleanRef = String(refParam).trim();
    try {
      const direct = localStorage.getItem('jf_property_' + cleanRef) || 
                     localStorage.getItem('jf_property_ref-' + cleanRef) ||
                     sessionStorage.getItem('jf_property_' + cleanRef);
      if (direct) property = JSON.parse(direct);
    } catch (e) {}

    // Check last saved property if matching
    if (!property) {
      try {
        const lastSaved = sessionStorage.getItem('jf_last_saved_property');
        if (lastSaved) {
          const parsed = JSON.parse(lastSaved);
          if (String(parsed.ref).trim().toLowerCase() === cleanRef.toLowerCase() ||
              parseInt(parsed.ref, 10) === parseInt(cleanRef, 10)) {
            property = parsed;
          }
        }
      } catch (e) {}
    }
  }

  // Check if explicitly marked as deleted
  const deletedRefs = (typeof getDeletedRefs === 'function') ? getDeletedRefs() : JSON.parse(localStorage.getItem('jf_deleted_refs') || '[]');
  const isDeleted = deletedRefs.some(r => String(r).trim().toLowerCase() === String(refParam || idParam || '').trim().toLowerCase());
  if (isDeleted) {
    property = null;
  }

  // Fallback handling
  if (!property) {
    if (!refParam && !idParam) {
      // User visited imovel.html directly without reference: show showcase default
      property = allProps[0] || (typeof PROPERTIES_DATA !== 'undefined' ? PROPERTIES_DATA[0] : null);
    } else {
      // User specifically requested a reference that doesn't exist or was deleted/sold
      renderNotFoundState(refParam || idParam, allProps);
      return;
    }
  }

  // Populate Page Data
  populatePropertyData(property);

  // Setup Gallery & Lightbox
  setupLightbox(property);

  // Setup Inquiry Form
  setupInquiryForm(property);

  // Setup Share Button
  setupShareButton(property);

  // Render Similar Properties
  renderSimilarProperties(property);
});

function renderNotFoundState(requestedRef, allProps) {
  document.title = `Imóvel Não Disponível | JF Abreu Imóveis`;
  const mainWrapper = document.querySelector('.single-property-wrapper');
  if (!mainWrapper) return;

  mainWrapper.innerHTML = `
    <div class="container" style="padding: 70px 20px; text-align: center;">
      <div style="max-width: 620px; margin: 0 auto; background: white; padding: 48px 36px; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); border: 1px solid var(--color-gray-200);">
        <div style="font-size: 3.5rem; margin-bottom: 16px;">🏖️✨</div>
        <h1 style="font-family: var(--font-display); font-size: 1.8rem; color: var(--color-navy-950); margin-bottom: 12px;">
          Imóvel Não Disponível ou Já Vendido
        </h1>
        <p style="color: var(--color-gray-600); font-size: 1rem; line-height: 1.6; margin-bottom: 28px;">
          O imóvel Ref. ${requestedRef || ''} não está mais disponível em nosso catálogo (pode ter sido vendido ou retirado). Confira outras opções disponíveis em nosso portal ou consulte nossos corretores.
        </p>
        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <a href="index.html#imoveis" class="btn-primary-cta" style="padding: 12px 24px; background:linear-gradient(135deg, var(--color-gold-500), var(--color-gold-600)); color:var(--color-navy-950); font-weight:700; border-radius:var(--radius-sm); text-decoration:none;">
            ← Ver Imóveis Disponíveis
          </a>
          <a href="https://wa.me/5513997198462?text=Olá! Gostaria de consultar opções semelhantes ao imóvel Ref. ${requestedRef}" target="_blank" class="btn-header-cta" style="padding: 12px 24px; background: var(--color-navy-900); color: var(--color-gold-400); border-radius:var(--radius-sm); font-weight:700; text-decoration:none;">
            💬 Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;
}

function populatePropertyData(prop) {
  if (!prop) return;

  const ref = prop.ref || '000';
  const title = prop.title || 'Imóvel Exclusivo';
  const subtitle = prop.subtitle || 'Imóvel de Alto Padrão em Bertioga';
  const location = prop.location || `${prop.neighborhood || 'Costa do Sol'}, Bertioga - SP`;
  const neighborhood = prop.neighborhood || 'Costa do Sol';
  const distance = prop.distanceBeach || 'Perto da Praia';
  const priceFormatted = prop.priceFormatted || (prop.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(prop.price) : 'Consulte-nos');
  const description = prop.description || 'Entre em contato para saber mais detalhes sobre este imóvel exclusivo.';
  const features = Array.isArray(prop.features) ? prop.features : [];

  // Document Title & Meta
  document.title = `Ref. ${ref} - ${title} | JF Abreu Imóveis`;
  const metaDesc = document.getElementById('meta-description');
  if (metaDesc) metaDesc.content = `${title} em ${location}. ${description.slice(0, 150)}...`;

  // Breadcrumb
  const breadcrumbRef = document.getElementById('breadcrumb-current-ref');
  if (breadcrumbRef) breadcrumbRef.textContent = `Ref. ${ref}`;

  // Badges
  const badgeRef = document.getElementById('prop-badge-ref');
  if (badgeRef) badgeRef.textContent = `REFERÊNCIA ${ref}`;

  const badgePurpose = document.getElementById('prop-badge-purpose');
  if (badgePurpose) badgePurpose.textContent = prop.purpose === 'locacao' ? 'Locação Anual' : 'Venda';

  const badgeTag = document.getElementById('prop-badge-tag');
  if (badgeTag) badgeTag.textContent = prop.badge || 'Exclusivo';

  // Title & Location
  const titleEl = document.getElementById('prop-title');
  if (titleEl) titleEl.textContent = title;

  const subtitleEl = document.getElementById('prop-subtitle');
  if (subtitleEl) subtitleEl.textContent = subtitle;

  const locationEl = document.getElementById('prop-location');
  if (locationEl) locationEl.textContent = location;

  const distanceEl = document.getElementById('prop-distance');
  if (distanceEl) distanceEl.textContent = distance;

  const distBox = document.getElementById('prop-dist-box');
  if (distBox) distBox.textContent = distance;

  const nbName = document.getElementById('prop-neighborhood-name');
  if (nbName) nbName.textContent = neighborhood;

  // Price
  const priceLabel = document.getElementById('prop-price-label');
  if (priceLabel) priceLabel.textContent = prop.purpose === 'locacao' ? 'Valor da Locação' : 'Valor de Venda';

  const priceEl = document.getElementById('prop-price');
  if (priceEl) priceEl.textContent = priceFormatted;

  // Specs
  const setSpec = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = (val !== undefined && val !== null) ? val : '-';
  };
  setSpec('spec-beds', prop.bedrooms);
  setSpec('spec-suites', prop.suites);
  setSpec('spec-baths', prop.bathrooms);
  setSpec('spec-parking', prop.parking);
  setSpec('spec-land', prop.landArea);
  setSpec('spec-built', prop.builtArea);

  // Description
  const descContainer = document.getElementById('prop-description-container');
  if (descContainer) {
    descContainer.innerHTML = `
      <p class="single-text-p">${description}</p>
      <p class="single-text-p" style="color:var(--color-navy-800); font-weight:600;">
        📍 Agende sua visita com os corretores da JF Abreu Imóveis e conheça pessoalmente todos os detalhes desta oportunidade em Bertioga.
      </p>
    `;
  }

  // Features
  const featuresGrid = document.getElementById('prop-features-grid');
  if (featuresGrid) {
    if (features.length > 0) {
      featuresGrid.innerHTML = features.map(feat => `
        <div class="single-feature-tag">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          <span>${feat}</span>
        </div>
      `).join('');
    } else {
      featuresGrid.innerHTML = `
        <div class="single-feature-tag">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          <span>Consulte diferenciais com nossos corretores</span>
        </div>
      `;
    }
  }

  // Direct WhatsApp buttons in sidebar
  const currentUrl = window.location.href;
  const msgCinthia = encodeURIComponent(`Olá Cinthia! Tenho interesse no imóvel Ref. ${ref} (${title} - ${priceFormatted}). Link: ${currentUrl}`);
  const msgEdson = encodeURIComponent(`Olá Edson! Gostaria de agendar uma visita para o imóvel Ref. ${ref} (${title} - ${priceFormatted}). Link: ${currentUrl}`);

  const btnCinthia = document.getElementById('btn-wa-cinthia');
  if (btnCinthia) btnCinthia.href = `https://wa.me/5513997198462?text=${msgCinthia}`;

  const btnEdson = document.getElementById('btn-wa-edson');
  if (btnEdson) btnEdson.href = `https://wa.me/5513997718950?text=${msgEdson}`;
}

function setupLightbox(prop) {
  if (!prop) return;
  const mainImg = document.getElementById('gallery-main-img');
  const subImg1 = document.getElementById('gallery-sub-img-1');
  const subImg2 = document.getElementById('gallery-sub-img-2');

  const fallbackImg = 'assets/properties/ref-001.webp';
  const defaultImg = prop.image || fallbackImg;
  const gallery = (Array.isArray(prop.gallery) && prop.gallery.length > 0) ? prop.gallery : [defaultImg];

  if (mainImg) mainImg.src = gallery[0] || defaultImg;
  if (subImg1) subImg1.src = gallery[1] || gallery[0] || defaultImg;
  if (subImg2) subImg2.src = gallery[2] || gallery[0] || defaultImg;

  // Lightbox Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxMainImg = document.getElementById('lightbox-main-img');
  const lightboxThumbs = document.getElementById('lightbox-thumbs');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  function openLightbox(initialIndex = 0) {
    if (!lightboxModal || !lightboxMainImg) return;
    lightboxMainImg.src = gallery[initialIndex] || gallery[0];

    if (lightboxThumbs) {
      lightboxThumbs.innerHTML = gallery.map((src, idx) => `
        <img src="${src}" class="gallery-thumb ${idx === initialIndex ? 'active' : ''}" style="width:70px; height:50px; object-fit:cover; border-radius:6px; cursor:pointer; opacity:${idx === initialIndex ? 1 : 0.6}; border:2px solid ${idx === initialIndex ? 'var(--color-gold-400)' : 'transparent'};" data-idx="${idx}" />
      `).join('');

      lightboxThumbs.querySelectorAll('img').forEach(t => {
        t.addEventListener('click', () => {
          const idx = parseInt(t.getAttribute('data-idx'), 10);
          lightboxMainImg.src = gallery[idx];
          lightboxThumbs.querySelectorAll('img').forEach(im => {
            im.style.opacity = '0.6';
            im.style.borderColor = 'transparent';
          });
          t.style.opacity = '1';
          t.style.borderColor = 'var(--color-gold-400)';
        });
      });
    }

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('btn-open-lightbox-main')?.addEventListener('click', () => openLightbox(0));
  document.getElementById('thumb-frame-1')?.addEventListener('click', () => openLightbox(1));
  document.getElementById('thumb-frame-2')?.addEventListener('click', () => openLightbox(2));
  document.getElementById('btn-open-lightbox-all')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(0);
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}


function setupInquiryForm(prop) {
  const form = document.getElementById('single-inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inquiry-name')?.value || '';
    const phone = document.getElementById('inquiry-phone')?.value || '';
    const msg = document.getElementById('inquiry-msg')?.value || '';

    const text = encodeURIComponent(`Olá equipe JF Abreu! Mensagem recebida sobre o imóvel Ref. ${prop.ref} (${prop.title} - ${prop.priceFormatted}):\n- Cliente: ${name}\n- WhatsApp: ${phone}\n- Mensagem: ${msg}`);

    window.open(`https://wa.me/5513997198462?text=${text}`, '_blank');
    form.reset();
  });
}

function setupShareButton(prop) {
  const btnShare = document.getElementById('btn-share-property');
  if (!btnShare) return;

  btnShare.addEventListener('click', async () => {
    const shareData = {
      title: `${prop.title} | JF Abreu Imóveis`,
      text: `Confira este imóvel incrível em Bertioga: ${prop.title} (${prop.priceFormatted})`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link do imóvel copiado com sucesso! Você já pode compartilhar.');
    }
  });
}

function renderSimilarProperties(currentProp) {
  const grid = document.getElementById('similar-properties-grid');
  if (!grid) return;

  // Filter out current property, pick up to 3 similar
  const similar = PROPERTIES_DATA.filter(p => p.id !== currentProp.id).slice(0, 3);

  grid.innerHTML = similar.map(item => `
    <article class="property-card" style="cursor:pointer;" onclick="window.location.href='imovel.html?ref=${item.ref}'">
      <div class="card-image-wrap">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
        <div class="card-badge-top">
          <span class="badge-ref">REF ${item.ref}</span>
          <span class="badge-feature">${item.badge}</span>
        </div>
        <div class="card-distance-tag">
          ${item.distanceBeach}
        </div>
      </div>
      <div class="card-content">
        <div class="card-location">📍 ${item.location}</div>
        <h3 class="card-title">${item.title}</h3>
        <div class="card-footer">
          <div class="card-price-block">
            <span class="price-label">${item.purpose === 'locacao' ? 'Locação' : 'Venda'}</span>
            <span class="price-value">${item.priceFormatted}</span>
          </div>
          <a href="imovel.html?ref=${item.ref}" class="btn-card-details">
            Ver Imóvel →
          </a>
        </div>
      </div>
    </article>
  `).join('');
}
