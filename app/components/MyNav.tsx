import { Link } from "@remix-run/react";
import { useEffect } from "react";

export default function MyNav() {
  useEffect(() => {
    const $navbarBurgers = Array.from(
      document.querySelectorAll(".navbar-burger")
    );

    const $navbarMenu = document.getElementById("navbar");

    const handleBurgerClick = (el: HTMLElement) => () => {
      const target = el.getAttribute("data-target");
      const $target = document.getElementById(target || "");

      el.classList.toggle("is-active");
      $target?.classList.toggle("is-active");
    };

    const handleItemClick = () => {
      $navbarBurgers.forEach((burger) => burger.classList.remove("is-active"));
      $navbarMenu?.classList.remove("is-active");
    };

    const burgerListeners: { el: HTMLElement; handler: () => void }[] = [];

    $navbarBurgers.forEach((el) => {
      const handler = handleBurgerClick(el);
      el.addEventListener("click", handler);
      burgerListeners.push({ el, handler });
    });

    // Add listener for navbar-item clicks
    const $navbarItems = document.querySelectorAll(".navbar-item");
    $navbarItems.forEach((item) => {
      item.addEventListener("click", handleItemClick);
    });

    return () => {
      burgerListeners.forEach(({ el, handler }) => {
        el.removeEventListener("click", handler);
      });

      $navbarItems.forEach((item) => {
        item.removeEventListener("click", handleItemClick);
      });
    };
  }, []);

  return (
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
          <i className="fa-solid fa-heart" style={{ color: "tomato" }}>
            Home
          </i>
        </Link>
        <Link to="/tab1" className="navbar-item">
          Tab1
        </Link>
        <Link to="/tab2" className="navbar-item">
          Tab2
        </Link>
        <Link to="/tab3" className="navbar-item">
          Tab3
        </Link>
        <Link to="/tab4" className="navbar-item">
          Tab4
        </Link>
        <Link to="/tab5" className="navbar-item">
          Tab5
        </Link>
        <Link to="/tab6" className="navbar-item">
          Tab6
        </Link>
        <Link to="/tab7" className="navbar-item">
          Tab7
        </Link>
        <Link to="/tab8" className="navbar-item">
          Tab8
        </Link>
        <Link to="/tab9" className="navbar-item">
          Tab9
        </Link>
        <Link to="/about" className="navbar-item">
          <i className="fa-solid fa-heart" style={{ color: "tomato" }}>
            About
          </i>
        </Link>
        <div className="navbar-end"></div>
      </div>
    </nav>
  );
}
