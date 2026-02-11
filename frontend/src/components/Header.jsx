import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ENDPOINTS, apiUrl } from "../config/api";
import { fetchJson } from "../utils/api";
import { userMessageFromError, logError } from "../utils/errorHandler";
import useInView from "../hooks/useInView";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "./Authorization/auth";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useAuth();
    const [headerRef, headerInView] = useInView({ once: true, threshold: 0.05 });
    const [Categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState("");
    const navRef = useRef(null);
    const menuBtnRef = useRef(null);
    const filterRef = useRef(null);
    function Filter(category) {
        navigate(`/filter?filter=${encodeURIComponent(category)}`);
        setMenuOpen(false);
    }
    useEffect(() => {
        let mounted = true;
        (async function loadCategories() {
            setCategoriesLoading(true);
            setCategoriesError("");
            try {
                const data = await fetchJson(ENDPOINTS.CATEGORIES);
                if (mounted) setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                if (mounted) {
                    setCategories([]);
                    setCategoriesError(userMessageFromError(err));
                }
            } finally {
                if (mounted) setCategoriesLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);
    useEffect(() => {
        let mounted = true;
        (async function checkAuth() {
            try {
                const data = await fetchJson(ENDPOINTS.IS_AUTH);
                if (mounted && data?.user) {
                    setUser(data.user);
                }
            } catch (err) {
                // treat failures as not logged in
                logError(err, { source: "Header:isAuth" });
                if (mounted) setUser(null);
            }
        })();
        return () => { mounted = false; };
    }, [location.pathname, setUser]);
    useEffect(() => {
        function handleClickOutside(e) {
            // close hamburger menu
            if (
                menuOpen &&
                navRef.current &&
                !navRef.current.contains(e.target) &&
                !menuBtnRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }

            // close filter dropdown
            if (
                open &&
                filterRef.current &&
                !filterRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen, open]);
    useEffect(() => {
        function handleScroll() {
            if (menuOpen) setMenuOpen(false);
            if (open) setOpen(false);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [menuOpen, open]);

    const applyFilter = (key, value) => {
        const params = new URLSearchParams(location.search);

        if (!params.get("filter")) {
            params.set("filter", "all");
        }

        params.set(key, value);

        navigate(`/filter?${params.toString()}`);
        setOpen(false);
        setMenuOpen(false);
    };

    useEffect(() => {
        const mq = window.matchMedia("(min-width:601px)");
        const handler = (e) => {
            if (e.matches) setMenuOpen(false);
        };
        if (mq.addEventListener) mq.addEventListener("change", handler);
        else mq.addListener(handler);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", handler);
            else mq.removeListener(handler);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetchJson(ENDPOINTS.LOGOUT, { method: "POST" });
            setUser(null);
        } catch (err) {
            logError(err, { source: "Header:logout" });
        } finally {
            window.location.reload();
        }
    };
    return (
        <header ref={headerRef} className={`scroll-animate ${headerInView ? "in-view" : ""}`}>
            <div className="header">
                <div className="header-logo">
                    <span className="material-symbols-outlined">
                        shopping_cart
                    </span>
                    <h1>Fakekart</h1>
                </div>
                {/* <div className="searchCon">
                    <span className="material-symbols-outlined searchIcon">
                        search
                    </span>
                    <input type="text" name="searchInp" className="searchInp" placeholder="Search" id="Searh-
                    " />
                </div> */}
                <div >
                    <div ref={menuBtnRef} className={`hamburger_menu ${menuOpen ? "active" : ""}`} id="hamburger_menu" onClick={() => setMenuOpen(!menuOpen)}>
                        <div className="line line1"></div>
                        <div className="line line2"></div>
                        <div className="line line3"></div>
                    </div>
                    <nav ref={navRef} className={menuOpen ? "open" : "close"}>
                        <Link to="/" className={location.pathname === "/" ? "show" : ""} onClick={() => setMenuOpen(false)}>
                            <div>
                                <span className="material-symbols-outlined">home</span>
                                <p>Home</p>
                            </div>
                        </Link>

                        <Link to="/cart" className={location.pathname === "/cart" ? "show" : ""} onClick={() => setMenuOpen(false)}>
                            <div>
                                <span className="material-symbols-outlined">shopping_cart</span>
                                <p>Cart</p>
                            </div>
                        </Link>

                        {(
                            <Link to="/add-product" className={location.pathname === "/add-product" ? "show" : ""} onClick={() => setMenuOpen(false)}>
                                <div>
                                    <span className="material-symbols-outlined">add_circle</span>
                                    <p>Add Product</p>
                                </div>
                            </Link>
                        )}

                        {user && user?.role === 'admin' && (
                            <Link to="/approval-panel" className={location.pathname === "/approval-panel" ? "show" : ""} onClick={() => setMenuOpen(false)}>
                                <div>
                                    <span className="material-symbols-outlined">verified_user</span>
                                    <p>Approvals</p>
                                </div>
                            </Link>
                        )}

                        {user ? (

                            <Link to="/"
                                onClick={() => { handleLogout(); setMenuOpen(false); }} className={location.pathname === "/login" ? "show" : ""}>
                                <div>  <span className="material-symbols-outlined">logout</span>
                                    <p>Logout</p></div>
                            </Link>
                        ) : (
                            <Link to="/login" className={location.pathname === "/login" ? "show" : ""} onClick={() => setMenuOpen(false)}>
                                <div>  <span className="material-symbols-outlined">login</span>
                                    <p>Login</p></div>
                            </Link>
                        )}
                    </nav>
                </div>

            </div>

            {["/", "/filter"].includes(location.pathname) && (
                <div className="filterCon">
                    <div className="filter">
                        <button
                            className="filterBtn"
                            onClick={() => setOpen(!open)}
                        >
                            <span className="material-symbols-outlined filterIcon">
                                instant_mix
                            </span>
                            Filter
                        </button>

                        <ul className={`filterOptions ${open ? "show" : "hide"}`}>

                            <li className="filterOption">
                                <span className="filterTitle">Price</span>
                                <ul className="optionCategory">
                                    <li className="optionItem" onClick={() => applyFilter("price", "asc")}>
                                        Low to High
                                    </li>
                                    <li className="optionItem" onClick={() => applyFilter("price", "desc")}>
                                        High to Low
                                    </li>
                                </ul>
                            </li>

                            <li className="filterOption">
                                <span className="filterTitle">Rating</span>
                                <ul className="optionCategory">
                                    <li className="optionItem" onClick={() => applyFilter("rating", "4")}>
                                        4★ & above
                                    </li>
                                    <li className="optionItem" onClick={() => applyFilter("rating", "3")}>
                                        3★ & above
                                    </li>
                                </ul>
                            </li>

                            <li className="filterOption">
                                <span className="filterTitle">Discount</span>
                                <ul className="optionCategory">
                                    <li className="optionItem" onClick={() => applyFilter("discount", "10")}>
                                        10% & above
                                    </li>
                                    <li className="optionItem" onClick={() => applyFilter("discount", "30")}>
                                        30% & above
                                    </li>
                                </ul>
                            </li>

                        </ul>

                    </div>
                    <div className="categoriesCon">
                        <button onClick={() => Filter("all")}>All</button>
                        {categoriesLoading && <LoadingSpinner size="sm" />}
                        {categoriesError && <p className="error">{categoriesError}</p>}
                        {!categoriesLoading && !categoriesError && Categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => Filter(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;

