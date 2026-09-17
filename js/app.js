/**
 * Om Industrial Solution, Jaipur - Interactive Application Engine
 * Handles Product Filtering, Live Search, RFQ Cart, Quick Specs Modal,
 * Form Validation, WhatsApp Deep Links, and Digital Catalog Brochure.
 */

document.addEventListener("DOMContentLoaded", () => {
	// Application State
	const state = {
		products: PRODUCTS_DATA || [],
		filteredProducts: [...(PRODUCTS_DATA || [])],
		activeCategory: "All",
		searchQuery: "",
		sortOrder: "featured",
		rfqBasket: [], // Array of { id, name, price, image, qty, category }
		heroSliderIndex: 0,
		heroProducts: [
			{
				id: "om-prod-1",
				name: "Hand Pallet Trucks (2.5T / 3T)",
				category: "Pallet Trucks",
				price: "₹ 9,500 / Piece",
				image: "assets/images/products/hand_pallet_trucks.jpg",
				specs: [
					"Capacity: 2500 - 3000 kg",
					"Fork: 1150 mm",
					"Nylon / PU Tandem Wheels",
					"1-Year Warranty",
				],
			},
			{
				id: "om-prod-15",
				name: "Stock Easy Semi Electric Stacker",
				category: "Stackers & Lifters",
				price: "₹ 1,20,000 / Unit",
				image: "assets/images/products/semi_electric_stacker.jpg",
				specs: [
					"Capacity: 1500 kg",
					"Lift Height: 3000 mm",
					"Battery Powered Lift",
					"Dual Safety Braking",
				],
			},
			{
				id: "om-prod-18",
				name: "Hydraulic Drum Lifter Cum Tilter",
				category: "Drum Handling Equipment",
				price: "₹ 26,000 / Piece",
				image: "assets/images/products/hydraulic_drum_lifter_cum_tilt.jpg",
				specs: [
					"Capacity: 350 - 500 kg",
					"360° Manual Rotation",
					"SS / MS Drum Grip",
					"Smooth Foot Pump",
				],
			},
			{
				id: "om-prod-20",
				name: "Heavy Duty Scissor Lift Table",
				category: "Scissor Lifts & Tables",
				price: "₹ 25,000 / Piece",
				image: "assets/images/products/scissor_lift_tables.jpg",
				specs: [
					"Capacity: 500 - 1000 kg",
					"Hydraulic Scissor Link",
					"Overload Relief Valve",
					"Locking Castor Wheels",
				],
			},
		],
	};

	// DOM Elements
	const header = document.getElementById("header");
	const productGrid = document.getElementById("product-grid");
	const catalogStats = document.getElementById("catalog-stats");
	const searchInput = document.getElementById("catalog-search");
	const sortSelect = document.getElementById("catalog-sort");
	const categoryPillsContainer = document.getElementById(
		"category-filter-pills",
	);

	// Navigation & Drawer Elements
	const mobileToggle = document.getElementById("mobile-toggle");
	const mobileDrawer = document.getElementById("mobile-drawer");
	const drawerClose = document.getElementById("drawer-close");
	const drawerBackdrop = document.getElementById("drawer-backdrop");
	const desktopNavLinks = document.querySelectorAll(
		".nav-desktop-wrap .nav-link",
	);

	// Sticky WhatsApp Widget Elements
	const whatsappPopup = document.getElementById("whatsapp-popup");
	const whatsappPopupClose = document.getElementById("whatsapp-popup-close");

	// RFQ Basket Elements
	const rfqDrawer = document.getElementById("rfq-drawer");
	const rfqDrawerClose = document.getElementById("rfq-drawer-close");
	const rfqDrawerBody = document.getElementById("rfq-drawer-body");
	const rfqCartCountBadges = document.querySelectorAll(".cart-badge");
	const rfqDrawerCount = document.getElementById("rfq-drawer-count");
	const rfqCartButtons = document.querySelectorAll(".btn-rfq-cart, .btn-cart");
	const clearRfqBtn = document.getElementById("btn-clear-rfq");
	const checkoutRfqBtn = document.getElementById("btn-checkout-rfq");
	const waRfqBtn = document.getElementById("btn-wa-rfq");

	// Specs Modal Elements
	const specsModal = document.getElementById("specs-modal");
	const specsModalClose = document.getElementById("specs-modal-close");
	const specsModalBody = document.getElementById("specs-modal-body");

	// Brochure Modal Elements
	const brochureModal = document.getElementById("brochure-modal");
	const brochureModalClose = document.getElementById("brochure-modal-close");
	const btnOpenBrochure = document.querySelectorAll(".btn-open-brochure");
	const btnPrintBrochure = document.getElementById("btn-print-brochure");

	// RFQ Form Elements
	const rfqForm = document.getElementById("b2b-rfq-form");
	const rfqProductSelect = document.getElementById("rfq-product");
	const rfqSelectedPreview = document.getElementById("selected-rfq-preview");
	const rfqChipsContainer = document.getElementById("preview-chips-list");

	// Hero Preview Slider Elements
	const heroImg = document.getElementById("hero-slider-img");
	const heroTitle = document.getElementById("hero-slider-title");
	const heroCategory = document.getElementById("hero-slider-category");
	const heroPrice = document.getElementById("hero-slider-price");
	const heroSpecs = document.getElementById("hero-slider-specs");
	const heroIndicator = document.getElementById("hero-slider-indicator");
	const heroPrevBtn = document.getElementById("hero-prev-btn");
	const heroNextBtn = document.getElementById("hero-next-btn");
	const heroQuickQuoteBtn = document.getElementById("hero-slider-quote-btn");
	const heroTabBtns = document.querySelectorAll(".hero-tab-btn");

	// Toast Container
	const toastContainer = document.getElementById("toast-container");

	// ==========================================================================
	// Helper: Toast Notifications
	// ==========================================================================
	function showToast(message, type = "info") {
		if (!toastContainer) return;
		const toast = document.createElement("div");
		toast.className = `toast ${type === "success" ? "toast-success" : ""}`;

		const iconSvg =
			type === "success"
				? '<svg style="width:18px;height:18px;fill:#25D366;" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
				: '<svg style="width:18px;height:18px;fill:#FF6600;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';

		toast.innerHTML = `${iconSvg}<span>${message}</span>`;
		toastContainer.appendChild(toast);

		setTimeout(() => {
			toast.style.opacity = "0";
			toast.style.transform = "translateX(100%)";
			toast.style.transition = "all 0.3s ease";
			setTimeout(() => toast.remove(), 300);
		}, 3500);
	}

	// ==========================================================================
	// Header Scroll & Active Section Spy
	// ==========================================================================
	window.addEventListener(
		"scroll",
		() => {
			if (window.scrollY > 40) {
				header.classList.add("scrolled");
			} else {
				header.classList.remove("scrolled");
			}

			// Scroll spy for navigation links
			const sections = document.querySelectorAll("section[id]");
			let currentId = "";
			const scrollPosition = window.scrollY + 120;

			sections.forEach((sec) => {
				const top = sec.offsetTop;
				const height = sec.offsetHeight;
				if (scrollPosition >= top && scrollPosition < top + height) {
					currentId = sec.getAttribute("id");
				}
			});

			if (currentId) {
				desktopNavLinks.forEach((link) => {
					const href = link.getAttribute("href").replace("#", "");
					if (href === currentId) {
						link.classList.add("active");
					} else {
						link.classList.remove("active");
					}
				});
			}
		},
		{ passive: true },
	);

	// ==========================================================================
	// Sticky WhatsApp Widget Popover
	// ==========================================================================
	if (whatsappPopup) {
		// Show popup after 2.5s if not previously dismissed in session
		setTimeout(() => {
			if (!sessionStorage.getItem("ois_wa_dismissed")) {
				whatsappPopup.classList.add("active");
			}
		}, 2500);

		if (whatsappPopupClose) {
			whatsappPopupClose.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				whatsappPopup.classList.remove("active");
				sessionStorage.setItem("ois_wa_dismissed", "1");
			});
		}
	}

	// ==========================================================================
	// Initialize Category Filter Pills
	// ==========================================================================
	function initCategoryPills() {
		if (!categoryPillsContainer) return;
		categoryPillsContainer.innerHTML = "";

		// "All" Pill
		const allPill = document.createElement("button");
		allPill.className = `filter-pill ${state.activeCategory === "All" ? "active" : ""}`;
		allPill.textContent = `All Products (${state.products.length})`;
		allPill.addEventListener("click", () => setCategory("All"));
		categoryPillsContainer.appendChild(allPill);

		// Dynamic Categories
		CATEGORIES.forEach((cat) => {
			const count = state.products.filter((p) => p.category === cat).length;
			if (count > 0) {
				const pill = document.createElement("button");
				pill.className = `filter-pill ${state.activeCategory === cat ? "active" : ""}`;
				pill.textContent = `${cat} (${count})`;
				pill.addEventListener("click", () => setCategory(cat));
				categoryPillsContainer.appendChild(pill);
			}
		});

		// Populate the dropdown in RFQ form
		if (rfqProductSelect) {
			rfqProductSelect.innerHTML =
				'<option value="">-- Choose Equipment Model --</option>';
			state.products.forEach((p) => {
				const opt = document.createElement("option");
				opt.value = p.name;
				opt.textContent = `[${p.category}] ${p.name} (${p.price})`;
				rfqProductSelect.appendChild(opt);
			});
		}
	}

	function setCategory(category) {
		state.activeCategory = category;

		// Update pills styling
		const pills = categoryPillsContainer.querySelectorAll(".filter-pill");
		pills.forEach((p) => {
			if (category === "All" && p.textContent.startsWith("All Products")) {
				p.classList.add("active");
			} else if (p.textContent.startsWith(category)) {
				p.classList.add("active");
			} else {
				p.classList.remove("active");
			}
		});

		filterAndRenderProducts();
	}

	// ==========================================================================
	// Filter, Sort and Render Products
	// ==========================================================================
	function filterAndRenderProducts() {
		let result = [...state.products];

		// Category Filter
		if (state.activeCategory !== "All") {
			result = result.filter((p) => p.category === state.activeCategory);
		}

		// Search Filter
		if (state.searchQuery.trim() !== "") {
			const q = state.searchQuery.toLowerCase().trim();
			result = result.filter((p) => {
				const inName = p.name.toLowerCase().includes(q);
				const inCat = p.category.toLowerCase().includes(q);
				const inSpecs = Object.entries(p.specs || {}).some(
					([k, v]) =>
						k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q),
				);
				const inDesc = (p.desc || "").toLowerCase().includes(q);
				return inName || inCat || inSpecs || inDesc;
			});
		}

		// Sort Filter
		if (state.sortOrder === "price-low") {
			result.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
		} else if (state.sortOrder === "price-high") {
			result.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
		} else if (state.sortOrder === "name-asc") {
			result.sort((a, b) => a.name.localeCompare(b.name));
		}

		state.filteredProducts = result;
		renderProducts(result);
	}

	function extractPrice(str) {
		if (!str) return 0;
		const match = str.replace(/,/g, "").match(/\d+/);
		return match ? parseInt(match[0], 10) : 0;
	}

	function renderProducts(products) {
		if (!productGrid) return;
		productGrid.innerHTML = "";

		if (catalogStats) {
			catalogStats.innerHTML = `Showing <strong>${products.length}</strong> verified industrial models ${state.activeCategory !== "All" ? `in <em>${state.activeCategory}</em>` : ""}`;
		}

		if (products.length === 0) {
			productGrid.innerHTML = `
        <div class="catalog-empty-state">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--navy-900); margin-bottom:0.5rem;">No Equipment Matched Your Search</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; max-width:440px; margin:0 auto 1.5rem; line-height:1.6;">We build customized models on order (e.g. customized fork lengths, special widths, and heavy platforms). Try clearing filters or speak with our engineering team.</p>
          <button class="btn btn-primary btn-sm" id="btn-reset-filters">Reset All Filters</button>
        </div>
      `;
			const resetBtn = document.getElementById("btn-reset-filters");
			if (resetBtn) {
				resetBtn.addEventListener("click", () => {
					state.searchQuery = "";
					if (searchInput) searchInput.value = "";
					setCategory("All");
				});
			}
			return;
		}

		products.forEach((p) => {
			const card = document.createElement("div");
			card.className = "product-card";
			card.dataset.id = p.id;

			const isInCart = state.rfqBasket.some((item) => item.id === p.id);

			// Build specs highlights
			const highlightTags = (p.highlights || [])
				.slice(0, 3)
				.map((h) => `<span class="highlight-tag">${h}</span>`)
				.join("");

			card.innerHTML = `
        <div class="product-card-thumb">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/images/om-logo-thumb.jpg';">
          <span class="product-card-badge">Direct Factory</span>
          <span class="product-card-warranty-tag">1-Yr Warranty</span>
        </div>
        <div class="product-card-body">
          <span class="product-cat-name">${p.category}</span>
          <h3 class="product-title" title="${p.name}">${p.name}</h3>
          <div class="product-price-row">
            <span class="product-price tabular-numbers">${p.price}</span>
            <span class="product-tax-note">Ex-Jaipur</span>
          </div>
          <div class="product-highlights">
            ${highlightTags}
          </div>
          <div class="product-card-actions">
            <button class="btn-card-specs" data-action="specs" data-id="${p.id}">
              <svg style="width:14px;height:14px;fill:currentColor;vertical-align:middle;margin-right:3px;" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              Quick Specs
            </button>
            <button class="btn-card-quote" data-action="quote" data-id="${p.id}">
              Get Quote
            </button>
          </div>
          <div class="product-card-quick-actions">
            <button class="btn-card-add-rfq ${isInCart ? "added" : ""}" data-action="cart" data-id="${p.id}">
              <svg style="width:13px;height:13px;fill:currentColor;" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              <span>${isInCart ? "Added to RFQ" : "+ Add to RFQ"}</span>
            </button>
            <a href="${getWhatsAppUrl(p.name, p.price)}" target="_blank" rel="noopener noreferrer" class="btn-card-wa" title="Inquire on WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84-1.56 1.56-3.64 2.42-5.84 2.42-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.02.79.81-2.95-.19-.31a8.188 8.188 0 0 1-1.26-4.32c0-4.54 3.7-8.24 8.24-8.24zm4.5 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8 1-.15.19-.3.21-.55.08-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.43-.57-.44h-.48c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.12 0 1.25.91 2.46 1.04 2.63.13.17 1.8 2.75 4.36 3.86.61.26 1.09.42 1.46.54.61.2 1.17.17 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      `;

			productGrid.appendChild(card);
		});

		// Attach card event listeners
		productGrid.querySelectorAll("button[data-action]").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const action = btn.dataset.action;
				const id = btn.dataset.id;
				const product = state.products.find((item) => item.id === id);
				if (!product) return;

				if (action === "specs") {
					openSpecsModal(product);
				} else if (action === "quote") {
					openQuoteForProduct(product);
				} else if (action === "cart") {
					toggleRfqBasketItem(product, btn);
				}
			});
		});
	}

	// Generate WhatsApp Deep Link
	function getWhatsAppUrl(productName, price) {
		const phone = "918696679774"; // Om Industrial Solution official WhatsApp
		const message = `Hello Om Industrial Solution Jaipur,\n\nI am interested in:\nProduct: ${productName}\nIndicative Price: ${price}\n\nPlease share the detailed technical datasheet, availability, and best B2B quotation for delivery to my facility.`;
		return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
	}

	// ==========================================================================
	// Hero Machinery Visualizer & Model Selector Tabs
	// ==========================================================================
	function updateHeroSlider() {
		const item = state.heroProducts[state.heroSliderIndex];
		if (!item) return;

		if (heroImg) heroImg.src = item.image;
		if (heroTitle) heroTitle.textContent = item.name;
		if (heroCategory) heroCategory.textContent = item.category;
		if (heroPrice) heroPrice.textContent = item.price;
		if (heroIndicator)
			heroIndicator.textContent = `${state.heroSliderIndex + 1} / ${state.heroProducts.length}`;

		if (heroSpecs) {
			heroSpecs.innerHTML = item.specs
				.map((s) => `<span class="spec-mini-tag">${s}</span>`)
				.join("");
		}

		// Update tabs active class
		heroTabBtns.forEach((tab, idx) => {
			if (idx === state.heroSliderIndex) {
				tab.classList.add("active");
			} else {
				tab.classList.remove("active");
			}
		});

		if (heroQuickQuoteBtn) {
			heroQuickQuoteBtn.onclick = () => {
				const p = state.products.find((x) => x.id === item.id) || item;
				openQuoteForProduct(p);
			};
		}
	}

	// Hero Tab Buttons click
	heroTabBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			const idx = parseInt(btn.dataset.index, 10);
			state.heroSliderIndex = idx;
			updateHeroSlider();
		});
	});

	if (heroPrevBtn && heroNextBtn) {
		heroPrevBtn.addEventListener("click", () => {
			state.heroSliderIndex =
				(state.heroSliderIndex - 1 + state.heroProducts.length) %
				state.heroProducts.length;
			updateHeroSlider();
		});

		heroNextBtn.addEventListener("click", () => {
			state.heroSliderIndex =
				(state.heroSliderIndex + 1) % state.heroProducts.length;
			updateHeroSlider();
		});
	}

	// ==========================================================================
	// RFQ Multi-Item Basket / Quotation Drawer
	// ==========================================================================
	function toggleRfqBasketItem(product, buttonEl) {
		const index = state.rfqBasket.findIndex((item) => item.id === product.id);
		if (index === -1) {
			// Add
			state.rfqBasket.push({
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.image,
				category: product.category,
				qty: 1,
			});
			showToast(`Added "${product.name}" to your RFQ Basket`, "success");
			if (buttonEl) {
				buttonEl.classList.add("added");
				buttonEl.querySelector("span").textContent = "Added to RFQ";
			}
		} else {
			// Remove
			state.rfqBasket.splice(index, 1);
			showToast(`Removed "${product.name}" from RFQ Basket`);
			if (buttonEl) {
				buttonEl.classList.remove("added");
				buttonEl.querySelector("span").textContent = "+ Add to RFQ";
			}
		}

		updateRfqBasketUI();
	}

	function updateRfqBasketUI() {
		// Badges
		const totalCount = state.rfqBasket.reduce((sum, item) => sum + item.qty, 0);
		rfqCartCountBadges.forEach((b) => {
			b.textContent = totalCount;
			b.style.display = totalCount > 0 ? "inline-block" : "none";
		});
		if (rfqDrawerCount) {
			rfqDrawerCount.textContent = `(${totalCount} Items)`;
		}

		// Drawer Body
		if (!rfqDrawerBody) return;
		if (state.rfqBasket.length === 0) {
			rfqDrawerBody.innerHTML = `
        <div class="rfq-empty-message">
          <svg style="width:48px;height:48px;fill:var(--text-subtle);margin-bottom:0.75rem;" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          <h4 style="font-size:1.1rem;font-weight:700;color:var(--navy-900);margin-bottom:0.4rem;">Your RFQ Basket is Empty</h4>
          <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.5;">Click "+ Add to RFQ" on any equipment in the catalog to build an itemized quotation list.</p>
        </div>
      `;
			if (checkoutRfqBtn) checkoutRfqBtn.disabled = true;
			if (waRfqBtn) waRfqBtn.disabled = true;
		} else {
			rfqDrawerBody.innerHTML = "";
			state.rfqBasket.forEach((item, idx) => {
				const itemCard = document.createElement("div");
				itemCard.className = "rfq-item-card";
				itemCard.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="rfq-item-img" onerror="this.src='assets/images/om-logo-thumb.jpg';">
          <div class="rfq-item-info">
            <h4 class="rfq-item-name">${item.name}</h4>
            <span class="rfq-item-price tabular-numbers">${item.price}</span>
            <div class="rfq-qty-control">
              <span style="font-size:0.75rem;color:var(--text-muted);">Qty:</span>
              <button class="rfq-qty-btn" data-action="dec" data-id="${item.id}">-</button>
              <span class="rfq-qty-val tabular-numbers">${item.qty}</span>
              <button class="rfq-qty-btn" data-action="inc" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="rfq-item-remove" data-action="del" data-id="${item.id}" title="Remove item">&times;</button>
        `;
				rfqDrawerBody.appendChild(itemCard);
			});

			if (checkoutRfqBtn) checkoutRfqBtn.disabled = false;
			if (waRfqBtn) waRfqBtn.disabled = false;

			// Attach item controls
			rfqDrawerBody.querySelectorAll("button[data-action]").forEach((btn) => {
				btn.addEventListener("click", () => {
					const id = btn.dataset.id;
					const action = btn.dataset.action;
					const target = state.rfqBasket.find((i) => i.id === id);
					if (!target) return;

					if (action === "inc") {
						target.qty += 1;
					} else if (action === "dec") {
						target.qty -= 1;
						if (target.qty <= 0) {
							state.rfqBasket = state.rfqBasket.filter((i) => i.id !== id);
						}
					} else if (action === "del") {
						state.rfqBasket = state.rfqBasket.filter((i) => i.id !== id);
					}
					updateRfqBasketUI();
					filterAndRenderProducts(); // sync buttons
				});
			});
		}

		// Sync RFQ form selected items chips
		updateRfqFormPreviewChips();
	}

	function updateRfqFormPreviewChips() {
		if (!rfqSelectedPreview || !rfqChipsContainer) return;
		if (state.rfqBasket.length === 0) {
			rfqSelectedPreview.classList.remove("active");
			rfqChipsContainer.innerHTML = "";
		} else {
			rfqSelectedPreview.classList.add("active");
			rfqChipsContainer.innerHTML = state.rfqBasket
				.map(
					(item) => `
        <span class="item-chip">
          ${item.name} (x${item.qty})
          <span class="item-chip-remove" data-id="${item.id}">&times;</span>
        </span>
      `,
				)
				.join("");

			rfqChipsContainer.querySelectorAll(".item-chip-remove").forEach((el) => {
				el.addEventListener("click", () => {
					const id = el.dataset.id;
					state.rfqBasket = state.rfqBasket.filter((i) => i.id !== id);
					updateRfqBasketUI();
					filterAndRenderProducts();
				});
			});
		}
	}

	// RFQ Drawer Open/Close
	rfqCartButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			if (rfqDrawer) rfqDrawer.classList.add("open");
			if (drawerBackdrop) drawerBackdrop.classList.add("open");
			document.body.style.overflow = "hidden";
		});
	});

	if (rfqDrawerClose) {
		rfqDrawerClose.addEventListener("click", () => {
			rfqDrawer.classList.remove("open");
			drawerBackdrop.classList.remove("open");
			document.body.style.overflow = "";
		});
	}

	if (clearRfqBtn) {
		clearRfqBtn.addEventListener("click", () => {
			state.rfqBasket = [];
			updateRfqBasketUI();
			filterAndRenderProducts();
			showToast("RFQ Basket cleared");
		});
	}

	if (checkoutRfqBtn) {
		checkoutRfqBtn.addEventListener("click", () => {
			rfqDrawer.classList.remove("open");
			drawerBackdrop.classList.remove("open");
			document.body.style.overflow = "";
			const rfqSec = document.getElementById("enquiry-section");
			if (rfqSec) {
				rfqSec.scrollIntoView({ behavior: "smooth" });
			}
		});
	}

	if (waRfqBtn) {
		waRfqBtn.addEventListener("click", () => {
			if (state.rfqBasket.length === 0) return;
			const phone = "918696679774";
			let message = `Hello Om Industrial Solution Jaipur,\n\nI would like to request an official proforma quotation for the following equipment:\n\n`;
			state.rfqBasket.forEach((item, idx) => {
				message += `${idx + 1}. ${item.name}\n   - Quantity: ${item.qty} units\n   - Listed Price: ${item.price}\n`;
			});
			message += `\nPlease provide estimated road freight to my facility and delivery timeline. Thank you!`;
			window.open(
				`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
				"_blank",
			);
		});
	}

	// ==========================================================================
	// Technical Specifications & Product Detail Modal
	// ==========================================================================
	function openSpecsModal(product) {
		if (!specsModal || !specsModalBody) return;

		let specsRows = "";
		const specsEntries = Object.entries(product.specs || {});
		if (specsEntries.length > 0) {
			specsRows = specsEntries
				.map(
					([k, v]) => `
        <tr>
          <td>${k}</td>
          <td>${v}</td>
        </tr>
      `,
				)
				.join("");
		} else {
			specsRows = `
        <tr><td>Standard Capacity</td><td>Heavy Industrial Grade</td></tr>
        <tr><td>Material of Frame</td><td>High Tensile Structural Steel</td></tr>
        <tr><td>Finish</td><td>Powder Coated Industrial Paint</td></tr>
        <tr><td>Warranty</td><td>1-Year Comprehensive Service Warranty</td></tr>
        <tr><td>Delivery</td><td>Dispatched from Jaipur Works</td></tr>
      `;
		}

		specsModalBody.innerHTML = `
      <div class="modal-product-grid">
        <div class="modal-img-wrap">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/om-logo-thumb.jpg';">
        </div>
        <div>
          <span style="font-size:0.75rem;font-weight:700;color:var(--blue-600);text-transform:uppercase;letter-spacing:0.04em;">${product.category}</span>
          <h2 style="font-size:1.45rem;font-weight:800;color:var(--navy-900);line-height:1.2;margin:0.25rem 0 0.5rem;">${product.name}</h2>
          <div style="font-family:var(--font-heading);font-size:1.4rem;font-weight:800;color:var(--orange-500);margin-bottom:0.75rem;">
            ${product.price}
            <span style="font-family:var(--font-body);font-size:0.75rem;color:var(--text-muted);font-weight:500;">(Ex-Factory Jaipur, Taxes Extra)</span>
          </div>
          <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.65;margin-bottom:1.15rem;">
            ${product.desc}
          </p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" id="modal-rfq-btn">Request Proforma Quote</button>
            <a href="${getWhatsAppUrl(product.name, product.price)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-header btn-sm">
              <svg style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84-1.56 1.56-3.64 2.42-5.84 2.42-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.02.79.81-2.95-.19-.31a8.188 8.188 0 0 1-1.26-4.32c0-4.54 3.7-8.24 8.24-8.24zm4.5 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8 1-.15.19-.3.21-.55.08-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.43-.57-.44h-.48c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.12 0 1.25.91 2.46 1.04 2.63.13.17 1.8 2.75 4.36 3.86.61.26 1.09.42 1.46.54.61.2 1.17.17 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div>
        <h3 style="font-size:1.15rem;font-weight:700;color:var(--navy-900);border-bottom:2px solid var(--border-default);padding-bottom:0.4rem;margin-bottom:0.85rem;">
          Verified Technical Specifications
        </h3>
        <table class="modal-specs-table">
          <tbody>
            ${specsRows}
          </tbody>
        </table>
        <div style="margin-top:1.25rem;background:var(--bg-subtle);padding:1rem 1.25rem;border-radius:var(--radius-md);border-left:4px solid var(--orange-500);font-size:0.8125rem;color:var(--text-secondary);line-height:1.55;">
          <strong>Custom Fabrications Feasible:</strong> Om Industrial Solution builds custom fork lengths (up to 1800mm or ultra-short), customized lifting heights, paper reel arms, and heavy-duty trolley bases on order. Contact technical desk directly at <strong>+91 86966 79774</strong>.
        </div>
      </div>
    `;

		specsModal.classList.add("open");
		document.body.style.overflow = "hidden";

		// Attach inside modal action
		const modalRfqBtn = document.getElementById("modal-rfq-btn");
		if (modalRfqBtn) {
			modalRfqBtn.addEventListener("click", () => {
				specsModal.classList.remove("open");
				document.body.style.overflow = "";
				openQuoteForProduct(product);
			});
		}
	}

	function openQuoteForProduct(product) {
		if (rfqProductSelect) {
			rfqProductSelect.value = product.name;
		}
		const rfqSec = document.getElementById("enquiry-section");
		if (rfqSec) {
			rfqSec.scrollIntoView({ behavior: "smooth" });
		}
		showToast(`Selected "${product.name}" in RFQ Form`, "success");
	}

	if (specsModalClose) {
		specsModalClose.addEventListener("click", () => {
			specsModal.classList.remove("open");
			document.body.style.overflow = "";
		});
	}
	if (specsModal) {
		specsModal.addEventListener("click", (e) => {
			if (e.target === specsModal) {
				specsModal.classList.remove("open");
				document.body.style.overflow = "";
			}
		});
	}

	// ==========================================================================
	// Digital Catalog Brochure Modal
	// ==========================================================================
	btnOpenBrochure.forEach((btn) => {
		btn.addEventListener("click", () => {
			if (brochureModal) {
				brochureModal.classList.add("open");
				document.body.style.overflow = "hidden";
			}
		});
	});

	if (brochureModalClose) {
		brochureModalClose.addEventListener("click", () => {
			brochureModal.classList.remove("open");
			document.body.style.overflow = "";
		});
	}

	if (brochureModal) {
		brochureModal.addEventListener("click", (e) => {
			if (e.target === brochureModal) {
				brochureModal.classList.remove("open");
				document.body.style.overflow = "";
			}
		});
	}

	if (btnPrintBrochure) {
		btnPrintBrochure.addEventListener("click", () => {
			window.print();
		});
	}

	// ==========================================================================
	// Category Cards Click -> Filter Catalog
	// ==========================================================================
	document.querySelectorAll(".category-card[data-cat]").forEach((card) => {
		card.addEventListener("click", () => {
			const cat = card.dataset.cat;
			setCategory(cat);
			const catSec = document.getElementById("products-section");
			if (catSec) {
				catSec.scrollIntoView({ behavior: "smooth" });
			}
		});
	});

	// ==========================================================================
	// Live Search & Sort Listeners
	// ==========================================================================
	if (searchInput) {
		let debounceTimer;
		searchInput.addEventListener("input", (e) => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				state.searchQuery = e.target.value;
				filterAndRenderProducts();
			}, 200);
		});
	}

	if (sortSelect) {
		sortSelect.addEventListener("change", (e) => {
			state.sortOrder = e.target.value;
			filterAndRenderProducts();
		});
	}

	// ==========================================================================
	// Interactive B2B RFQ Form Submission & Validation
	// ==========================================================================
	if (rfqForm) {
		rfqForm.addEventListener("submit", (e) => {
			e.preventDefault();

			const nameInput = document.getElementById("rfq-name");
			const phoneInput = document.getElementById("rfq-phone");
			const companyInput = document.getElementById("rfq-company");
			const cityInput = document.getElementById("rfq-city");
			const emailInput = document.getElementById("rfq-email");
			const qtyInput = document.getElementById("rfq-qty");
			const messageInput = document.getElementById("rfq-notes");
			const submitBtn = document.getElementById("btn-submit-rfq");

			let isValid = true;

			// Validate Name
			if (!nameInput.value.trim()) {
				setError(nameInput, "Please enter your full name");
				isValid = false;
			} else {
				clearError(nameInput);
			}

			// Validate Phone (10 digits Indian format or international)
			const cleanPhone = phoneInput.value.replace(/\D/g, "");
			if (cleanPhone.length < 10) {
				setError(phoneInput, "Please enter a valid 10-digit mobile number");
				isValid = false;
			} else {
				clearError(phoneInput);
			}

			// Validate Equipment Selection
			if (!rfqProductSelect.value && state.rfqBasket.length === 0) {
				setError(
					rfqProductSelect,
					"Please select equipment or add models to your RFQ basket",
				);
				isValid = false;
			} else {
				clearError(rfqProductSelect);
			}

			if (!isValid) {
				showToast(
					"Please correct highlighted fields before submitting",
					"warning",
				);
				return;
			}

			// Simulate B2B RFQ Processing
			const originalBtnText = submitBtn.innerHTML;
			submitBtn.disabled = true;
			submitBtn.innerHTML = `
        <svg style="width:18px;height:18px;animation:spin 1s linear infinite;fill:currentColor;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-linecap="round"></circle></svg>
        <span>Processing Commercial RFQ...</span>
      `;

			setTimeout(() => {
				// Generate RFQ Ticket Number
				const rfqNumber =
					"OIS-RFQ-" + Math.floor(10000 + Math.random() * 90000);
				submitBtn.disabled = false;
				submitBtn.innerHTML = originalBtnText;

				// Show Confirmation Modal
				showRfqSuccessModal({
					rfqId: rfqNumber,
					name: nameInput.value.trim(),
					phone: phoneInput.value.trim(),
					company: companyInput.value.trim() || "Direct Client",
					city: cityInput.value.trim() || "Jaipur / Site",
					email: emailInput.value.trim() || "Not specified",
					product:
						rfqProductSelect.value ||
						state.rfqBasket.map((i) => `${i.name} (x${i.qty})`).join(", "),
					qty: qtyInput.value || "1 Unit",
					notes:
						messageInput.value.trim() || "Standard specifications requested",
				});

				// Reset form
				rfqForm.reset();
				state.rfqBasket = [];
				updateRfqBasketUI();
				filterAndRenderProducts();
				showToast(
					`Quotation Request ${rfqNumber} Registered Successfully!`,
					"success",
				);
			}, 850);
		});
	}

	function setError(inputEl, msg) {
		const group = inputEl.closest(".form-group");
		if (group) {
			group.classList.add("has-error");
			const hint = group.querySelector(".error-hint");
			if (hint) hint.textContent = msg;
		}
		inputEl.classList.add("error");
	}

	function clearError(inputEl) {
		const group = inputEl.closest(".form-group");
		if (group) {
			group.classList.remove("has-error");
		}
		inputEl.classList.remove("error");
	}

	// RFQ Success Confirmation Modal
	function showRfqSuccessModal(data) {
		const modal = document.createElement("div");
		modal.className = "modal-overlay open";
		modal.innerHTML = `
      <div class="modal-container" style="max-width:580px;">
        <div class="modal-header" style="background:var(--success-bg);border-bottom:1px solid #BBF7D0;">
          <h3 style="color:#15803D;font-weight:800;display:flex;align-items:center;gap:0.5rem;font-size:1.15rem;">
            <svg style="width:22px;height:22px;fill:#15803D;" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            Quotation Request Received!
          </h3>
          <button class="modal-close" id="rfq-success-close">&times;</button>
        </div>
        <div class="modal-body" style="padding:1.75rem;">
          <div style="background:var(--bg-subtle);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:1.15rem;margin-bottom:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
              <span style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;letter-spacing:0.04em;">Quotation Reference ID</span>
              <span style="font-family:var(--font-heading);font-size:1.05rem;font-weight:800;color:var(--orange-600);">${data.rfqId}</span>
            </div>
            <div style="font-size:0.875rem;color:var(--text-primary);line-height:1.6;">
              <strong>Equipment:</strong> ${data.product}<br>
              <strong>Quantity:</strong> ${data.qty}<br>
              <strong>Contact:</strong> ${data.name} (${data.phone})<br>
              <strong>Company & City:</strong> ${data.company}, ${data.city}
            </div>
          </div>
          <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.65;margin-bottom:1.5rem;">
            Thank you for reaching out to <strong>Om Industrial Solution, Jaipur</strong>. Our CEO Mr. Jagdish Prashad Swami and technical sales team will review your specifications and contact you with an official proforma quotation within <strong>1 to 2 business hours</strong>.
          </p>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <a href="https://wa.me/918696679774?text=${encodeURIComponent(`Hello Om Industrial Solution, I just submitted RFQ #${data.rfqId} on your website for ${data.product}. Please confirm receipt and share proforma invoice.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-header" style="width:100%;">
              <svg style="width:18px;height:18px;fill:currentColor;" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84-1.56 1.56-3.64 2.42-5.84 2.42-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.02.79.81-2.95-.19-.31a8.188 8.188 0 0 1-1.26-4.32c0-4.54 3.7-8.24 8.24-8.24zm4.5 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8 1-.15.19-.3.21-.55.08-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.43-.57-.44h-.48c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.12 0 1.25.91 2.46 1.04 2.63.13.17 1.8 2.75 4.36 3.86.61.26 1.09.42 1.46.54.61.2 1.17.17 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>
              Forward RFQ to WhatsApp for Instant Reply
            </a>
            <button class="btn btn-outline-navy" id="rfq-success-dismiss" style="width:100%;">Close & Continue Browsing</button>
          </div>
        </div>
      </div>
    `;

		document.body.appendChild(modal);
		document.body.style.overflow = "hidden";

		const closeBtn = modal.querySelector("#rfq-success-close");
		const dismissBtn = modal.querySelector("#rfq-success-dismiss");
		const cleanup = () => {
			modal.remove();
			document.body.style.overflow = "";
		};

		if (closeBtn) closeBtn.addEventListener("click", cleanup);
		if (dismissBtn) dismissBtn.addEventListener("click", cleanup);
		modal.addEventListener("click", (e) => {
			if (e.target === modal) cleanup();
		});
	}

	// ==========================================================================
	// Mobile Drawer Navigation (Fixed, Clean & Scroll-Safe)
	// ==========================================================================
	function openMobileMenu() {
		mobileDrawer.classList.add("open");
		drawerBackdrop.classList.add("open");
		mobileToggle.classList.add("active");
		document.body.style.overflow = "hidden";
	}

	function closeMobileMenu() {
		mobileDrawer.classList.remove("open");
		drawerBackdrop.classList.remove("open");
		mobileToggle.classList.remove("active");
		document.body.style.overflow = "";
	}

	if (mobileToggle) {
		mobileToggle.addEventListener("click", () => {
			if (mobileDrawer.classList.contains("open")) {
				closeMobileMenu();
			} else {
				openMobileMenu();
			}
		});
	}

	if (drawerClose) {
		drawerClose.addEventListener("click", closeMobileMenu);
	}

	if (drawerBackdrop) {
		drawerBackdrop.addEventListener("click", () => {
			closeMobileMenu();
			if (rfqDrawer) {
				rfqDrawer.classList.remove("open");
			}
			document.body.style.overflow = "";
		});
	}

	// Close mobile drawer when clicking navigation links
	document.querySelectorAll(".drawer-links a").forEach((a) => {
		a.addEventListener("click", closeMobileMenu);
	});

	// ==========================================================================
	// Initialize Application
	// ==========================================================================
	initCategoryPills();
	filterAndRenderProducts();
	updateHeroSlider();
	updateRfqBasketUI();
});
