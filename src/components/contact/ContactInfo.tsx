import { SOCIAL_LINKS } from "@/lib/social-links";

export function ContactInfo() {
  return (
    <aside className="contact-info" aria-label="Contact information">
      <p className="contact-info__statement">
        We work with founders and operators who are ready to stop patching problems
        and start building systems.
      </p>

      <div className="contact-info__details">
        <div className="contact-info__row">
          <p className="contact-info__label">EMAIL</p>
          <a href="mailto:hello@coreframe.agency" className="contact-info__value">
            hello@coreframe.agency
          </a>
        </div>

        <div className="contact-info__row">
          <p className="contact-info__label">WHATSAPP</p>
          <p className="contact-info__value">+94 XX XXX XXXX</p>
        </div>

        <div className="contact-info__row">
          <p className="contact-info__label">BASED IN</p>
          <p className="contact-info__value">
            Colombo, Sri Lanka.
            <br />
            Available globally.
          </p>
        </div>
      </div>

      <div className="contact-info__row contact-info__follow">
        <p className="contact-info__label">FOLLOW</p>
        <div className="contact-info__social">
          {SOCIAL_LINKS.map(({ label, href, placeholder }) => (
            <a
              key={label}
              href={href}
              className="contact-info__social-link"
              {...(placeholder ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="contact-info__divider" aria-hidden="true" />

      <div className="contact-info__reassurance">
        <p>— Typical response time: within 24 hours</p>
        <p>— No sales calls. Just a conversation.</p>
        <p>— We take on limited projects to ensure quality.</p>
      </div>
    </aside>
  );
}
