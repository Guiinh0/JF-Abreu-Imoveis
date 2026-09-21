/**
 * JF ABREU IMÓVEIS - Luxury Custom Select Dropdown System
 * Replaces generic OS select boxes with high-end luxury dropdowns
 * Full two-way event synchronization, keyboard navigation, and luxury coastal styling
 */

function initCustomSelects(container = document) {
  const selects = container.querySelectorAll(
    '.search-select, .sort-select, .custom-select, select.luxury-select, .search-field select, .admin-input-group select, .form-group select'
  );

  selects.forEach(select => {
    if (select.dataset.customEnhanced === 'true') return;
    select.dataset.customEnhanced = 'true';

    // Extract icon if inside a .search-input-wrap or based on context
    let iconSvg = '';
    const parentWrap = select.closest('.search-input-wrap');
    if (parentWrap) {
      const existingSvg = parentWrap.querySelector(':scope > svg');
      if (existingSvg) {
        iconSvg = existingSvg.outerHTML;
        existingSvg.style.display = 'none'; // Hide the original absolute SVG
      }
    }

    // Contextual icon fallbacks
    if (!iconSvg) {
      const id = (select.id || '').toLowerCase();
      if (id.includes('location') || id.includes('neighborhood') || id.includes('bairro')) {
        iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
      } else if (id.includes('type') || id.includes('tipo')) {
        iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>';
      } else if (id.includes('price') || id.includes('valor') || id.includes('preco')) {
        iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>';
      } else if (id.includes('bed') || id.includes('quarto') || id.includes('suite')) {
        iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>';
      } else if (id.includes('sort') || id.includes('ordem')) {
        iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg>';
      } else if (id.includes('purpose') || id.includes('finalidade') || id.includes('badge')) {
        iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
      }
    }

    // Determine styling variants
    const isCompact = select.classList.contains('sort-select');
    const isDark = select.closest('.section-dark') || select.closest('#anuncie');
    const wrapper = document.createElement('div');
    wrapper.className = `custom-select-wrapper ${isCompact ? 'compact' : ''} ${isDark ? 'dark' : ''}`;
    if (select.style.minWidth) {
      wrapper.style.minWidth = select.style.minWidth;
    }

    // Place wrapper before select and nest select inside
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add('visually-hidden-select');

    // Build custom trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const selectedOption = select.options[select.selectedIndex] || select.options[0];
    const initialText = selectedOption ? selectedOption.text : 'Selecione';

    trigger.innerHTML = `
      <div class="custom-select-trigger-inner">
        ${iconSvg ? `<span class="custom-select-icon">${iconSvg}</span>` : ''}
        <span class="custom-select-label">${initialText}</span>
      </div>
      <span class="custom-select-arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </span>
    `;
    wrapper.appendChild(trigger);

    // Build custom dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-select-dropdown';
    dropdown.setAttribute('role', 'listbox');

    const optionsList = document.createElement('div');
    optionsList.className = 'custom-select-options-list';
    dropdown.appendChild(optionsList);

    // Luxury bottom delimiter footer showing distinct card ending
    const footerEl = document.createElement('div');
    footerEl.className = 'custom-select-footer';
    footerEl.innerHTML = `<span>✦ JF ABREU IMÓVEIS ✦</span>`;
    dropdown.appendChild(footerEl);

    function buildOptions() {
      optionsList.innerHTML = '';
      Array.from(select.options).forEach((opt, idx) => {
        const optEl = document.createElement('div');
        optEl.className = `custom-select-option ${opt.selected ? 'selected' : ''}`;
        optEl.setAttribute('role', 'option');
        optEl.setAttribute('data-value', opt.value);
        optEl.setAttribute('data-index', idx);
        if (opt.selected) optEl.setAttribute('aria-selected', 'true');

        optEl.innerHTML = `
          <span class="opt-label">${opt.text}</span>
          <span class="check-icon">✓</span>
        `;

        optEl.addEventListener('click', (e) => {
          e.stopPropagation();
          selectOption(idx);
          closeDropdown();
        });

        optionsList.appendChild(optEl);
      });
    }

    buildOptions();
    wrapper.appendChild(dropdown);

    function selectOption(index) {
      if (index < 0 || index >= select.options.length) return;
      select.selectedIndex = index;

      // Update trigger label
      const opt = select.options[index];
      const label = trigger.querySelector('.custom-select-label');
      if (label) label.textContent = opt.text;

      // Update dropdown option classes
      dropdown.querySelectorAll('.custom-select-option').forEach((el, i) => {
        if (i === index) {
          el.classList.add('selected');
          el.setAttribute('aria-selected', 'true');
        } else {
          el.classList.remove('selected');
          el.removeAttribute('aria-selected');
        }
      });

      // Dispatch change event on original native select
      select.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function toggleDropdown() {
      const isOpen = wrapper.classList.contains('open');
      closeAllCustomSelects();
      if (!isOpen) {
        // Calculate viewport space
        const rect = trigger.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const requiredHeight = 240;

        if (spaceBelow < requiredHeight && rect.top > requiredHeight) {
          wrapper.classList.add('dropup');
        } else {
          wrapper.classList.remove('dropup');
        }

        wrapper.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        const selected = dropdown.querySelector('.custom-select-option.selected');
        if (selected) {
          selected.scrollIntoView({ block: 'nearest' });
        }
      }
    }

    function closeDropdown() {
      wrapper.classList.remove('open');
      wrapper.classList.remove('dropup');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Keyboard support on trigger
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Down') {
        e.preventDefault();
        if (!wrapper.classList.contains('open')) {
          toggleDropdown();
        } else {
          const nextIndex = Math.min(select.options.length - 1, select.selectedIndex + 1);
          selectOption(nextIndex);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        e.preventDefault();
        if (!wrapper.classList.contains('open')) {
          toggleDropdown();
        } else {
          const prevIndex = Math.max(0, select.selectedIndex - 1);
          selectOption(prevIndex);
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    function syncFromSelect() {
      const currentOpt = select.options[select.selectedIndex];
      if (currentOpt) {
        const label = trigger.querySelector('.custom-select-label');
        if (label) label.textContent = currentOpt.text;
        dropdown.querySelectorAll('.custom-select-option').forEach((el, i) => {
          if (i === select.selectedIndex) {
            el.classList.add('selected');
            el.setAttribute('aria-selected', 'true');
          } else {
            el.classList.remove('selected');
            el.removeAttribute('aria-selected');
          }
        });
      }
    }

    // Two-way synchronization when select changes
    select.addEventListener('change', syncFromSelect);
    select.addEventListener('input', syncFromSelect);

    // Intercept property setter for value & selectedIndex so programmatic changes update immediately
    try {
      const valDescriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
      if (valDescriptor && valDescriptor.set) {
        Object.defineProperty(select, 'value', {
          get() {
            return valDescriptor.get.call(this);
          },
          set(val) {
            valDescriptor.set.call(this, val);
            syncFromSelect();
          },
          configurable: true
        });
      }

      const idxDescriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex');
      if (idxDescriptor && idxDescriptor.set) {
        Object.defineProperty(select, 'selectedIndex', {
          get() {
            return idxDescriptor.get.call(this);
          },
          set(idx) {
            idxDescriptor.set.call(this, idx);
            syncFromSelect();
          },
          configurable: true
        });
      }
    } catch (err) {
      console.warn('CustomSelect descriptor interception fallback:', err);
    }

    // Observe changes in options
    const observer = new MutationObserver(() => {
      buildOptions();
      const currentOpt = select.options[select.selectedIndex];
      if (currentOpt) {
        const label = trigger.querySelector('.custom-select-label');
        if (label) label.textContent = currentOpt.text;
      }
    });
    observer.observe(select, { childList: true });
  });
}

function closeAllCustomSelects() {
  document.querySelectorAll('.custom-select-wrapper.open').forEach(el => {
    el.classList.remove('open');
    el.classList.remove('dropup');
    const trigger = el.querySelector('.custom-select-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

// Global outside click listener
document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-select-wrapper')) {
    closeAllCustomSelects();
  }
});

// Global Escape key listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllCustomSelects();
  }
});

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCustomSelects());
  } else {
    initCustomSelects();
  }
}
