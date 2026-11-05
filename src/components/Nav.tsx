'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const links = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Why Vape Sense', href: '/technology' },
  { label: 'Industries', href: '/industries' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const PRODUCTS = [
  { label: 'All products', href: '/products', desc: 'Compare the range' },
  { label: 'VapeSense Standalone', href: '/products/vapesense', desc: 'One room, no Hub needed' },
  { label: 'VapeSense Hub system', href: '/products/vapesense-hub', desc: 'A Satellite in every room, one Hub' },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const productsActive = pathname === '/products' || pathname.startsWith('/products/');

  return (
    <>
      <nav className="vs-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
            <Image
              src="/vape-sense-writing-logo.png"
              alt="Vape Sense"
              width={2350}
              height={828}
              className="nav-logo-image"
            />
          </Link>

          <div className="nav-links">
            {/* Products dropdown */}
            <div
              ref={dropdownRef}
              className={`nav-dropdown${productsOpen ? ' open' : ''}`}
            >
              <button
                className={`nav-dropdown-btn${productsActive ? ' active' : ''}`}
                aria-haspopup="true"
                aria-expanded={productsOpen}
                onClick={() => setProductsOpen((v) => !v)}
              >
                Products
                <i className="ti ti-chevron-down" aria-hidden="true" />
              </button>
              <div className="nav-dropdown-menu" role="menu">
                {PRODUCTS.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    role="menuitem"
                    onClick={() => setProductsOpen(false)}
                  >
                    {p.label}
                    <span>{p.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href || pathname.startsWith(l.href + '/') ? 'active' : ''}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav-ctas">
            <Link href="/contact?type=quote" className="btn btn-ghost-c1">Request Quote</Link>
            <Link href="/contact?type=demo" className="btn btn-solid-c1">Book Demo</Link>
          </div>

          <button
            className="nav-mobile-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <i className={open ? 'ti ti-x' : 'ti ti-menu-2'} />
          </button>
        </div>
      </nav>

      <div className={`nav-mobile-menu${open ? ' open' : ''}`} aria-hidden={!open}>
        <span style={{ fontFamily: 'var(--ff-h)', fontWeight: 700, fontSize: 18, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)', paddingTop: 14, paddingBottom: 6, display: 'block' }}>
          Products
        </span>
        {PRODUCTS.map((p) => (
          <Link key={p.href} href={p.href} className="nav-mobile-sub" onClick={() => setOpen(false)}>
            {p.label}
          </Link>
        ))}
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <div style={{ display: 'flex', gap: 8, paddingTop: 16 }}>
          <Link href="/contact?type=quote" className="btn btn-ghost-c1" onClick={() => setOpen(false)}>
            Request Quote
          </Link>
          <Link href="/contact?type=demo" className="btn btn-solid-c1" onClick={() => setOpen(false)}>
            Book Demo
          </Link>
        </div>
      </div>
    </>
  );
}
