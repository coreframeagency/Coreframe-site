"use client";

import { FormEvent, useState } from "react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ProjectQualifier } from "./ProjectQualifier";
const WHATSAPP_NUMBER = "94XXXXXXXXX"; // Replace with real WhatsApp number
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgvobzg";

const SERVICE_OPTIONS = [
  { value: "", label: "Select a service..." },
  { value: "New website or platform", label: "New website or platform" },
  { value: "E-commerce system", label: "E-commerce system" },
  { value: "AI integration", label: "AI integration" },
  { value: "Brand & web system", label: "Brand & web system" },
  { value: "Custom development", label: "Custom development" },
  { value: "Something else", label: "Something else" },
] as const;

const CONTACT_DETAILS = [
  { label: "EMAIL", value: "coreframeagency@gmail.com" },
  { label: "BASED IN", value: "Colombo, Sri Lanka" },
  { label: "RESPONSE TIME", value: "Within 24 hours" },
] as const;

type FormStatus = "idle" | "loading" | "success";

function buildWhatsAppUrl(name: string, service: string, message: string) {
  const text = `Hi COREFRAME, I'm ${name}. I'm looking for ${service}. ${message}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function ContactCard() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [messageInvalid, setMessageInvalid] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const isNameEmpty = !trimmedName;
    const isMessageEmpty = !trimmedMessage;

    setNameInvalid(isNameEmpty);
    setMessageInvalid(isMessageEmpty);
    setSubmitError(null);

    if (isNameEmpty || isMessageEmpty) return;

    setStatus("loading");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          service,
          message: trimmedMessage,
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("idle");
        setSubmitError("Something went wrong. Please try WhatsApp instead.");
      }
    } catch {
      setStatus("idle");
      setSubmitError("Something went wrong. Please try WhatsApp instead.");
    }
  };

  const handleWhatsApp = () => {
    const trimmedName = name.trim() || "there";
    const trimmedService = service || "your services";
    const trimmedMessage = message.trim() || "I'd like to discuss a project.";
    const url = buildWhatsAppUrl(trimmedName, trimmedService, trimmedMessage);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="contact-page">
      <div className="contact-page__inner">
        <header className="contact-page__intro">
          <h1 className="contact-page__title">Start a conversation.</h1>
          <p className="contact-page__subtitle">
            Tell us what you need. We&apos;ll take it from there.
          </p>
        </header>

        <RevealOnScroll className="project-qualifier-wrap">
          <ProjectQualifier />
        </RevealOnScroll>

        <div id="contact-form-card">
        <RevealOnScroll className="contact-card">
          {status === "success" ? (
            <div className="contact-card__success" aria-live="polite">
              <span className="contact-card__success-check" aria-hidden="true">
                ✓
              </span>
              <h2 className="contact-card__success-heading">Message received.</h2>
              <p className="contact-card__success-subline">
                We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form className="contact-card__form" onSubmit={handleSubmit} noValidate>
              <div className="contact-card__field">
                <label htmlFor="contact-name" className="contact-card__label">
                  YOUR NAME
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setNameInvalid(false);
                    setSubmitError(null);
                  }}
                  className="contact-card__input"
                  style={nameInvalid ? { borderColor: "#FF6B6B" } : undefined}
                />
              </div>

              <div className="contact-card__field">
                <label htmlFor="contact-service" className="contact-card__label">
                  WHAT DO YOU NEED?
                </label>
                <select
                  id="contact-service"
                  name="service"
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  className="contact-card__select"
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <option
                      key={option.value || "placeholder"}
                      value={option.value}
                      disabled={option.value === ""}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-card__field contact-card__field--message">
                <label htmlFor="contact-message" className="contact-card__label">
                  YOUR MESSAGE
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="What are you trying to solve?"
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setMessageInvalid(false);
                    setSubmitError(null);
                  }}
                  className="contact-card__textarea"
                  style={messageInvalid ? { borderColor: "#FF6B6B" } : undefined}
                />
              </div>

              <button
                type="submit"
                className="contact-card__submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "SENDING..." : "SEND MESSAGE →"}
              </button>

              {submitError && (
                <p
                  role="alert"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    color: "#FF6B6B",
                    marginTop: "12px",
                  }}
                >
                  {submitError}
                </p>
              )}

              <div className="contact-card__divider" aria-hidden="true">
                <span className="contact-card__divider-line" />
                <span className="contact-card__divider-text">or</span>
                <span className="contact-card__divider-line" />
              </div>

              {/* Replace with real WhatsApp number */}
              <button
                type="button"
                className="contact-card__whatsapp"
                onClick={handleWhatsApp}
              >
                CONTINUE ON WHATSAPP →
              </button>
            </form>
          )}
        </RevealOnScroll>
        </div>

        <div className="contact-page__details">
          {CONTACT_DETAILS.map((detail) => (
            <div key={detail.label} className="contact-page__detail">
              <p className="contact-page__detail-label">{detail.label}</p>
              <p className="contact-page__detail-value">{detail.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
