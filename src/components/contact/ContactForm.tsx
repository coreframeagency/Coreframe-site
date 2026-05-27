"use client";

import { FormEvent, useState } from "react";

const SERVICE_OPTIONS = [
  { value: "", label: "Select a service...", disabled: true },
  { value: "new-website", label: "New website or platform" },
  { value: "ecommerce", label: "E-commerce system" },
  { value: "ai-integration", label: "AI integration" },
  { value: "brand-web", label: "Brand & web system" },
  { value: "custom-dev", label: "Custom development" },
  { value: "something-else", label: "Something else" },
] as const;

type FormStatus = "idle" | "loading" | "success";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    window.setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  if (status === "success") {
    return (
      <div className="contact-form-success" aria-live="polite">
        <span className="contact-form-success__check" aria-hidden="true">
          ✓
        </span>
        <h2 className="contact-form-success__heading">Message received.</h2>
        <p className="contact-form-success__subline">
          We&apos;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__field">
        <label htmlFor="contact-name" className="contact-form__label">
          YOUR NAME
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="contact-form__input"
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-company" className="contact-form__label">
          COMPANY
        </label>
        <input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className="contact-form__input"
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-service" className="contact-form__label">
          WHAT DO YOU NEED?
        </label>
        <div className="contact-form__select-wrap">
          <select
            id="contact-service"
            name="service"
            required
            value={service}
            onChange={(event) => setService(event.target.value)}
            className="contact-form__select"
          >
            {SERVICE_OPTIONS.map((option) => (
              <option
                key={option.value || "placeholder"}
                value={option.value}
                disabled={"disabled" in option ? option.disabled : false}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message" className="contact-form__label">
          TELL US MORE
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          placeholder="Describe what you're trying to solve..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="contact-form__textarea"
        />
      </div>

      <button
        type="submit"
        className={`contact-form__submit${status === "loading" ? " is-loading" : ""}`}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "SEND IT →"}
      </button>
    </form>
  );
}
