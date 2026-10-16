
"use strict";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!expanded));
    navigation.classList.toggle("is-open", !expanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      menuButton.focus();
    }
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();

const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const recipient = "hello@example.com"; // Replace with your real email.

const fields = {
  name: document.querySelector("#name"),
  email: document.querySelector("#email"),
  message: document.querySelector("#message")
};

function setError(field, message) {
  const errorElement = document.querySelector(`#${field.id}-error`);

  field.setAttribute("aria-invalid", message ? "true" : "false");
  errorElement.textContent = message;
}

function validateForm() {
  let valid = true;

  const name = fields.name.value.trim();
  const email = fields.email.value.trim();
  const message = fields.message.value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checks = [
    [
      fields.name,
      name.length >= 2
        ? ""
        : "Enter your name (at least 2 characters)."
    ],
    [
      fields.email,
      emailPattern.test(email)
        ? ""
        : "Enter a valid email address."
    ],
    [
      fields.message,
      message.length >= 15
        ? ""
        : "Describe your project in at least 15 characters."
    ]
  ];

  for (const [field, error] of checks) {
    setError(field, error);

    if (error) valid = false;
  }

  return valid;
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") {
      validateForm();
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.dataset.state = "";

  if (!validateForm()) {
    status.textContent = "Please correct the highlighted fields.";
    status.dataset.state = "error";

    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const data = new FormData(form);

  const subject = `Website enquiry — ${data.get("name").trim()}`;

  const body = [
    `Name: ${data.get("name").trim()}`,
    `Email: ${data.get("email").trim()}`,
    `Service: ${data.get("service") || "Not specified"}`,
    `Budget: ${data.get("budget") || "Not specified"}`,
    "",
    "Project details:",
    data.get("message").trim()
  ].join("\n");

  const mailto =
    `mailto:${recipient}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  status.textContent =
    "Validation passed. Your email app will open with a prepared draft. You must send it yourself.";
  status.dataset.state = "success";

  window.location.href = mailto;
});
