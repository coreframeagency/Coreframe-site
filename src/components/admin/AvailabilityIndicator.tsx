import type { AvailabilityStatus } from "@prisma/client";

type AvailabilityIndicatorProps = {
  status: AvailabilityStatus;
  compact?: boolean;
};

export function AvailabilityIndicator({ status, compact = false }: AvailabilityIndicatorProps) {
  const config = {
    OPEN: {
      dot: "site-footer__availability-dot--green admin-availability-dot--pulse",
      label: "Taking new projects",
      sub: "Open for new work",
      badge: "OPEN",
      badgeClass: "site-footer__availability-badge--lime",
    },
    LIMITED: {
      dot: "site-footer__availability-dot--amber",
      label: "Current capacity",
      sub: "1 slot remaining this quarter",
      badge: "LIMITED",
      badgeClass: "site-footer__availability-badge--amber",
    },
    FULL: {
      dot: "site-footer__availability-dot--dim",
      label: "Project capacity",
      sub: "Not accepting new projects",
      badge: "FULL",
      badgeClass: "site-footer__availability-badge--dim",
    },
  }[status];

  if (compact) {
    return (
      <div className="site-footer__availability-row">
        <div className="site-footer__availability-left">
          <span className={`site-footer__availability-dot ${config.dot}`} />
          <div>
            <p className="site-footer__availability-label">{config.label}</p>
            <p className="site-footer__availability-sub">{config.sub}</p>
          </div>
        </div>
        <span className={`site-footer__availability-badge ${config.badgeClass}`}>
          {config.badge}
        </span>
      </div>
    );
  }

  return (
    <div className="site-footer__availability">
      <div className="site-footer__availability-row">
        <div className="site-footer__availability-left">
          <span className={`site-footer__availability-dot ${config.dot}`} />
          <div>
            <p className="site-footer__availability-label">{config.label}</p>
            <p className="site-footer__availability-sub">{config.sub}</p>
          </div>
        </div>
        <span className={`site-footer__availability-badge ${config.badgeClass}`}>
          {config.badge}
        </span>
      </div>
      <div className="site-footer__availability-row">
        <div className="site-footer__availability-left">
          <span className={`site-footer__availability-dot ${config.dot}`} />
          <div>
            <p className="site-footer__availability-label">Response time</p>
            <p className="site-footer__availability-sub">Typically within 24 hours</p>
          </div>
        </div>
        <span className="site-footer__availability-badge site-footer__availability-badge--lime">
          FAST
        </span>
      </div>
    </div>
  );
}
