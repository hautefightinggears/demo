// ============================================================
// MAIN.JS — Haute Fighting Gears
// Shared utilities: navbar, footer, toast, scroll reveal
// ============================================================

const WHATSAPP_NUMBER = '923148968805';

// ── Newsletter subscribe — global, called from footer onclick ─
var HFG_FORMS_URL = 'https://script.google.com/macros/s/AKfycbwuLTiUxHt90U6jqGxI4YBexC0B-qrB2gSsZlhZPtcvrNvI9f5dbEnF-vvtZJWz_zf9/exec';

function subscribeNewsletter() {
  var el = document.getElementById('newsletterEmail') ||
    document.getElementById('newsletter-email');
  var email = el ? el.value.trim() : '';
  if (!email) { alert('Please enter your email address.'); if (el) el.focus(); return; }
  fetch(HFG_FORMS_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ type: 'newsletter', email: email })
  });
  alert('Subscribed');
  if (el) el.value = '';
}

// ── Mobile menu ──────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => nav.classList.toggle('hidden'));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) nav.classList.add('hidden');
  });
}

// ── Scroll reveal ────────────────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('opacity-100', 'translate-y-0');
        e.target.classList.remove('opacity-0', 'translate-y-8');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
    obs.observe(el);
  });
}

// ── Toast ────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const old = document.getElementById('hfg-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'hfg-toast';
  t.className = 'fixed bottom-6 right-6 z-[9999] px-6 py-4 font-label-bold uppercase tracking-widest text-white transition-all duration-300 translate-y-4 opacity-0 '
    + (type === 'success' ? 'bg-primary border-l-4 border-accent-red' : 'bg-accent-red');
  t.textContent = message;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.remove('translate-y-4', 'opacity-0'));
  setTimeout(() => {
    t.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ── Format price ─────────────────────────────────────────────
function formatPrice(n) {
  return '$' + parseFloat(n).toFixed(2);
}

// ── Send to WhatsApp ──────────────────────────────────────────
function sendToWhatsApp(message) {
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank');
}

// ── Cart badge ───────────────────────────────────────────────
function updateCartBadge() {
  const count = (typeof Cart !== 'undefined') ? Cart.getCount() : 0;
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // initMobileMenu() is intentionally not called here — navbar is injected
  // by injectNavbar() after DOMContentLoaded, so #mobile-menu-btn doesn't
  // exist yet. mobile-fixes.js handles mobile menu via its polling mechanism.
  initScrollReveal();
  updateCartBadge();
  document.addEventListener('cartUpdated', updateCartBadge);
});

// ── Navbar ───────────────────────────────────────────────────
function injectNavbar(activePage) {
  const isSubPage = window.location.pathname.includes('/pages/');
  const rootPrefix = isSubPage ? '../' : './';

  const pages = [
    { key: 'home', label: 'Home', href: rootPrefix + 'index.html' },
    { key: 'samples', label: 'Samples', href: rootPrefix + 'samples.html' },
    { key: 'bulk', label: 'Bulk Order', href: rootPrefix + 'bulk.html' },
    { key: 'about', label: 'About Us', href: rootPrefix + 'About.html' },
    { key: 'contact', label: 'Contact', href: rootPrefix + 'Contact.html' }
  ];

  // Desktop links — active gets red text + red underline, others are dark gray
  const dLinks = pages.map(p => {
    if (p.key === activePage) {
      return `<a href="${p.href}" style="color:#E10600;border-bottom:2px solid #E10600;padding-bottom:3px;font-size:13px;letter-spacing:0.12em;font-weight:700;text-transform:uppercase;text-decoration:none;white-space:nowrap">${p.label}</a>`;
    }
    return `<a href="${p.href}" style="color:#1b1b1b;font-size:13px;letter-spacing:0.12em;font-weight:600;text-transform:uppercase;text-decoration:none;white-space:nowrap" onmouseover="this.style.color='#E10600'" onmouseout="this.style.color='#1b1b1b'">${p.label}</a>`;
  }).join('');

  // Mobile links
  const mLinks = pages.map(p => {
    const activeStyle = p.key === activePage
      ? 'color:#E10600;border-left:3px solid #E10600;padding-left:16px;font-weight:700'
      : 'color:#1b1b1b;border-left:3px solid transparent;padding-left:16px;font-weight:600';
    return `<a href="${p.href}" style="${activeStyle};font-size:15px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;display:flex;align-items:center;min-height:44px;padding-top:12px;padding-bottom:12px">${p.label}</a>`;
  }).join('');

  const html = `
<header style="position:fixed;width:100%;top:0;z-index:50;background:#ffffff;border-bottom:2px solid #1b1b1b">
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:0 16px;max-width:1440px;margin:0 auto;height:72px">

    <!-- Logo: left — image kept as-is -->
    <a href="${rootPrefix}index.html" style="text-decoration:none;flex-shrink:0;display:flex;align-items:center;height:72px">
      <img
        src="${rootPrefix}images/Logo.webp"
        alt="Haute Fighting Gears"
        style="height:28px;width:auto;display:block;object-fit:contain"
        onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
      />
      <span style="display:none;font-size:22px;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;color:#1b1b1b;font-family:Anton,sans-serif;white-space:nowrap">HAUTE FIGHTING GEARS</span>
    </a>

    <!-- Nav links: truly centered via absolute positioning -->
    <div style="position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:32px" class="hfg-desktop-nav">
      ${dLinks}
    </div>

    <!-- Right: cart + mobile toggle -->
    <div style="display:flex;align-items:center;gap:4px;flex-shrink:0">
      <a href="${rootPrefix}cart.html" style="position:relative;display:flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:8px;color:#1b1b1b;text-decoration:none" title="Cart"
        onmouseover="this.style.color='#E10600'" onmouseout="this.style.color='#1b1b1b'">
        <span class="material-symbols-outlined" style="font-size:28px">shopping_bag</span>
        <span data-cart-count style="position:absolute;top:2px;right:2px;background:#E10600;color:#fff;font-size:9px;font-weight:700;width:17px;height:17px;border-radius:50%;display:none;align-items:center;justify-content:center;line-height:1">0</span>
      </a>
      <button id="mobile-menu-btn" style="display:none;background:none;border:none;cursor:pointer;min-width:44px;min-height:44px;padding:8px;color:#1b1b1b;align-items:center;justify-content:center" class="hfg-mobile-btn">
        <span class="material-symbols-outlined" style="font-size:28px">menu</span>
      </button>
    </div>

  </nav>

  <!-- Mobile nav drawer -->
  <div id="mobile-nav" style="display:none;background:#ffffff;border-top:1px solid #e5e5e5;padding:4px 16px 12px;position:relative;z-index:49;width:100%;box-shadow:0 8px 24px rgba(0,0,0,0.1)">
    ${mLinks}
    <a href="${rootPrefix}cart.html" style="color:#1b1b1b;border-left:3px solid transparent;padding-left:16px;font-size:15px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;display:flex;align-items:center;gap:8px;min-height:44px;padding-top:12px;padding-bottom:12px;font-weight:600">
      <span class="material-symbols-outlined" style="font-size:20px">shopping_bag</span> Cart
      <span data-cart-count style="background:#E10600;color:#fff;font-size:9px;font-weight:700;width:17px;height:17px;border-radius:50%;display:none;align-items:center;justify-content:center;margin-left:4px">0</span>
    </a>
  </div>
</header>

<style>
  @media (min-width: 768px) {
    header nav { padding-left: 48px !important; padding-right: 48px !important; }
  }
  @media (max-width: 767px) {
    .hfg-desktop-nav { display: none !important; }
    .hfg-mobile-btn  { display: flex !important; }
  }
</style>`;

  const el = document.getElementById('navbar-placeholder');
  if (el) el.outerHTML = html;
}

// ── Footer ───────────────────────────────────────────────────
function injectFooter() {
  const isSubPage = window.location.pathname.includes('/pages/');
  const rootPrefix = isSubPage ? '../' : './';

  const html = `
<footer class="w-full bg-primary border-t-4 border-accent-red">

  <style>
    /* ── FOOTER MOBILE ACCORDION — JS controls maxHeight via scrollHeight ── */
    /* CSS here handles only non-height concerns (cursor, arrow, border).     */
    /* The JS accordion injects its own style block for height + zoom effects. */
    @media (max-width: 768px) {

      /* Section separator */
      .hfg-footer-section {
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }

      /* Heading tap target */
      .hfg-footer-title {
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        cursor: pointer;
        padding: 16px 0;
        margin-bottom: 0 !important;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
      }

      /* Arrow */
      .hfg-footer-arrow {
        font-size: 20px;
        transition: transform 0.3s ease;
        flex-shrink: 0;
        opacity: 0.7;
      }
    }

    /* ── DESKTOP — arrows hidden, content always visible ── */
    @media (min-width: 769px) {
      .hfg-footer-arrow {
        display: none !important;
      }
      .hfg-footer-title {
        margin-bottom: 1.5rem;
        cursor: default;
        pointer-events: none;
      }
      .hfg-footer-content {
        max-height: none !important;
        overflow: visible !important;
      }
    }
  </style>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-5 md:px-[64px] py-[80px] max-w-[1440px] mx-auto text-on-primary">

    <!-- Brand — always visible, never collapses -->
    <div>
      <div class="mb-6">
        <img
          src="${rootPrefix}images/Logo.webp"
          alt="Haute Fighting Gears"
          style="height:36px;width:auto;object-fit:contain;filter:brightness(0) invert(1)"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
        />
        <div style="display:none">
          <div class="font-headline-lg text-headline-lg uppercase">HAUTE</div>
          <div class="font-headline-lg text-headline-lg uppercase text-accent-red">FIGHTING</div>
          <div class="font-headline-lg text-headline-lg uppercase">GEARS</div>
        </div>
      </div>
      <p class="text-primary-fixed-dim font-body-md opacity-80 mb-6 max-w-xs">
        Custom fight gear manufacturer for boxing, MMA, and training brands.
      </p>
      <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank"
        class="inline-flex items-center gap-2 border-2 border-on-primary text-on-primary px-5 py-3 font-label-bold uppercase hover:bg-on-primary hover:text-primary transition-colors text-sm">
        <span class="material-symbols-outlined text-[18px]">chat</span> WhatsApp Us
      </a>
    </div>

    <!-- Navigate — collapsible on mobile -->
    <div class="hfg-footer-section">
      <h5 class="hfg-footer-title font-label-bold uppercase text-accent-red">
        Navigate
        <span class="hfg-footer-arrow material-symbols-outlined">expand_more</span>
      </h5>
      <div class="hfg-footer-content">
        <ul class="flex flex-col gap-3">
          <li><a href="${rootPrefix}index.html"    class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Home</a></li>
          <li><a href="${rootPrefix}samples.html"  class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Samples</a></li>
          <li><a href="${rootPrefix}bulk.html"     class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Bulk Order</a></li>
          <li><a href="${rootPrefix}About.html"    class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">About Us</a></li>
          <li><a href="${rootPrefix}cart.html"     class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Cart</a></li>
          <li><a href="${rootPrefix}Contact.html"  class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Contact Us</a></li>
        </ul>
      </div>
    </div>

    <!-- Support — collapsible on mobile -->
    <div class="hfg-footer-section">
      <h5 class="hfg-footer-title font-label-bold uppercase text-accent-red">
        Support
        <span class="hfg-footer-arrow material-symbols-outlined">expand_more</span>
      </h5>
      <div class="hfg-footer-content">
        <ul class="flex flex-col gap-3">
          <li><a href="${rootPrefix}privacy-policy.html" class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Privacy Policy</a></li>
          <li><a href="${rootPrefix}terms.html"          class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Terms &amp; Conditions</a></li>
          <li><a href="${rootPrefix}shipping.html"       class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Shipping Info</a></li>
          <li><a href="${rootPrefix}Contact.html"        class="text-primary-fixed-dim opacity-80 hover:text-accent-red transition-colors font-body-md">Contact</a></li>
        </ul>
      </div>
    </div>

    <!-- Newsletter — collapsible on mobile -->
    <div class="hfg-footer-section">
      <h5 class="hfg-footer-title font-label-bold uppercase text-accent-red">
        Newsletter
        <span class="hfg-footer-arrow material-symbols-outlined">expand_more</span>
      </h5>
      <div class="hfg-footer-content">
        <div>
          <p class="text-primary-fixed-dim font-body-md opacity-80 mb-5">Get updates on new products and offers.</p>
          <div class="flex flex-col gap-2">
            <input
              id="newsletter-email"
              type="email"
              placeholder="EMAIL ADDRESS"
              class="bg-transparent border border-on-primary/30 p-3 text-on-primary font-label-bold focus:border-accent-red focus:ring-0 w-full"
              style="font-size:13px;letter-spacing:0.08em"
            />
            <button
              onclick="subscribeNewsletter()"
              class="bg-on-primary text-primary py-3 font-label-bold uppercase hover:bg-accent-red hover:text-on-primary transition-colors"
              style="font-size:13px;letter-spacing:0.1em">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="border-t border-on-primary/10 py-5 px-5 md:px-[64px]">
    <div class="max-w-[1440px] mx-auto text-primary-fixed-dim opacity-40 font-body-md text-sm">
      &copy; 2025 Haute Fighting Gears. All rights reserved.
    </div>
  </div>
</footer>`;

  const el = document.getElementById('footer-placeholder');
  if (el) el.outerHTML = html;

  // ── Footer mobile accordion ───────────────────────────────
  // Uses event delegation on document so it works regardless of when
  // the footer is injected and regardless of other click listeners.
  // Runs once per page — guarded by a flag on document.
  (function initFooterAccordion() {
    if (document._hfgFooterAccordion) return; // prevent duplicate binding
    document._hfgFooterAccordion = true;

    // ── CSS: inject zoom/lift effect for open sections (mobile only) ──
    var style = document.createElement('style');
    style.textContent = [
      '@media (max-width: 768px) {',

      // Smooth height animation via JS-set maxHeight
      ' .hfg-footer-content {',
      '   max-height: 0;',
      '   overflow: hidden;',
      '   transition: max-height 0.32s cubic-bezier(0.22, 1, 0.36, 1);',
      ' }',

      // Zoom-over effect when section is open
      ' .hfg-footer-section {',
      '   transition: transform 0.3s ease, box-shadow 0.3s ease;',
      '   position: relative;',
      '   z-index: 1;',
      ' }',
      ' .hfg-footer-section.hfg-open {',
      '   z-index: 10;',
      '   transform: scale(1.02);',
      '   box-shadow: 0 8px 25px rgba(0,0,0,0.20);',
      ' }',

      // Arrow rotation
      ' .hfg-footer-section.hfg-open .hfg-footer-arrow {',
      '   transform: rotate(180deg);',
      ' }',

      '}'
    ].join('');
    document.head.appendChild(style);

    // ── Event delegation — catches clicks fired after dynamic injection ──
    document.addEventListener('click', function (e) {
      // Only act on mobile
      if (window.innerWidth > 768) return;

      var title = e.target.closest('.hfg-footer-title');
      if (!title) return;

      // Stop the animations.js page-transition from intercepting this click
      e.stopImmediatePropagation();

      var section = title.closest('.hfg-footer-section');
      if (!section) return;

      var isOpen = section.classList.contains('hfg-open');
      var content = section.querySelector('.hfg-footer-content');

      // Close all open sections
      document.querySelectorAll('.hfg-footer-section').forEach(function (s) {
        if (s === section) return; // handle clicked one separately below
        s.classList.remove('hfg-open');
        var c = s.querySelector('.hfg-footer-content');
        if (c) c.style.maxHeight = null;
      });

      // Toggle the clicked section
      if (isOpen) {
        section.classList.remove('hfg-open');
        if (content) content.style.maxHeight = null;
      } else {
        section.classList.add('hfg-open');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    }, true); // useCapture: true — fires before any bubble-phase listeners

    // On resize to desktop: reset all states and inline heights
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        document.querySelectorAll('.hfg-footer-section').forEach(function (s) {
          s.classList.remove('hfg-open');
          var c = s.querySelector('.hfg-footer-content');
          if (c) c.style.maxHeight = '';
        });
      }
    }, { passive: true });
  })();
}
