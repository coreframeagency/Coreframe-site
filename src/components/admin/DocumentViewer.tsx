import { Wordmark } from "@/components/brand/Wordmark";
import {
  formatCurrency,
  formatDate,
  parseLineItems,
  parsePaymentSchedule,
} from "@/lib/admin-types";
import type { Client, Document } from "@prisma/client";
import Link from "next/link";

type DocumentWithClient = Document & { client: Client };

type DocumentViewerProps = {
  document: DocumentWithClient;
  showActions?: boolean;
  pdfEndpoint: string;
};

export function DocumentViewer({
  document,
  showActions = true,
  pdfEndpoint,
}: DocumentViewerProps) {
  const lineItems = parseLineItems(document.lineItems);
  const paymentSchedule = parsePaymentSchedule(document.paymentSchedule);
  const typeLabel = document.type === "INVOICE" ? "Invoice" : "Quotation";

  return (
    <div className="doc-page">
      <div className="doc-page__inner">
        <div className="doc-header">
          <Wordmark />
          <div className="doc-header__meta">
            <div className="doc-header__type">
              {typeLabel} <span className="doc-header__dot" /> {document.number}
            </div>
            <div>Issued {formatDate(document.issueDate)}</div>
            {document.dueDate ? <div>Due {formatDate(document.dueDate)}</div> : null}
            {document.validUntil ? <div>Valid until {formatDate(document.validUntil)}</div> : null}
          </div>
        </div>

        <div className="doc-hairline" />

        <div className="doc-parties">
          <div>
            <p className="doc-party__label">From</p>
            <p className="doc-party__name">COREFRAME</p>
            <p className="doc-party__detail">coreframe.agency</p>
            <p className="doc-party__detail">Systems / Strategy / Design</p>
          </div>
          <div className="doc-parties__divider" aria-hidden="true" />
          <div>
            <p className="doc-party__label">To</p>
            <p className="doc-party__name">{document.client.name}</p>
            <p className="doc-party__detail">{document.client.company}</p>
            <p className="doc-party__detail">{document.client.email}</p>
            <p className="doc-party__detail">{document.client.address}</p>
            <p className="doc-party__detail">{document.client.country}</p>
          </div>
        </div>

        <div className="doc-hairline" />

        <div className="doc-project-row">
          <div>
            <p className="doc-project-row__label">Project</p>
            <p className="doc-project-row__value">{document.projectName}</p>
          </div>
          <div>
            <p className="doc-project-row__label">Currency</p>
            <p className="doc-project-row__value">{document.currency}</p>
          </div>
          <p className="doc-status">{document.status}</p>
        </div>

        <div className="doc-hairline" />

        <table className="doc-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.rate, document.currency)}</td>
                <td>{formatCurrency(item.amount, document.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="doc-total-row">
          <span>Subtotal</span>
          <span className="doc-total-row__amount">
            {formatCurrency(document.subtotal, document.currency)}
          </span>
        </div>
        <div className="doc-hairline" />
        <div className="doc-total-row doc-total-row--grand">
          <span>Total</span>
          <span className="doc-total-row__amount">
            {formatCurrency(document.total, document.currency)}
          </span>
        </div>

        <div className="doc-hairline" />

        <p className="doc-party__label">Payment schedule</p>
        {paymentSchedule.map((item, index) => (
          <div key={index} className="doc-schedule-item">
            <div>
              <strong>{item.label}</strong>
              <p className="doc-party__detail">{item.description}</p>
            </div>
            <span className="doc-schedule-item__amount">
              {formatCurrency(item.amount, document.currency)}
            </span>
          </div>
        ))}

        {document.notes ? (
          <>
            <div className="doc-hairline" />
            <p className="doc-party__label">Notes</p>
            <p className="doc-notes">{document.notes}</p>
          </>
        ) : null}

        <div className="doc-hairline" />

        <div className="doc-footer">
          <span>Systems / Strategy / Design</span>
          <span>coreframe.agency</span>
        </div>

        {showActions ? (
          <div className="doc-actions">
            <a href={pdfEndpoint} className="doc-actions__primary">
              Download PDF
            </a>
            <Link href="https://coreframe.agency" className="doc-actions__ghost">
              Visit coreframe.agency
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
