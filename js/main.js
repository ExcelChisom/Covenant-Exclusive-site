/**
 * Exclusive Website - Modern Interactive Features
 * Handles: Mobile menu, dropdowns, active page, countdown, cart, forms
 */

// ========== DOM Elements ==========
const elements = {
  hamburger: document.getElementById('hamburger'),
  navMenu: document.getElementById('navMenu'),
  dropdowns: document.querySelectorAll('.dropdown'),
  flashTimer: document.querySelector('.timer'),
  quantityInputs: document.querySelectorAll('.quantity-input'),
  addToCartBtns: document.querySelectorAll('.add-to-cart'),
  couponForm: document.querySelector('.coupon-form'),
  contactForm: document.querySelector('#contact-form'),
  loginForm: document.querySelector('#login-form'),
  signupForm: document.querySelector('#signup-form'),
  checkoutForm: document.querySelector('#checkout-form'),
  profileForm: document.querySelector('#profile-form')
};

// ========== 1. Mobile Menu Toggle ==========
if (elements.hamburger && elements.navMenu) {
  elements.hamburger.addEventListener('click', () => {
    elements.navMenu.classList.toggle('active');
    // Optional: toggle hamburger animation
    elements.hamburger.classList.toggle('open');
  });
}

// ========== 2. Dropdown Menus (Desktop & Touch) ==========
const handleDropdowns = () => {
  elements.dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (!toggle || !menu) return;

    // Desktop: hover handled by CSS, but we add click for touch
    if (window.innerWidth <= 768) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = menu.style.display === 'flex';
        // Close all others
        elements.dropdowns.forEach(d => {
          const m = d.querySelector('.dropdown-menu');
          if (m && m !== menu) m.style.display = 'none';
        });
        menu.style.display = isOpen ? 'none' : 'flex';
      });
    } else {
      // Ensure menu is hidden on resize from mobile to desktop
      menu.style.display = '';
    }
  });
};

// Initial call + on resize
handleDropdowns();
window.addEventListener('resize', handleDropdowns);

// ========== 3. Active Page Highlighting ==========
const highlightActivePage = () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};
highlightActivePage();

// ========== 4. Flash Sales Countdown Timer ==========
if (elements.flashTimer) {
  // Set target time (24 hours from now)
  let targetTime = localStorage.getItem('flashEndTime');
  if (!targetTime) {
    targetTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem('flashEndTime', targetTime);
  } else {
    targetTime = parseInt(targetTime);
  }

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance < 0) {
      elements.flashTimer.innerHTML = '00 : 00 : 00 : 00';
      clearInterval(timerInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    elements.flashTimer.innerHTML = `${days}d ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  };

  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

// ========== 5. Quantity Controls ==========
elements.quantityInputs.forEach(container => {
  const input = container.querySelector('input');
  const plus = container.querySelector('.plus');
  const minus = container.querySelector('.minus');

  if (plus && minus && input) {
    plus.addEventListener('click', () => {
      let val = parseInt(input.value) || 0;
      input.value = val + 1;
      updateCartSubtotal(); // optional
    });
    minus.addEventListener('click', () => {
      let val = parseInt(input.value) || 0;
      if (val > 1) input.value = val - 1;
      updateCartSubtotal();
    });
  }
});

// Helper to recalculate cart total (if on cart page)
const updateCartSubtotal = () => {
  const cartItems = document.querySelectorAll('.cart-item');
  if (cartItems.length === 0) return;
  let subtotal = 0;
  cartItems.forEach(item => {
    const price = parseFloat(item.querySelector('.item-price')?.innerText.replace(/[^0-9.-]/g, '')) || 0;
    const qty = parseInt(item.querySelector('.quantity-input input')?.value) || 1;
    subtotal += price * qty;
    const itemTotal = item.querySelector('.item-total');
    if (itemTotal) itemTotal.innerText = `#${(price * qty).toFixed(2)}`;
  });
  const subtotalEl = document.querySelector('.cart-subtotal');
  const totalEl = document.querySelector('.cart-total');
  if (subtotalEl) subtotalEl.innerText = `#${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.innerText = `#${subtotal.toFixed(2)}`; // shipping free for now
};

// ========== 6. Add to Cart (Demo) ==========
elements.addToCartBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const productCard = btn.closest('.product-card');
    const productName = productCard?.querySelector('h4')?.innerText || 'Product';
    // You can store in localStorage or sessionStorage for cart persistence
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: productName, quantity: 1, price: '...' });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} added to cart!`);
    // Optionally redirect to cart page
  });
});

// ========== 7. Coupon Code Application (Cart Page) ==========
if (elements.couponForm) {
  elements.couponForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = elements.couponForm.querySelector('input')?.value;
    if (code && code.toUpperCase() === 'SAVE10') {
      alert('10% discount applied!');
      // Update totals accordingly
    } else {
      alert('Invalid coupon code');
    }
  });
}

// ========== 8. Form Validations ==========
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);

const showError = (input, message) => {
  const formGroup = input.closest('.form-group');
  let error = formGroup?.querySelector('.error-message');
  if (!error && formGroup) {
    error = document.createElement('span');
    error.className = 'error-message';
    formGroup.appendChild(error);
  }
  if (error) error.innerText = message;
  input.classList.add('error');
};

const clearError = (input) => {
  const formGroup = input.closest('.form-group');
  const error = formGroup?.querySelector('.error-message');
  if (error) error.innerText = '';
  input.classList.remove('error');
};

// Contact Form
if (elements.contactForm) {
  elements.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = elements.contactForm.querySelector('#name');
    const email = elements.contactForm.querySelector('#email');
    const message = elements.contactForm.querySelector('#message');
    let isValid = true;

    if (!name?.value.trim()) {
      showError(name, 'Name is required');
      isValid = false;
    } else clearError(name);

    if (!email?.value.trim() || !validateEmail(email.value)) {
      showError(email, 'Valid email is required');
      isValid = false;
    } else clearError(email);

    if (!message?.value.trim()) {
      showError(message, 'Message is required');
      isValid = false;
    } else clearError(message);

    if (isValid) {
      alert('Message sent successfully!');
      elements.contactForm.reset();
    }
  });
}

// Login Form
if (elements.loginForm) {
  elements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = elements.loginForm.querySelector('#email');
    const password = elements.loginForm.querySelector('#password');
    // Dummy validation
    if (email?.value && password?.value) {
      alert('Login successful (demo)');
      window.location.href = 'index.html';
    } else {
      alert('Please fill all fields');
    }
  });
}

// Signup Form
if (elements.signupForm) {
  elements.signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = elements.signupForm.querySelector('#name');
    const email = elements.signupForm.querySelector('#email');
    const password = elements.signupForm.querySelector('#password');
    if (name?.value && email?.value && password?.value) {
      alert('Account created! Please log in.');
      window.location.href = 'login.html';
    } else {
      alert('Please fill all fields');
    }
  });
}

// Profile Form
if (elements.profileForm) {
  elements.profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Profile updated!');
  });
}

// ========== 9. Smooth Scroll for Anchor Links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========== 10. Utility: Close mobile menu on link click ==========
document.querySelectorAll('.nav-link, .dropdown-menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (elements.navMenu?.classList.contains('active')) {
      elements.navMenu.classList.remove('active');
      if (elements.hamburger) elements.hamburger.classList.remove('open');
    }
  });
});