/**
 * JF ABREU IMÓVEIS - Interactive Application Controller
 * High-End 3D & Real Estate Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  // State Management
  const state = {
    searchQuery: '',
    purpose: 'todos', // 'todos', 'venda', 'locacao'
    neighborhood: 'todos',
    bedrooms: 'todos',
    maxPrice: Infinity,
    sortBy: 'default',
    currentPropertyModal: null
  };

  // DOM Elements
  const propertiesGrid = document.getElementById('properties-grid');
  const propertiesCountEl = document.getElementById('properties-count');
  const searchInput = document.getElementById('search-input');
  const filterPurposeBtns = document.querySelectorAll('[data-filter-purpose]');
  const filterNeighborhoodSelect = document.getElementById('filter-neighborhood');
  const filterBedroomsSelect = document.getElementById('filter-bedrooms');
  const filterPriceSelect = document.getElementById('filter-price');
  const filterSortSelect = document.getElementById('filter-sort');
  const clearFiltersBtn = document.getElementById('btn-clear-filters');
  
  // Modal Elements
  const propertyModal = document.getElementById('property-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');



  // Floating WhatsApp Widget
  const waFloatingTrigger = document.getElementById('floating-wa-trigger');
  const waAgentsMenu = document.getElementById('wa-agents-menu');

  // Mobile Menu
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Header Scroll Observer
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 1. INITIALIZE THREE.JS 3D HERO CANVAS
  initHero3DCanvas();

  // 2. RENDER PROPERTIES
  renderProperties();

  // 3. ATTACH EVENT LISTENERS
  setupFilterListeners();
  initNeighborhoodsCarousel();
  setupFloatingWhatsApp();
  setupMobileNav();
  setupLeadForm();

  // =========================================================================
  // 1. THREE.JS LUXURY PARTICLES & WAVE EXPERIENCE
  // =========================================================================
  function initHero3DCanvas() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 400;
      camera.position.y = 100;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create Particle Wave
      const particleCount = 1800;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);

      let i = 0, j = 0;
      const numX = 60;
      const numZ = 30;
      const separation = 35;

      for (let ix = 0; ix < numX; ix++) {
        for (let iz = 0; iz < numZ; iz++) {
          positions[i] = ix * separation - ((numX * separation) / 2); // x
          positions[i + 1] = 0; // y
          positions[i + 2] = iz * separation - ((numZ * separation) / 2); // z
          scales[j] = 1;
          i += 3;
          j++;
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

      // Gold & Coastal Teal Particle Shader Material
      const material = new THREE.PointsMaterial({
        color: 0xd4af37, // Champagne Gold
        size: 3.5,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      let mouseX = 0, mouseY = 0;
      let targetX = 0, targetY = 0;
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.3;
        mouseY = (event.clientY - windowHalfY) * 0.3;
      }, { passive: true });

      let count = 0;

      function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        camera.position.x = targetX;
        camera.position.y = 120 + -targetY * 0.4;
        camera.lookAt(scene.position);

        const positionAttr = particles.geometry.attributes.position;
        let pIndex = 0;
        count += 0.04;

        for (let ix = 0; ix < numX; ix++) {
          for (let iz = 0; iz < numZ; iz++) {
            // Elegant ocean wave equation
            positionAttr.array[pIndex + 1] = 
              (Math.sin((ix + count) * 0.3) * 35) + 
              (Math.sin((iz + count) * 0.5) * 35);
            pIndex += 3;
          }
        }
        positionAttr.needsUpdate = true;

        renderer.render(scene, camera);
      }

      animate();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

    } catch (e) {
      console.warn('Three.js canvas init deferred:', e);
    }
  }

  // =========================================================================
  // 2. PROPERTIES FILTER & RENDERING
  // =========================================================================
  function updateNeighborhoodCounts(allProperties) {
    const list = allProperties || ((typeof getActiveProperties === 'function') ? getActiveProperties() : PROPERTIES_DATA);
    const clean = str => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const countFor = (term) => {
      const t = clean(term);
      return list.filter(item => {
        const n = clean(item.neighborhood);
        const l = clean(item.location);
        return n.includes(t) || l.includes(t);
      }).length;
    };

    const boraceiaCount = countFor('boraceia');
    const costaCount = countFor('costa do sol');
    const indaiaCount = countFor('indaia');
    const rivieraCount = countFor('riviera');
    const guarujaCount = countFor('guaruja');
    const mogiCount = countFor('mogi');

    const formatBadge = (count) => {
      if (count === 0) return '0 Imóveis Disponíveis';
      if (count === 1) return '1 Imóvel Disponível';
      return `${count} Imóveis Disponíveis`;
    };

    const elBoraceia = document.querySelector('[data-count-target="boraceia"]');
    if (elBoraceia) elBoraceia.textContent = formatBadge(boraceiaCount);

    const elCosta = document.querySelector('[data-count-target="costa-do-sol"]');
    if (elCosta) elCosta.textContent = formatBadge(costaCount);

    const elIndaia = document.querySelector('[data-count-target="indaia"]');
    if (elIndaia) elIndaia.textContent = formatBadge(indaiaCount);

    const elRiviera = document.querySelector('[data-count-target="riviera"]');
    if (elRiviera) elRiviera.textContent = formatBadge(rivieraCount);

    const elGuaruja = document.querySelector('[data-count-target="guaruja"]');
    if (elGuaruja) elGuaruja.textContent = formatBadge(guarujaCount);

    const elMogi = document.querySelector('[data-count-target="mogi"]');
    if (elMogi) elMogi.textContent = formatBadge(mogiCount);
  }

  function getFilteredProperties() {
    const listSource = (typeof getActiveProperties === 'function') ? getActiveProperties() : PROPERTIES_DATA;
    const clean = str => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return listSource.filter(item => {
      // Purpose
      if (state.purpose !== 'todos' && item.purpose !== state.purpose) {
        return false;
      }
      // Neighborhood
      if (state.neighborhood !== 'todos') {
        const n = clean(item.neighborhood);
        const l = clean(item.location);
        const target = clean(state.neighborhood);
        if (!n.includes(target) && !l.includes(target)) {
          return false;
        }
      }
      // Bedrooms
      if (state.bedrooms !== 'todos') {
        const minBeds = parseInt(state.bedrooms, 10);
        if (item.bedrooms < minBeds) return false;
      }
      // Max Price
      if (state.maxPrice !== Infinity && item.price > state.maxPrice) {
        return false;
      }
      // Search Query
      if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase();
        const matchesRef = (item.ref || '').toLowerCase().includes(q);
        const matchesTitle = (item.title || '').toLowerCase().includes(q);
        const matchesLocation = (item.location || '').toLowerCase().includes(q);
        const matchesNeighborhood = (item.neighborhood || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesType = (item.type || '').toLowerCase().includes(q);
        const matchesDistance = (item.distanceBeach || '').toLowerCase().includes(q);
        if (!matchesRef && !matchesTitle && !matchesLocation && !matchesNeighborhood && !matchesDesc && !matchesType && !matchesDistance) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'price-asc') return a.price - b.price;
      if (state.sortBy === 'price-desc') return b.price - a.price;
      if (state.sortBy === 'rooms-desc') return b.bedrooms - a.bedrooms;
      return 0; // Default order
    });
  }

  function renderProperties() {
    const list = getFilteredProperties();
    const allActive = (typeof getActiveProperties === 'function') ? getActiveProperties() : PROPERTIES_DATA;
    updateNeighborhoodCounts(allActive);

    if (allActive.length === 0) {
      propertiesCountEl.textContent = `Nenhum imóvel cadastrado no momento`;
      propertiesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; background: white; border-radius: var(--radius-lg); border: 1px solid var(--color-gray-200); box-shadow: var(--shadow-sm);">
          <div style="font-size: 3rem; margin-bottom: 14px;">🏖️✨</div>
          <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--color-navy-900); margin-bottom: 10px;">Catálogo em Atualização</h3>
          <p style="color: var(--color-gray-600); font-size: 1rem; max-width: 540px; margin: 0 auto 24px; line-height: 1.6;">
            Nossa equipe está cadastrando novos imóveis exclusivos de alto padrão em Bertioga, Costa do Sol e Guaratuba. Fale conosco no WhatsApp para consultar oportunidades exclusivas off-market.
          </p>
          <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
            <a href="https://wa.me/5513997198462?text=Olá! Gostaria de consultar imóveis de alto padrão disponíveis em Bertioga" target="_blank" rel="noopener" class="btn-search-submit" style="display:inline-flex; width:auto; text-decoration:none; margin: 0 auto;">
              💬 Consultar Imóveis no WhatsApp
            </a>
            <button id="btn-restore-samples" style="background:transparent; border:none; color:var(--color-navy-700); font-size:0.85rem; text-decoration:underline; cursor:pointer; padding:6px 12px;">
              🔄 Restaurar Imóveis Padrão de Demonstração
            </button>
          </div>
        </div>
      `;
      document.getElementById('btn-restore-samples')?.addEventListener('click', () => {
        if (typeof restoreDefaultProperties === 'function') {
          restoreDefaultProperties();
          renderProperties();
        }
      });
      return;
    }

    propertiesCountEl.textContent = `Exibindo ${list.length} ${list.length === 1 ? 'imóvel exclusivo' : 'imóveis exclusivos'}`;

    if (list.length === 0) {
      propertiesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: var(--radius-lg); border: 1px solid var(--color-gray-200);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🏖️</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-navy-900); margin-bottom: 8px;">Nenhum imóvel encontrado com esses filtros</h3>
          <p style="color: var(--color-gray-500); margin-bottom: 20px;">Tente ajustar os critérios de busca ou fale diretamente com nossos corretores.</p>
          <button id="btn-reset-empty" style="padding: 10px 24px; background: var(--color-navy-900); color: var(--color-gold-400); border-radius: var(--radius-full); font-weight: 700; cursor:pointer;">
            Limpar Todos os Filtros
          </button>
        </div>
      `;
      document.getElementById('btn-reset-empty')?.addEventListener('click', resetFilters);
      return;
    }

    propertiesGrid.innerHTML = list.map(item => createPropertyCardHTML(item)).join('');

    // Attach 3D Card Tilt and Event Listeners
    attachCardEvents();
  }

  function createPropertyCardHTML(item) {
    const isRental = item.purpose === 'locacao';
    const waText = encodeURIComponent(`Olá Cinthia/Edson! Gostaria de mais informações sobre o imóvel Ref. ${item.ref} (${item.title} - ${item.priceFormatted}) anunciado no site.`);

    return `
      <article class="property-card" data-property-id="${item.id}">
        <div class="card-image-wrap">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <div class="card-badge-top">
            <span class="badge-ref">REF ${item.ref}</span>
            <span class="badge-feature">${item.badge}</span>
          </div>
          <div class="card-distance-tag">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            ${item.distanceBeach}
          </div>
        </div>

        <div class="card-content">
          <div class="card-location">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            ${item.location}
          </div>

          <h3 class="card-title"><a href="imovel.html?ref=${item.ref}" style="color:inherit;">${item.title}</a></h3>

          <div class="card-specs">
            <div class="spec-item" title="${item.bedrooms} Quartos">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>
              <span class="spec-value">${item.bedrooms}</span>
              <span class="spec-label">Quartos</span>
            </div>
            <div class="spec-item" title="${item.suites} Suítes">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              <span class="spec-value">${item.suites}</span>
              <span class="spec-label">Suítes</span>
            </div>
            <div class="spec-item" title="${item.bathrooms} Banheiros">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 10.78V8c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78-.53-.48-1.23-.78-2-.78H6C4.35 5 3 6.35 3 8v2.78C1.84 11.4 1 12.6 1 14v1c0 1.66 1.34 3 3 3h.18L5 20h2l-.82-2h11.64L17 20h2l-.82-2H19c1.66 0 3-1.34 3-3v-1c0-1.4-.84-2.6-2-3.22z"/></svg>
              <span class="spec-value">${item.bathrooms}</span>
              <span class="spec-label">Banh.</span>
            </div>
            <div class="spec-item" title="${item.landArea} de Terreno">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
              <span class="spec-value">${item.landArea.replace(' ', '')}</span>
              <span class="spec-label">Área</span>
            </div>
          </div>

          <div class="card-footer">
            <div class="card-price-block">
              <span class="price-label">${isRental ? 'Locação Anual' : 'Valor de Venda'}</span>
              <span class="price-value">${item.priceFormatted}</span>
            </div>
            <div class="card-actions">
              <a href="imovel.html?ref=${item.ref}" class="btn-card-details">
                Ver Imóvel →
              </a>
              <button class="btn-card-quickview" data-open-modal="${item.id}" title="Visualização Rápida">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              <a href="https://wa.me/5513997198462?text=${waText}" target="_blank" rel="noopener" class="btn-card-whatsapp" title="Falar no WhatsApp com Cinthia">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // 3D Perspective Tilt on Card Hover
  function attachCardEvents() {
    const cards = document.querySelectorAll('.property-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });

      // Click card to open modal (unless clicking direct WA button)
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-card-whatsapp')) {
          const propId = card.getAttribute('data-property-id');
          openPropertyModal(propId);
        }
      });
    });

    // Modal buttons
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-open-modal');
        openPropertyModal(id);
      });
    });
  }

  // =========================================================================
  // 3. PROPERTY DETAIL MODAL
  // =========================================================================
  function openPropertyModal(id) {
    const prop = PROPERTIES_DATA.find(p => p.id === id);
    if (!prop || !propertyModal) return;

    state.currentPropertyModal = prop;

    const modalContent = document.getElementById('modal-dynamic-content');
    const waTextCinthia = encodeURIComponent(`Olá Cinthia! Vi o imóvel Ref. ${prop.ref} (${prop.title} - ${prop.priceFormatted}) no site da JF Abreu e gostaria de agendar uma visita presencial.`);
    const waTextEdson = encodeURIComponent(`Olá Edson! Tenho interesse no imóvel Ref. ${prop.ref} (${prop.title} - ${prop.priceFormatted}) no site da JF Abreu e gostaria de consultar as condições.`);

    modalContent.innerHTML = `
      <div class="modal-gallery">
        <img id="modal-active-img" class="modal-gallery-main" src="${prop.gallery[0] || prop.image}" alt="${prop.title}" />
        <div class="modal-gallery-thumbs">
          ${prop.gallery.map((imgSrc, idx) => `
            <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-thumb-src="${imgSrc}">
              <img src="${imgSrc}" alt="Foto ${idx + 1}" />
            </div>
          `).join('')}
        </div>
      </div>

      <div class="modal-body">
        <div class="modal-header-info">
          <div class="modal-title-area">
            <span class="badge-ref" style="display:inline-block; margin-bottom:8px;">REFERÊNCIA ${prop.ref}</span>
            <h2>${prop.title}</h2>
            <p>📍 ${prop.location} • 🌊 ${prop.distanceBeach}</p>
          </div>
          <div class="modal-price-area">
            <span class="modal-price-note">${prop.purpose === 'locacao' ? 'Valor da Locação' : 'Valor de Venda'}</span>
            <div class="modal-price-val">${prop.priceFormatted}</div>
          </div>
        </div>

        <div class="modal-features-grid">
          <div class="modal-feat-badge">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>
            ${prop.bedrooms} Dormitórios (${prop.suites} Suítes)
          </div>
          <div class="modal-feat-badge">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 10.78V8c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78-.53-.48-1.23-.78-2-.78H6C4.35 5 3 6.35 3 8v2.78C1.84 11.4 1 12.6 1 14v1c0 1.66 1.34 3 3 3h.18L5 20h2l-.82-2h11.64L17 20h2l-.82-2H19c1.66 0 3-1.34 3-3v-1c0-1.4-.84-2.6-2-3.22z"/></svg>
            ${prop.bathrooms} Banheiros
          </div>
          <div class="modal-feat-badge">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/></svg>
            ${prop.parking} Vagas de Garagem
          </div>
          <div class="modal-feat-badge">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
            Terreno: ${prop.landArea}
          </div>
        </div>

        <h4 style="font-size: 1.1rem; color: var(--color-navy-900); margin-bottom: 12px; font-weight: 700;">Sobre o Imóvel</h4>
        <p class="modal-desc-text">${prop.description}</p>

        <h4 style="font-size: 1.1rem; color: var(--color-navy-900); margin-bottom: 14px; font-weight: 700;">Diferenciais & Lazer</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px;">
          ${prop.features.map(f => `
            <span style="padding: 6px 14px; background: var(--color-sand-100); border: 1px solid var(--color-gray-200); border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600; color: var(--color-navy-800);">
              ✓ ${f}
            </span>
          `).join('')}
        </div>

        <!-- Direct Contact Corretor Box -->
        <div class="modal-agent-contact-box">
          <div class="modal-agent-left">
            <div class="agent-icon">🏡</div>
            <div class="agent-text">
              <h4>Fale com os Especialistas da JF Abreu</h4>
              <p>Atendimento exclusivo • Agendamento de visitas com segurança</p>
            </div>
          </div>
          <div class="modal-cta-buttons">
            <a href="imovel.html?ref=${prop.ref}" class="btn-agent-whatsapp" style="background:#09172a; border:1px solid var(--color-gold-500); color:var(--color-gold-400);">
              Abrir Página Completa ↗
            </a>
            <a href="https://wa.me/5513997198462?text=${waTextCinthia}" target="_blank" rel="noopener" class="btn-agent-whatsapp">
              WhatsApp Cinthia
            </a>
            <a href="https://wa.me/5513997718950?text=${waTextEdson}" target="_blank" rel="noopener" class="btn-agent-whatsapp" style="background:#0e223d; border: 1px solid var(--color-gold-500); color:var(--color-gold-400);">
              WhatsApp Edson
            </a>
          </div>
        </div>
      </div>
    `;

    // Hook thumbnail click
    modalContent.querySelectorAll('.gallery-thumb').forEach(th => {
      th.addEventListener('click', () => {
        modalContent.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        th.classList.add('active');
        const mainImg = document.getElementById('modal-active-img');
        if (mainImg) mainImg.src = th.getAttribute('data-thumb-src');
      });
    });

    propertyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePropertyModal() {
    if (!propertyModal) return;
    propertyModal.classList.remove('active');
    document.body.style.overflow = '';
    state.currentPropertyModal = null;
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePropertyModal);
  if (propertyModal) {
    propertyModal.addEventListener('click', (e) => {
      if (e.target === propertyModal) closePropertyModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePropertyModal();
  });

  // =========================================================================
  // 4. FILTER CONTROLS & LISTENERS
  // =========================================================================
  function setupFilterListeners() {
    // Purpose Tabs (Comprar / Alugar / Todos)
    filterPurposeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterPurposeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.purpose = btn.getAttribute('data-filter-purpose');
        renderProperties();
      });
    });

    // Search Input with Debounce
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderProperties();
      });
    }

    // Neighborhood Select
    if (filterNeighborhoodSelect) {
      filterNeighborhoodSelect.addEventListener('change', (e) => {
        state.neighborhood = e.target.value;
        renderProperties();
      });
    }

    // Bedrooms Select
    if (filterBedroomsSelect) {
      filterBedroomsSelect.addEventListener('change', (e) => {
        state.bedrooms = e.target.value;
        renderProperties();
      });
    }

    // Price Select
    if (filterPriceSelect) {
      filterPriceSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        state.maxPrice = val === 'todos' ? Infinity : parseInt(val, 10);
        renderProperties();
      });
    }

    // Sort Select
    if (filterSortSelect) {
      filterSortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderProperties();
      });
    }

    // Clear Filters
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', resetFilters);
    }

    // Hero Search Form Submission
    const heroSearchForm = document.getElementById('hero-search-form');
    if (heroSearchForm) {
      heroSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const heroLocation = document.getElementById('hero-search-location')?.value || 'todos';
        const heroType = document.getElementById('hero-search-type')?.value || 'todos';
        const heroPrice = document.getElementById('hero-search-price')?.value || 'todos';

        state.neighborhood = heroLocation;
        state.maxPrice = heroPrice === 'todos' ? Infinity : parseInt(heroPrice, 10);

        if (filterNeighborhoodSelect) filterNeighborhoodSelect.value = heroLocation;
        if (filterPriceSelect) filterPriceSelect.value = heroPrice;

        renderProperties();

        // Scroll smoothly to properties section
        document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Neighborhood links click shortcuts (rodapé e outros links externos ao carrossel)
    document.querySelectorAll('.footer-links [data-neighborhood-filter]').forEach(link => {
      link.addEventListener('click', (e) => {
        const nb = link.getAttribute('data-neighborhood-filter');
        state.neighborhood = nb;
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (filterNeighborhoodSelect) filterNeighborhoodSelect.value = nb;
        renderProperties();
        document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function resetFilters() {
    state.searchQuery = '';
    state.purpose = 'todos';
    state.neighborhood = 'todos';
    state.bedrooms = 'todos';
    state.maxPrice = Infinity;
    state.sortBy = 'default';

    if (searchInput) searchInput.value = '';
    if (filterNeighborhoodSelect) filterNeighborhoodSelect.value = 'todos';
    if (filterBedroomsSelect) filterBedroomsSelect.value = 'todos';
    if (filterPriceSelect) filterPriceSelect.value = 'todos';
    if (filterSortSelect) filterSortSelect.value = 'default';

    filterPurposeBtns.forEach(btn => {
      if (btn.getAttribute('data-filter-purpose') === 'todos') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderProperties();
  }


  // =========================================================================
  // 5. NEIGHBORHOODS COVERFLOW CAROUSEL (EFEITO FOCO 3D)
  // =========================================================================
  function initNeighborhoodsCarousel() {
    const viewport = document.getElementById('neighborhoods-viewport');
    const track = document.getElementById('neighborhoods-track');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');
    const dots = document.querySelectorAll('.carousel-dot');
    const cards = track ? track.querySelectorAll('.neighborhood-card') : [];

    if (!viewport || !track || cards.length === 0) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    let isUserInteracting = false;
    const AUTOPLAY_INTERVAL = 3800; // 3.8 segundos

    // Atualiza classes, dots e translação matemática para centralizar o card ativo
    function updateCoverFlow(targetIndex, smooth = true) {
      // Garante índice cíclico no intervalo [0, cards.length - 1]
      currentIndex = ((targetIndex % cards.length) + cards.length) % cards.length;

      // Atualiza classes nos cards (card central fica nítido, laterais com blur e escala menor)
      cards.forEach((card, idx) => {
        const isActive = idx === currentIndex;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      // Atualiza indicadores (dots)
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });

      // Cálculo de centralização no viewport
      const activeCard = cards[currentIndex];
      if (!activeCard) return;

      const cardCenter = activeCard.offsetLeft + (activeCard.offsetWidth / 2);
      const viewportCenter = viewport.clientWidth / 2;
      const targetTranslateX = viewportCenter - cardCenter;

      if (!smooth) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
      }

      track.style.transform = `translateX(${targetTranslateX}px)`;

      if (!smooth) {
        // Força reflow e restaura a transição suave
        track.offsetHeight;
        track.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
      }
    }

    // Controle do Autoplay
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        if (!isUserInteracting) {
          updateCoverFlow(currentIndex + 1, true);
        }
      }, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      setTimeout(startAutoplay, 800);
    }

    // Pausa inteligente ao passar o mouse ou interagir
    const container = track.closest('.neighborhoods-carousel-container') || viewport;
    container.addEventListener('mouseenter', () => { isUserInteracting = true; });
    container.addEventListener('mouseleave', () => { isUserInteracting = false; });

    // Setas de navegação
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateCoverFlow(currentIndex + 1, true);
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateCoverFlow(currentIndex - 1, true);
        restartAutoplay();
      });
    }

    // Clique direto nos dots
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        updateCoverFlow(idx, true);
        restartAutoplay();
      });
    });

    // Clique nos cards:
    // - Se o card NÃO é o central, traz ele para o centro (foco).
    // - Se o card já é o central, filtra o catálogo e rola até os imóveis!
    cards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        if (idx !== currentIndex) {
          e.preventDefault();
          e.stopPropagation();
          updateCoverFlow(idx, true);
          restartAutoplay();
          return;
        }

        // Card já está ativo: filtra pelo bairro
        const nb = card.getAttribute('data-neighborhood-filter');
        if (nb) {
          state.neighborhood = nb;
          state.searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (filterNeighborhoodSelect) filterNeighborhoodSelect.value = nb;
          renderProperties();
          document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Suporte a Touch Swipe e Mouse Drag
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let initialTranslateX = 0;

    function getTrackTranslateX() {
      const transform = window.getComputedStyle(track).transform;
      if (!transform || transform === 'none') return 0;
      const match = transform.match(/matrix.*\((.+)\)/);
      if (match) {
        const parts = match[1].split(', ');
        return parseFloat(parts[4]) || 0;
      }
      return 0;
    }

    function onDragStart(clientX) {
      isUserInteracting = true;
      isDragging = true;
      startX = clientX;
      currentX = clientX;
      initialTranslateX = getTrackTranslateX();
      track.style.transition = 'none';
    }

    function onDragMove(clientX) {
      if (!isDragging) return;
      currentX = clientX;
      const diff = currentX - startX;
      track.style.transform = `translateX(${initialTranslateX + diff}px)`;
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      const diff = currentX - startX;
      track.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';

      if (diff < -50) {
        updateCoverFlow(currentIndex + 1, true);
      } else if (diff > 50) {
        updateCoverFlow(currentIndex - 1, true);
      } else {
        updateCoverFlow(currentIndex, true);
      }

      setTimeout(() => { isUserInteracting = false; }, 2500);
      restartAutoplay();
    }

    // Touch events (mobile)
    viewport.addEventListener('touchstart', (e) => {
      onDragStart(e.touches[0].clientX);
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      onDragMove(e.touches[0].clientX);
    }, { passive: true });

    viewport.addEventListener('touchend', onDragEnd, { passive: true });
    viewport.addEventListener('touchcancel', onDragEnd, { passive: true });

    // Redimensionamento responsivo da janela
    window.addEventListener('resize', () => {
      updateCoverFlow(currentIndex, false);
    });

    // Inicializa na posição correta
    updateCoverFlow(0, false);
    // Reforça após o carregamento completo de imagens e fontes
    window.addEventListener('load', () => {
      updateCoverFlow(0, false);
    });

    startAutoplay();
  }


  // =========================================================================
  // 6. FLOATING DUAL-AGENT WHATSAPP WIDGET
  // =========================================================================
  function setupFloatingWhatsApp() {
    if (!waFloatingTrigger || !waAgentsMenu) return;

    waFloatingTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      waAgentsMenu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!waAgentsMenu.contains(e.target) && e.target !== waFloatingTrigger) {
        waAgentsMenu.classList.remove('open');
      }
    });
  }

  // =========================================================================
  // 7. MOBILE NAVIGATION TOGGLE
  // =========================================================================
  function setupMobileNav() {
    if (!mobileToggle || !navLinks) return;

    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      if (isOpen) {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(9, 23, 42, 0.98)';
        navLinks.style.padding = '24px';
        navLinks.style.borderBottom = '1px solid rgba(212, 175, 55, 0.3)';
        navLinks.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // =========================================================================
  // 8. ANUNCIE SEU IMÓVEL (LEAD FORM DISPATCH TO WHATSAPP)
  // =========================================================================
  function setupLeadForm() {
    const leadForm = document.getElementById('lead-anuncie-form');
    if (!leadForm) return;

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('lead-name')?.value || '';
      const telefone = document.getElementById('lead-phone')?.value || '';
      const tipo = document.getElementById('lead-type')?.value || '';
      const bairro = document.getElementById('lead-neighborhood')?.value || '';
      const finalidade = document.getElementById('lead-purpose')?.value || '';

      const msg = encodeURIComponent(`Olá equipe JF Abreu Imóveis! Gostaria de cadastrar/anunciar meu imóvel com vocês:\n- Proprietário: ${nome}\n- WhatsApp: ${telefone}\n- Tipo de Imóvel: ${tipo}\n- Região: ${bairro}\n- Finalidade: ${finalidade}\nPodem me orientar sobre os próximos passos?`);

      window.open(`https://wa.me/5513997198462?text=${msg}`, '_blank');
      leadForm.reset();
      alert('Obrigado! Abrindo o WhatsApp com nossa equipe para dar andamento ao seu cadastro.');
    });
  }

  // Multi-tab sync: updates listing and counts in real-time when properties are added/removed in admin
  window.addEventListener('storage', () => {
    renderProperties();
  });
});
