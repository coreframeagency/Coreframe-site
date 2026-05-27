"use client";

import { useEffect, useMemo, useState } from "react";

type Metric = {
  label: string;
  value: number;
  prefix: string;
  suffix?: string;
  change: number;
  positive: boolean;
};

const INITIAL_METRICS: Metric[] = [
  { label: "Revenue", value: 24391, prefix: "£", change: 12.4, positive: true },
  { label: "Active Users", value: 1284, prefix: "", change: 8.1, positive: true },
  { label: "Orders", value: 342, prefix: "", change: 3.2, positive: true },
  { label: "Conversion", value: 3.8, prefix: "", suffix: "%", change: -0.4, positive: false },
];

const ORDERS = [
  { id: "ORD-1042", customer: "Sarah Chen", amount: "£284.00", status: "Fulfilled" },
  { id: "ORD-1041", customer: "Marcus Webb", amount: "£129.50", status: "Processing" },
  { id: "ORD-1040", customer: "Lena Ortiz", amount: "£412.00", status: "Pending" },
  { id: "ORD-1039", customer: "James Holt", amount: "£96.00", status: "Fulfilled" },
  { id: "ORD-1038", customer: "Priya Nair", amount: "£318.75", status: "Fulfilled" },
] as const;

function generateChartData(length = 30) {
  const points: number[] = [];
  let value = 12000;

  for (let i = 0; i < length; i++) {
    value += Math.random() * 800 - 150;
    points.push(Math.max(8000, value));
  }

  return points;
}

function formatMetricValue(value: number, prefix: string, suffix?: string) {
  if (suffix === "%") return `${value.toFixed(1)}%`;
  if (prefix === "£") return `£${Math.round(value).toLocaleString("en-GB")}`;
  return Math.round(value).toLocaleString("en-GB");
}

function buildChartPath(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values) * 0.9;
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 16) - 8;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function LiveDashboard() {
  const [metrics, setMetrics] = useState(
    INITIAL_METRICS.map((metric) => ({ ...metric })),
  );
  const [chartData, setChartData] = useState<number[]>(() => generateChartData());

  const chartWidth = 640;
  const chartHeight = 200;
  const chartPath = useMemo(
    () => buildChartPath(chartData, chartWidth, chartHeight),
    [chartData],
  );

  const yLabels = useMemo(() => {
    const max = Math.max(...chartData);
    const min = Math.min(...chartData) * 0.9;
    const steps = 4;
    return Array.from({ length: steps }, (_, index) => {
      const value = min + ((max - min) / (steps - 1)) * index;
      return `£${Math.round(value / 1000)}k`;
    }).reverse();
  }, [chartData]);

  const xLabels = ["Day 1", "Day 8", "Day 15", "Day 22", "Day 30"];

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((current) =>
        current.map((metric) => {
          const delta = (Math.random() * 0.04 - 0.02) * metric.value;
          const nextValue = Math.max(
            metric.suffix === "%" ? 1 : 100,
            metric.value + delta,
          );
          const nextChange =
            metric.change + (Math.random() * 0.4 - 0.2) * Math.abs(metric.change || 1);

          return {
            ...metric,
            value: nextValue,
            change: Number(nextChange.toFixed(1)),
            positive: nextChange >= 0,
          };
        }),
      );

      setChartData((current) => {
        const last = current[current.length - 1] ?? 12000;
        const next = [...current.slice(1), last + Math.random() * 600 - 100];
        return next;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="systems-widget">
      <p className="systems-widget__label">Live Interface</p>
      <p className="systems-widget__subtext">
        A working dashboard — built in the browser. This is what we build for you.
      </p>

      <div className="live-dashboard">
        <div className="live-dashboard__metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="live-dashboard__metric">
              <p className="live-dashboard__metric-label">{metric.label}</p>
              <p className="live-dashboard__metric-value">
                {formatMetricValue(metric.value, metric.prefix, metric.suffix)}
              </p>
              <span
                className={`live-dashboard__badge ${
                  metric.positive
                    ? "live-dashboard__badge--positive"
                    : "live-dashboard__badge--negative"
                }`}
              >
                {metric.positive ? "+" : ""}
                {metric.change}%
              </span>
            </div>
          ))}
        </div>

        <div className="live-dashboard__chart-card">
          <h3 className="live-dashboard__chart-title">Revenue — Last 30 days</h3>
          <div className="live-dashboard__chart-wrap">
            <div className="live-dashboard__y-axis">
              {yLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="live-dashboard__chart"
              aria-hidden="true"
            >
              {[0, 1, 2, 3].map((index) => (
                <line
                  key={index}
                  x1="0"
                  y1={8 + index * 48}
                  x2={chartWidth}
                  y2={8 + index * 48}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}
              <path
                d={chartPath}
                fill="none"
                stroke="#A6FF00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="live-dashboard__x-axis">
            {xLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div className="live-dashboard__table-card">
          <h3 className="live-dashboard__table-title">Recent Orders</h3>
          <div className="live-dashboard__table">
            <div className="live-dashboard__table-head">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            {ORDERS.map((order) => (
              <div key={order.id} className="live-dashboard__table-row">
                <span>{order.id}</span>
                <span>{order.customer}</span>
                <span>{order.amount}</span>
                <span>
                  <span
                    className={`live-dashboard__status live-dashboard__status--${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
