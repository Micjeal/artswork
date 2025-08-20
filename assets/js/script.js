// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
} else {
  console.warn("Hamburger or nav-menu elements not found.");
}

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) => {
  n.addEventListener("click", () => {
    if (hamburger && navMenu) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "none";
    }
  }
});

// Fade in animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Initialize gallery and other features when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Animate elements on scroll
  const animateElements = document.querySelectorAll(".featured-card, .exhibition-content, .hero-content");
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Handle image load
  function handleImageLoad(img) {
    const item = img.closest(".gallery-item");
    if (item) {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }
  }

  // Close lightbox function
  function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      lightbox.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  // Success Modal Functionality
  function closeSuccessModal() {
    const successModal = document.getElementById("success-modal");
    if (successModal) {
      successModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  // Make closeSuccessModal globally available
  window.closeSuccessModal = closeSuccessModal;

  // Gallery Functionality
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDescription = document.getElementById("lightbox-description");
  const lightboxCategory = document.getElementById("lightbox-category");
  const lightboxClose = document.querySelector(".lightbox-close");

  // Initialize gallery items
  if (galleryItems.length > 0) {
    galleryItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("loaded");
      }, 100 * index);

      const img = item.querySelector("img");
      if (img) {
        if (img.complete) {
          handleImageLoad(img);
        } else {
          img.addEventListener("load", () => handleImageLoad(img));
        }
      }
    });
  }

  // Initialize filter buttons
  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");

        galleryItems.forEach((item) => {
          if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
            item.style.display = "block";
            setTimeout(() => item.classList.remove("hidden"), 10);
            item.style.opacity = "0";
            item.style.transform = "translateY(20px)";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, 100);
          } else {
            item.classList.add("hidden");
            setTimeout(() => {
              if (item.classList.contains("hidden")) {
                item.style.display = "none";
              }
            }, 300);
          }
        });
      });
    });
  }

  // Add click handler to gallery items
  if (galleryItems.length > 0 && lightbox && lightboxImage && lightboxTitle && lightboxDescription && lightboxCategory) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.closest(".gallery-overlay")) return;

        const img = item.querySelector("img");
        const overlay = item.querySelector(".gallery-overlay");

        if (img) {
          lightboxImage.src = img.src;
          lightboxImage.alt = img.alt || "";

          if (overlay) {
            const titleEl = overlay.querySelector("h3");
            const descEl = overlay.querySelector("p");
            const categoryEl = overlay.querySelector(".category-tag");

            lightboxTitle.textContent = titleEl ? titleEl.textContent : "";
            lightboxDescription.textContent = descEl ? descEl.textContent : "";
            lightboxCategory.textContent = categoryEl ? categoryEl.textContent : "";
          }

          lightbox.style.display = "block";
          document.body.style.overflow = "hidden";
        }
      });
    });
  }

  // Close lightbox when clicking outside or pressing ESC
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.style.display === "block") {
        closeLightbox();
      }
    });
  }

  // Close lightbox when clicking on close button
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  // Exhibition and Event Registration Functionality
  const modal = document.getElementById("registration-modal");

  if (modal) {
    const modalTitle = document.getElementById("modal-title");
    const modalClose = modal.querySelector(".modal-close");
    const registrationForm = document.getElementById("registration-form");
    const registerButtons = document.querySelectorAll(".register-btn");
    const successModal = document.getElementById("success-modal");
    const successModalClose = successModal?.querySelector(".modal-close");

    // Open registration modal
    if (registerButtons.length > 0 && modalTitle) {
      registerButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const eventTitle = button.getAttribute("data-event") || "Event";
          modalTitle.textContent = `Register for ${eventTitle}`;
          modal.style.display = "block";
          document.body.style.overflow = "hidden";
        });
      });
    }

    // Close modal when clicking the close button
    if (modalClose) {
      modalClose.addEventListener("click", () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      });
    }

    // Close success modal
    if (successModalClose) {
      successModalClose.addEventListener("click", closeSuccessModal);
    }

    // Close modals when clicking outside
    [modal, successModal].forEach((modalElement) => {
      if (modalElement) {
        modalElement.addEventListener("click", (e) => {
          if (e.target === modalElement) {
            modalElement.style.display = "none";
            document.body.style.overflow = "auto";
          }
        });
      }
    });

    // Handle form submission
    if (registrationForm) {
      registrationForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(registrationForm);
        const eventTitle = document.getElementById("modal-title")?.textContent || "Unknown Event";
        const registrationData = {
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          interest: formData.get("interest"),
          newsletter: formData.get("newsletter") === "on",
          event: eventTitle,
        };

        console.log("Form submitted:", registrationData);

        if (successModal) {
          modal.style.display = "none";
          successModal.style.display = "block";
          document.body.style.overflow = "hidden";
        } else {
          alert("Registration successful! We'll be in touch soon.");
          modal.style.display = "none";
          document.body.style.overflow = "auto";
        }

        registrationForm.reset();
      });
    }

    // Add transition to modal
    modal.style.transition = "opacity 0.3s ease";
  }

  // Global Escape key handler for all modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        if (modal && modal.style.display === "block") {
          modal.style.display = "none";
          document.body.style.overflow = "auto";
        }
      });
    }
  });

  // Countdown Timer Functionality
  const updateCountdown = () => {
    const targetDate = new Date("2026-05-20T23:59:59").getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      const daysElement = document.getElementById("days");
      const hoursElement = document.getElementById("hours");
      const minutesElement = document.getElementById("minutes");

      if (daysElement) daysElement.textContent = days;
      if (hoursElement) hoursElement.textContent = hours;
      if (minutesElement) minutesElement.textContent = minutes;
    }
  };

  updateCountdown();
  setInterval(updateCountdown, 60000);

  // Past Exhibition Archive Functionality
  const pastExhibitionItems = document.querySelectorAll(".past-exhibition-item");
  pastExhibitionItems.forEach((item) => {
    item.addEventListener("click", () => {
      const title = item.querySelector("h4")?.textContent || "Unknown Exhibition";
      alert(`Archive for "${title}" - This would typically link to a detailed archive page with photos and information from the exhibition.`);
    });
  });

  // Contact Form Validation and Submission
  const contactForm = document.getElementById("contact-form");
  const successModal = document.getElementById("success-modal");

  if (contactForm) {
    const validateForm = () => {
      let isValid = true;
      const formData = new FormData(contactForm);

      document.querySelectorAll(".error-message").forEach((error) => {
        error.classList.remove("show");
      });
      document.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("error");
      });

      const name = formData.get("name")?.trim();
      if (!name) {
        showError("name", "Name is required");
        isValid = false;
      } else if (name.length < 2) {
        showError("name", "Name must be at least 2 characters");
        isValid = false;
      }

      const email = formData.get("email")?.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        showError("email", "Email is required");
        isValid = false;
      } else if (!emailRegex.test(email)) {
        showError("email", "Please enter a valid email address");
        isValid = false;
      }

      const subject = formData.get("subject");
      if (!subject) {
        showError("subject", "Please select a subject");
        isValid = false;
      }

      const message = formData.get("message")?.trim();
      if (!message) {
        showError("message", "Message is required");
        isValid = false;
      } else if (message.length < 10) {
        showError("message", "Message must be at least 10 characters");
        isValid = false;
      }

      return isValid;
    };

    const showError = (fieldName, message) => {
      const errorElement = document.getElementById(`${fieldName}-error`);
      const formGroup = document.getElementById(`contact-${fieldName}`)?.closest(".form-group");

      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add("show");
      }

      if (formGroup) {
        formGroup.classList.add("error");
      }
    };

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (validateForm()) {
        const formData = new FormData(contactForm);
        const contactData = {
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          newsletter: formData.get("newsletter") === "on",
          timestamp: new Date().toISOString(),
        };

        console.log("Contact form submitted:", contactData);

        if (successModal) {
          successModal.style.display = "block";
          document.body.style.overflow = "hidden";
          successModal.style.opacity = "0";
          setTimeout(() => {
            successModal.style.opacity = "1";
          }, 10);
        }

        contactForm.reset();
      }
    });

    const inputs = contactForm.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        const formGroup = input.closest(".form-group");
        const errorElement = formGroup?.querySelector(".error-message");

        if (input.value.trim()) {
          formGroup?.classList.remove("error");
          errorElement?.classList.remove("show");
        }
      });

      input.addEventListener("input", () => {
        const formGroup = input.closest(".form-group");
        const errorElement = formGroup?.querySelector(".error-message");

        if (input.value.trim()) {
          formGroup?.classList.remove("error");
          errorElement?.classList.remove("show");
        }
      });
    });
  }

  // FAQ Items Interaction
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.style.transform = "scale(0.98)";
      setTimeout(() => {
        item.style.transform = "translateY(-5px)";
      }, 100);
    });
  });

  // Social Media Links Analytics
  const socialLinks = document.querySelectorAll(".social-link");
  socialLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const platform = link.classList.contains("instagram")
        ? "Instagram"
        : link.classList.contains("facebook")
        ? "Facebook"
        : link.classList.contains("twitter")
        ? "Twitter"
        : "YouTube";

      console.log(`Social media click: ${platform}`);
      alert(`This would open our ${platform} page in a new window.`);
    });
  });

  // Success modal close button is already initialized in the closeSuccessModal function
}); // Closing the DOMContentLoaded event listener