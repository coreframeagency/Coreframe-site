const PROOF_ITEMS = [
  {
    name: "epiccampus.live",
    detail: "Full campus digitised / LMS + payments + portals",
  },
  {
    name: "raicurujp.com",
    detail: "International client / Japan",
  },
  {
    name: null,
    detail: "12+ systems shipped and operating",
  },
  {
    name: null,
    detail: "3 countries / Sri Lanka · Japan · growing",
  },
  {
    name: "kidneypartner.online",
    detail: "Paired donation matching system",
  },
  {
    name: "abeyskitchen.com",
    detail: "Full e-commerce stack",
  },
] as const;

function ProofItem({
  name,
  detail,
}: {
  name: string | null;
  detail: string;
}) {
  return (
    <span className="proof-bar__item">
      {name ? (
        <>
          <span className="proof-bar__name">{name}</span>
          <span className="proof-bar__slash"> / </span>
        </>
      ) : null}
      <span className="proof-bar__detail">{detail}</span>
    </span>
  );
}

export function ProofBar() {
  const trackItems = [...PROOF_ITEMS, ...PROOF_ITEMS];

  return (
    <div className="proof-bar" aria-hidden="true">
      <div className="proof-bar__live">
        <span className="proof-bar__dot" />
        <span className="proof-bar__live-label">LIVE</span>
      </div>
      <div className="proof-bar__viewport">
        <div className="proof-bar__track">
          {trackItems.map((item, index) => (
            <ProofItem
              key={`${item.detail}-${index}`}
              name={item.name}
              detail={item.detail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
