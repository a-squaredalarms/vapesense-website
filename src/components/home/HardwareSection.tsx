'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type ProductId = 'solo' | 'hub';

type Product = {
  id: ProductId;
  badge: string;
  badgeIcon: string;
  name: string;
  description: string;
  features: { icon: string; label: string }[];
  details: { icon: string; label: string; value: string }[];
  expandedStats: { label: string; value: string }[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

const products: Product[] = [
  {
    id: 'solo',
    badge: 'Single unit',
    badgeIcon: 'ti-circle-dot',
    name: 'VapeSense Standalone',
    description:
      'One self-contained unit for one room. Its own dashboard, alerts, users and scheduling — no hub required.',
    features: [
      { icon: 'ti-activity', label: 'Vape detection' },
      { icon: 'ti-wind', label: 'Air quality' },
      { icon: 'ti-bell-ringing', label: 'Instant alerts' },
      { icon: 'ti-wifi', label: 'Wi-Fi or Ethernet' },
    ],
    details: [
      { icon: 'ti-wifi', label: 'Works on your Wi-Fi or network, no hub needed', value: 'Included' },
      { icon: 'ti-chart-bar', label: 'Built-in dashboard and alerts', value: 'Included' },
      { icon: 'ti-ruler', label: 'Coverage per sensor', value: 'Up to ~30 m²' },
    ],
    expandedStats: [
      { label: 'Coverage', value: '~30 m²' },
      { label: 'Install', value: '1 room' },
      { label: 'Alerts', value: 'Live' },
      { label: 'Response', value: '<60s' },
    ],
    primaryHref: '/contact?type=quote',
    primaryLabel: 'Get a Quote',
    secondaryHref: '/products/vapesense',
    secondaryLabel: 'View product',
  },
  {
    id: 'hub',
    badge: 'Building-wide',
    badgeIcon: 'ti-building',
    name: 'VapeSense Hub system',
    description:
      'A Satellite in every room, all reporting to one Hub: one dashboard, one alert feed, one set of staff logins for the whole building.',
    features: [
      { icon: 'ti-building', label: 'Central hub' },
      { icon: 'ti-topology-star', label: 'Every room, one view' },
      { icon: 'ti-map-pin', label: 'Multi-zone alerts' },
      { icon: 'ti-arrows-maximize', label: 'Scalable' },
    ],
    details: [
      { icon: 'ti-users', label: 'Choose who is alerted for each room', value: 'Included' },
      { icon: 'ti-lock', label: 'Sensor-to-hub link', value: 'Encrypted' },
      { icon: 'ti-refresh', label: 'Fleet-wide updates', value: 'One click' },
    ],
    expandedStats: [
      { label: 'Sensors', value: 'Add any time' },
      { label: 'Link', value: 'Secure' },
      { label: 'Scale', value: 'Multi-site' },
      { label: 'Zoning', value: 'Room-level' },
    ],
    primaryHref: '/contact?type=quote',
    primaryLabel: 'Get a Quote',
    secondaryHref: '/products/vapesense-hub',
    secondaryLabel: 'View product',
  },
];

function SoloVisual() {
  return (
    <>
      <div className="hardware-ping-ring" />
      <div className="hardware-ping-ring hardware-ping-ring-delayed" />
      <div className="hardware-sensor-box">
        <div className="hardware-sensor-led" />
        <div className="hardware-sensor-id">VS-01</div>
      </div>
    </>
  );
}

function HubVisual() {
  return (
    <div className="hardware-hub-visual">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="32"
          stroke="rgba(15,168,204,.3)"
          strokeWidth="1"
          strokeDasharray="4 3"
        >
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="1.4s" repeatCount="indefinite" />
        </line>
        <line
          x1="100"
          y1="100"
          x2="168"
          y2="100"
          stroke="rgba(15,168,204,.3)"
          strokeWidth="1"
          strokeDasharray="4 3"
        >
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="168"
          stroke="rgba(15,168,204,.3)"
          strokeWidth="1"
          strokeDasharray="4 3"
        >
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="1.2s" repeatCount="indefinite" />
        </line>
        <line
          x1="100"
          y1="100"
          x2="32"
          y2="100"
          stroke="rgba(15,168,204,.3)"
          strokeWidth="1"
          strokeDasharray="4 3"
        >
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="2s" repeatCount="indefinite" />
        </line>
      </svg>
      <div className="hardware-hub-box">
        <i className="ti ti-cpu hardware-hub-box-icon" aria-hidden="true" />
        <div className="hardware-hub-box-label">HUB</div>
      </div>
      <div className="hardware-hub-node hardware-hub-node-top">
        <div className="hardware-hub-node-dot" />
      </div>
      <div className="hardware-hub-node hardware-hub-node-right">
        <div className="hardware-hub-node-dot" />
      </div>
      <div className="hardware-hub-node hardware-hub-node-bottom">
        <div className="hardware-hub-node-dot" />
      </div>
      <div className="hardware-hub-node hardware-hub-node-left">
        <div className="hardware-hub-node-dot" />
      </div>
    </div>
  );
}

export default function HardwareSection() {
  const [activePanel, setActivePanel] = useState<ProductId | null>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, []);

  function expandPanel(panel: ProductId) {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    setActivePanel(panel);
  }

  function scheduleCollapse() {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    collapseTimerRef.current = setTimeout(() => {
      setActivePanel(null);
      collapseTimerRef.current = null;
    }, 600);
  }

  return (
    <section className="hardware" id="hardware">
      <h2 className="sr-only">Our hardware</h2>
      <div className="w">
        <div className="hardware-header">
          <span className="section-tag" style={{ color: 'var(--c4)' }}>
            Our hardware
          </span>
          <div className="section-heading" style={{ color: 'var(--c0)' }}>
            TWO PRODUCTS.
            <br />
            ONE PLATFORM.
          </div>
          <p className="section-sub" style={{ color: 'var(--c6)' }}>
            Start with a single room or deploy a full building network. Both products run on the
            same Vape Sense platform, with setup sized to your site.
          </p>
        </div>

        <div
          className={`hardware-stage${activePanel ? ` expand-${activePanel}` : ''}`}
          onMouseLeave={scheduleCollapse}
          onBlurCapture={(event) => {
            const next = event.relatedTarget;
            if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
              scheduleCollapse();
            }
          }}
        >
          <div className="hardware-divider" aria-hidden="true">
            <div className="hardware-divider-label">vs</div>
          </div>

          {products.map((product) => {
            const theme = product.id;
            const isActive = activePanel === product.id;

            return (
              <article
                key={product.id}
                className={`hardware-panel hardware-panel-${theme}${isActive ? ' is-active' : ''}`}
                tabIndex={0}
                onMouseEnter={() => expandPanel(product.id)}
                onFocus={() => expandPanel(product.id)}
                onClick={() => setActivePanel((current) => (current === product.id ? null : product.id))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActivePanel((current) => (current === product.id ? null : product.id));
                  }
                }}
              >
                <div className="hardware-device-visual" aria-hidden="true">
                  {product.id === 'solo' ? <SoloVisual /> : <HubVisual />}
                </div>

                <div className="hardware-panel-content">
                  <div className={`hardware-product-tag ${theme}`}>
                    <i className={`ti ${product.badgeIcon}`} aria-hidden="true" />
                    {product.badge}
                  </div>

                  <div className={`hardware-product-name ${theme}`}>{product.name}</div>
                  <p className={`hardware-product-description ${theme}`}>{product.description}</p>

                  <div className="hardware-feature-pills">
                    {product.features.map((feature) => (
                      <div key={feature.label} className={`hardware-pill ${theme}`}>
                        <i className={`ti ${feature.icon}`} aria-hidden="true" />
                        {feature.label}
                      </div>
                    ))}
                  </div>

                  <div className="hardware-expanded-grid">
                    <div className="hardware-expanded-main">
                      <div className="hardware-detail-rows">
                        {product.details.map((detail, index) => (
                          <div
                            key={detail.label}
                            className={`hardware-detail-row ${index > 0 ? `hardware-detail-row-border-${theme}` : ''}`}
                          >
                            <div className={`hardware-detail-icon ${theme}`}>
                              <i className={`ti ${detail.icon}`} aria-hidden="true" />
                            </div>
                            <div className={`hardware-detail-text ${theme}`}>{detail.label}</div>
                            <div className={`hardware-detail-value ${theme}`}>{detail.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <aside className={`hardware-expanded-rail ${theme}`}>
                      <span className={`hardware-expanded-rail-label ${theme}`}>
                        Deployment snapshot
                      </span>
                      <div className="hardware-expanded-stat-grid">
                        {product.expandedStats.map((stat) => (
                          <div key={stat.label} className={`hardware-expanded-stat ${theme}`}>
                            <span className={`hardware-expanded-stat-value ${theme}`}>{stat.value}</span>
                            <span className={`hardware-expanded-stat-label ${theme}`}>{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    </aside>
                  </div>

                </div>

                <div className="hardware-panel-actions">
                  <Link href={product.primaryHref} className={`hardware-product-cta ${theme}`}>
                    {product.primaryLabel}
                  </Link>
                  <Link href={product.secondaryHref} className={`hardware-product-ghost ${theme}`}>
                    {product.secondaryLabel}
                    <i className="ti ti-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
