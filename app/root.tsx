import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css"
        ></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="Navigation"
      >
        <div className="navbar-brand">
          <a href="/" className="navbar-item">
            <img src="20240917_183326-removebg.png" alt="Brand logo" />
          </a>
          <div className="navbar-burger" data-target="navbar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="navbar-menu" id="navbar">
            <div className="navbar-start"></div>
            <Link to="/" className="narbar-item">
              Home
            </Link>
            <Link to="/tab1">Tab1</Link>
            <Link to="/about">About</Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
