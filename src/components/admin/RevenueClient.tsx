"use client";

import { useEffect, useState } from "react";
import { CountUp } from "@/components/admin/CountUp";
import { formatCurrency } from "@/lib/admin-types";

type RevenueData = {
  totals: {
    billed: { LKR: number; USD: number };
    paid: { LKR: number; USD: number };
    outstanding: { LKR: number; USD: number };
  };
  forecastMonths: Array<{ key: string; label: string; LKR: number; USD: number }>;
  forecastTotal: { LKR: number; USD: number };
  monthly: Array<{
    key: string;
    label: string;
    invoiced: { LKR: number; USD: number };
    collected: { LKR: number; USD: number };
    outstanding: { LKR: number; USD: number };
    isCurrent: boolean;
  }>;
};

export function RevenueClient() {
  const [data, setData] = useState<RevenueData | null>(null);

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then((res) => res.json())
      .then((json: RevenueData) => setData(json))
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <p>Loading revenue…</p>;
  }

  const summaryCards = [
    { label: "Billed (LKR)", value: data.totals.billed.LKR, format: (n: number) => formatCurrency(n, "LKR") },
    { label: "Paid (LKR)", value: data.totals.paid.LKR, format: (n: number) => formatCurrency(n, "LKR") },
    {
      label: "Outstanding (LKR)",
      value: data.totals.outstanding.LKR,
      format: (n: number) => formatCurrency(n, "LKR"),
    },
    { label: "Billed (USD)", value: data.totals.billed.USD, format: (n: number) => formatCurrency(n, "USD") },
    { label: "Paid (USD)", value: data.totals.paid.USD, format: (n: number) => formatCurrency(n, "USD") },
    {
      label: "Forecast (LKR)",
      value: data.forecastTotal.LKR,
      format: (n: number) => formatCurrency(n, "LKR"),
    },
  ];

  return (
    <>
      <h1 className="admin-page-title">Revenue</h1>

      <div className="admin-stats admin-stats--six">
        {summaryCards.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <div className="admin-stat-card__value">
              <CountUp value={card.value} format={card.format} />
            </div>
            <div className="admin-stat-card__label">{card.label}</div>
          </div>
        ))}
      </div>

      <section className="admin-revenue-forecast">
        <p className="admin-eyebrow">3-month forecast (sent invoices)</p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>LKR</th>
                <th>USD</th>
              </tr>
            </thead>
            <tbody>
              {data.forecastMonths.map((month) => (
                <tr key={month.key}>
                  <td>{month.label}</td>
                  <td className="admin-table__mono">{formatCurrency(month.LKR, "LKR")}</td>
                  <td className="admin-table__mono">{formatCurrency(month.USD, "USD")}</td>
                </tr>
              ))}
              <tr>
                <td className="admin-table__name">Total</td>
                <td className="admin-table__mono admin-table__lime">
                  {formatCurrency(data.forecastTotal.LKR, "LKR")}
                </td>
                <td className="admin-table__mono admin-table__lime">
                  {formatCurrency(data.forecastTotal.USD, "USD")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <p className="admin-eyebrow">Monthly breakdown (12 months)</p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Invoiced LKR</th>
                <th>Collected LKR</th>
                <th>Outstanding LKR</th>
                <th>Invoiced USD</th>
                <th>Collected USD</th>
                <th>Outstanding USD</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly.map((month) => (
                <tr key={month.key} className={month.isCurrent ? "admin-revenue-month--current" : ""}>
                  <td>{month.label}</td>
                  <td className="admin-table__mono">{formatCurrency(month.invoiced.LKR, "LKR")}</td>
                  <td className="admin-table__mono">{formatCurrency(month.collected.LKR, "LKR")}</td>
                  <td className="admin-table__mono">{formatCurrency(month.outstanding.LKR, "LKR")}</td>
                  <td className="admin-table__mono">{formatCurrency(month.invoiced.USD, "USD")}</td>
                  <td className="admin-table__mono">{formatCurrency(month.collected.USD, "USD")}</td>
                  <td className="admin-table__mono">{formatCurrency(month.outstanding.USD, "USD")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
