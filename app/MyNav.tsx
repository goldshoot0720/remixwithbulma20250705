import { Link } from "@remix-run/react";
import { useEffect } from "react";

export default function MyNav() {
  useEffect(() => {
    const $navbarBurgers = Array.from(
      document.querySelectorAll(".navbar-burger")
    );

    const handleClick = (el: HTMLElement) => () => {
      const target = el.getAttribute("data-target");
      const $target = document.getElementById(target || "");

      el.classList.toggle("is-active");
      $target?.classList.toggle("is-active");
    };

    const listeners: { el: HTMLElement; handler: () => void }[] = [];

    $navbarBurgers.forEach((el) => {
      const handler = handleClick(el);
      el.addEventListener("click", handler);
      listeners.push({ el, handler });
    });

    return () => {
      listeners.forEach(({ el, handler }) => {
        el.removeEventListener("click", handler);
      });
    };
  }, []);
  return (
    <>
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="Navigation"
      >
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <img src="/20240917_183326-removebg.png" alt="Brand logo" />
            草包鋒兄
          </Link>
          <div className="navbar-burger" data-target="navbar">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="navbar-menu" id="navbar">
          <div className="navbar-start"></div>
          <Link to="/" className="navbar-item">
            Home
          </Link>
          <Link to="/tab1" className="navbar-item">
            Tab1
          </Link>
          <Link to="/about" className="navbar-item">
            About
          </Link>
          <div className="navbar-end"></div>
        </div>
      </nav>
    </>
  );
}
