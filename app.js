'use strict';

const WHATSAPP_NUMBER = '60138774261';
const PACKAGE_PRICE = 129;

const iconPaths = {
  tap: '<path d="M8 13V5a2 2 0 0 1 4 0v7m0-3a2 2 0 0 1 4 0v3m0-2a2 2 0 0 1 4 0v5c0 4-2 6-6 6h-1c-2 0-3-1-4-2l-4-5a2 2 0 0 1 3-2l1 1"/><path d="M16 3a5 5 0 0 1 5 4"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a18 18 0 0 0 0 18 18 18 0 0 0 0-18Z"/>',
  message: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.8-5.2a9 9 0 0 1-.8-4.3A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 9h8M8 13h5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5M8 11h5M10.5 8.5v5"/>',
  chart: '<path d="M4 4v16h16M8 15v-3m4 3V8m4 7v-5M7 7l5-3 5 2 4-3"/>',
  award: '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-2 9 5.5-3 5.5 3-2-9M10 8l1.4 1.4L14 7"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4M3 19v3m-1.5-1.5h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>'
};

function makeIcon(name) {
  const paths = iconPaths[name];
  if (!paths) return '';

  return `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      ${paths}
    </svg>
  `;
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initIcons() {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    const icon = makeIcon(el.dataset.icon);

    if (icon) {
      el.innerHTML = icon;
    }
  });
}

function initYear() {
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function initRanking() {
  const rankData = {
    area: {
      name: 'Sendayan Metropark',
      rank: 3,
      total: 24,
      bars: [28, 42, 36, 55, 50, 71, 68, 90, 82, 100]
    },
    district: {
      name: 'Seremban',
      rank: 12,
      total: 86,
      bars: [20, 35, 31, 48, 57, 52, 72, 83, 76, 94]
    },
    state: {
      name: 'Negeri Sembilan',
      rank: 28,
      total: 215,
      bars: [16, 22, 35, 30, 44, 56, 50, 72, 82, 91]
    },
    national: {
      name: 'Seluruh Malaysia',
      rank: 146,
      total: 1840,
      bars: [12, 21, 19, 32, 46, 41, 62, 57, 75, 88]
    }
  };

  const tabs = Array.from(document.querySelectorAll('[data-rank]'));
  const panel = document.getElementById('rank-panel');
  const number = document.getElementById('rank-number');
  const total = document.getElementById('rank-total');
  const location = document.querySelector('.rank-location');
  const bars = Array.from(document.querySelectorAll('.rank-bars span'));

  if (!tabs.length || !panel || !number || !total || !location) {
    return;
  }

  const selectRanking = (tab) => {
    const data = rankData[tab.dataset.rank];

    if (!data) return;

    tabs.forEach((item) => {
      const active = item === tab;

      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });

    panel.setAttribute('aria-labelledby', tab.id);

    location.textContent = data.name;
    number.textContent = data.rank;

    total.textContent =
      `/ ${data.total.toLocaleString('ms-MY')} bisnes`;

    bars.forEach((bar, index) => {
      bar.style.setProperty(
        '--h',
        `${data.bars[index] || 10}%`
      );
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      selectRanking(tab);
    });

    tab.addEventListener('keydown', (event) => {
      let targetIndex;

      if (event.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        targetIndex = (index + tabs.length - 1) % tabs.length;
      } else if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();

      tabs[targetIndex].focus();
      selectRanking(tabs[targetIndex]);
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);

    const name =
      String(data.get('name') || '').trim();

    const business =
      String(data.get('business') || '').trim();

    const question =
      String(data.get('message') || '').trim();

    const feedback =
      document.getElementById('form-feedback');

    if (!name || !business) {
      if (feedback) {
        feedback.textContent =
          'Sila masukkan nama anda dan nama bisnes.';
      }

      return;
    }

    const message = [
      'Hai ASLAS!',
      `Saya ${name} dari ${business}.`,
      question ||
        `Saya berminat dengan pakej ASLAS RM${PACKAGE_PRICE} upfront. Boleh kongsikan cara nak mula?`
    ].join('\n\n');

    const url = buildWhatsAppUrl(message);

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );

    if (feedback) {
      feedback.replaceChildren();

      feedback.append(
        'Jika WhatsApp belum terbuka, '
      );

      const link =
        document.createElement('a');

      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent =
        'buka mesej anda di sini';

      feedback.append(link, '.');
    }
  });
}

function initRevealAnimations() {
  const revealElements =
    document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  if (
    !('IntersectionObserver' in window) ||
    reducedMotion
  ) {
    revealElements.forEach((el) => {
      el.classList.add('visible');
    });

    return;
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.remove(
            'entering'
          );

          entry.target.classList.add(
            'visible'
          );

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -4% 0px'
      }
    );

  revealElements.forEach((el) => {
    if (
      el.getBoundingClientRect().top >
      window.innerHeight
    ) {
      el.classList.add('entering');
      observer.observe(el);
    } else {
      el.classList.add('visible');
    }
  });
}

function initImageFallbacks() {
  document
    .querySelectorAll('img')
    .forEach((img) => {
      const applyFallback = () => {
        const parent = img.parentElement;

        if (
          !parent ||
          parent.dataset.imageFallback ===
            'true'
        ) {
          return;
        }

        parent.dataset.imageFallback =
          'true';

        parent.classList.add(
          'image-fallback'
        );

        img.hidden = true;

        const label =
          document.createElement('span');

        label.className =
          'image-fallback-label';

        label.textContent = 'ASLAS';

        label.setAttribute(
          'aria-hidden',
          'true'
        );

        parent.appendChild(label);
      };

      if (
        img.complete &&
        img.naturalWidth === 0
      ) {
        applyFallback();
      } else {
        img.addEventListener(
          'error',
          applyFallback,
          { once: true }
        );
      }
    });
}

function initMobileWhatsApp() {
  if (
    document.querySelector(
      '.mobile-whatsapp'
    )
  ) {
    return;
  }

  const message =
    `Hai ASLAS! Saya berminat dengan pakej ASLAS RM${PACKAGE_PRICE}. ` +
    'Boleh bantu saya setup Google Review untuk bisnes saya?';

  const link =
    document.createElement('a');

  link.className = 'mobile-whatsapp';

  link.href =
    buildWhatsAppUrl(message);

  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  link.setAttribute(
    'aria-label',
    'Hubungi ASLAS melalui WhatsApp'
  );

  link.innerHTML = `
    <span>WhatsApp ASLAS</span>
    <strong>RM129 →</strong>
  `;

  document.body.appendChild(link);
}

function initStickyHeader() {
  const header =
    document.querySelector('.header');

  if (!header) return;

  const update = () => {
    header.classList.toggle(
      'is-scrolled',
      window.scrollY > 24
    );
  };

  update();

  window.addEventListener(
    'scroll',
    update,
    { passive: true }
  );
}

function injectEnhancementStyles() {
  if (
    document.getElementById(
      'aslas-enhancement-styles'
    )
  ) {
    return;
  }

  const style =
    document.createElement('style');

  style.id =
    'aslas-enhancement-styles';

  style.textContent = `
    .header {
      position: sticky;
      top: 0;
      z-index: 40;
      background: color-mix(
        in srgb,
        var(--paper) 92%,
        transparent
      );
      backdrop-filter: blur(16px);
      transition:
        box-shadow .25s ease,
        background .25s ease;
    }

    .header.is-scrolled {
      box-shadow:
        0 8px 28px
        rgba(56,45,38,.07);
    }

    .image-fallback {
      position: relative;
      background:
        linear-gradient(
          145deg,
          #eee8dd,
          #ddd2c2
        ) !important;
      min-height: 180px;
    }

    .image-fallback:after {
      content: '';
      position: absolute;
      inset: 10%;
      border:
        1px solid
        rgba(89,70,56,.12);
      border-radius: inherit;
    }

    .image-fallback-label {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      font:
        400
        clamp(28px,5vw,56px)/1
        var(--serif);
      letter-spacing: -1px;
      color:
        rgba(89,70,56,.48);
      z-index: 2;
    }

    .mobile-whatsapp {
      display: none;
    }

    @media (max-width: 650px) {

      body {
        padding-bottom: 84px;
      }

      .mobile-whatsapp {
        position: fixed;
        left: 14px;
        right: 14px;
        bottom:
          max(
            12px,
            env(safe-area-inset-bottom)
          );
        z-index: 80;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 16px;

        padding: 15px 18px;

        border:
          1px solid
          rgba(255,255,255,.18);

        border-radius: 12px;

        background: #514032;
        color: #fffdf7;

        box-shadow:
          0 14px 36px
          rgba(56,45,38,.28);

        font-size: 13px;
        font-weight: 600;
        letter-spacing: .01em;
      }

      .mobile-whatsapp strong {
        font-size: 12px;
        font-weight: 600;
        color: #eadfcf;
        white-space: nowrap;
      }
    }
  `;

  document.head.appendChild(style);
}

function injectStructuredData() {
  if (
    document.querySelector(
      'script[data-aslas-schema]'
    )
  ) {
    return;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',

    name: 'ASLAS Starter',

    description:
      'Stand NFC dan QR untuk memudahkan pelanggan berkongsi Google Review serta membantu pemilik bisnes memantau perkembangan reputasi.',

    brand: {
      '@type': 'Brand',
      name: 'ASLAS'
    },

    offers: {
      '@type': 'Offer',
      priceCurrency: 'MYR',
      price: String(PACKAGE_PRICE),

      availability:
        'https://schema.org/InStock',

      url:
        window.location.href.split('#')[0]
    }
  };

  const script =
    document.createElement('script');

  script.type =
    'application/ld+json';

  script.dataset.aslasSchema = 'true';

  script.textContent =
    JSON.stringify(schema);

  document.head.appendChild(script);
}

function init() {
  injectEnhancementStyles();

  initIcons();
  initYear();
  initRanking();
  initContactForm();
  initRevealAnimations();
  initImageFallbacks();
  initMobileWhatsApp();
  initStickyHeader();
  injectStructuredData();
}

if (
  document.readyState === 'loading'
) {
  document.addEventListener(
    'DOMContentLoaded',
    init,
    { once: true }
  );
} else {
  init();
}