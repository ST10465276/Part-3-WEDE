(function () {
  const PUBLIC_KEY = "gOm6mI9saHyV-NnzE";
  const SERVICE_ID = "service_t5qrec3";
  const TEMPLATE_ID = "template_jqtrxjp";  // Fixed: removed the "D"

  // Initialise EmailJS
  emailjs.init(PUBLIC_KEY);

  // Footer date and time
  const demo = document.getElementById("demo");
  if (demo) {
    const now = new Date();
    demo.textContent = now.toLocaleString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("TM_Legal-form");
    const submitBtn = document.getElementById("submitBtn");

    const nameInput = document.getElementById("name");
    const contactInput = document.getElementById("contact");
    const emailInput = document.getElementById("email");
    const serviceSelect = document.getElementById("service");
    const sourceSelect = document.getElementById("source");

    const nameError = document.getElementById("nameError");
    const contactError = document.getElementById("contactError");
    const emailError = document.getElementById("emailError");
    const serviceError = document.getElementById("serviceError");
    const sourceError = document.getElementById("sourceError");

    function showError(element, message) {
      element.textContent = message;
      element.style.color = "red";
    }

    function clearError(element) {
      element.textContent = "";
    }

    // Validation functions
    function validateName() {
	const name = nameInput.value.trim();
    const nameRegex = /^[A-Za-z\s\-']+$/;
	
      if (name.length < 2) {
        showError(nameError, "Please enter your full name");
        return false;
      }
	  if (!nameRegex.test(name)) {
        showError(nameError, "Name can only contain letters (no numbers or symbols)");
        return false;
      }
      clearError(nameError);
      return true;
    }

    function validateContact() {
      const phone = contactInput.value.trim().replace(/\s+/g, "");
      const saPhoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
      if (!saPhoneRegex.test(phone)) {
        showError(contactError, "Valid SA mobile required (e.g. 0821234567 or +27821234567)");
        return false;
      }
      clearError(contactError);
      return true;
    }

    function validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailError, "Please enter a valid email address");
        return false;
      }
      clearError(emailError);
      return true;
    }

    function validateService() {
      if (serviceSelect.value === "") {
        showError(serviceError, "Please select a service");
        return false;
      }
      clearError(serviceError);
      return true;
    }

    function validateSource() {
      if (sourceSelect.value === "") {
        showError(sourceError, "Please select where you heard about us");
        return false;
      }
      clearError(sourceError);
      return true;
    }

    // Real-time validation
    nameInput.addEventListener("blur", validateName);
    contactInput.addEventListener("blur", validateContact);
    emailInput.addEventListener("blur", validateEmail);
    serviceSelect.addEventListener("change", validateService);
    sourceSelect.addEventListener("change", validateSource);

    // Form submit
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Run all validations and combine results
      const isNameValid = validateName();
      const isContactValid = validateContact();
      const isEmailValid = validateEmail();
      const isServiceValid = validateService();
      const isSourceValid = validateSource();

      const isValid = isNameValid && isContactValid && isEmailValid && isServiceValid && isSourceValid;

      if (!isValid) {
        alert("Please fix the errors above before submitting.");
        return;
      }

      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // Correct service & template IDs + pass the form element
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
        .then(() => {
          alert("Thank you! Your message has been sent successfully. We will contact you soon.");
          form.reset();
          [nameError, contactError, emailError, serviceError, sourceError].forEach(clearError);
        })
        .catch((error) => {
          console.error("EmailJS error:", error);
          alert("Failed to send. Please check your internet or try again later.");
        })
        .finally(() => {
          submitBtn.textContent = "SUBMIT";
          submitBtn.disabled = false;
        });
    });
  });
})();