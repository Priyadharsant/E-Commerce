import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config/api";
import { logError, userMessageFromError } from "../../utils/errorHandler";
import Header from "../Header";
import "./ApprovalPanel.css";

function ApprovalPanel() {
    const navigate = useNavigate();
    const [pendingProducts, setPendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(apiUrl("/addProduct/pending"), {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 401) {
                setError("Please login to access the approval panel");
                navigate("/login");
                return;
            }

            if (response.status === 403) {
                setError("Access denied. Only administrators can access this page.");
                setTimeout(() => navigate("/"), 2000);
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "Success" && Array.isArray(data.products)) {
                setPendingProducts(data.products);
            } else if (Array.isArray(data)) {
                setPendingProducts(data);
            }
        } catch (err) {
            logError("Failed to fetch pending products", err);
            setError(userMessageFromError(err) || "Failed to load pending products");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (productId) => {
        try {
            const response = await fetch(
                apiUrl(`/addProduct/approve/${productId}`),
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 401) {
                setError("Session expired. Please login again.");
                navigate("/login");
                return;
            }

            if (response.status === 403) {
                setError("You don't have permission to approve products.");
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Failed to approve product");
            }

            setSuccessMessage("Product approved successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);

            // Remove from list
            setPendingProducts(prev =>
                prev.filter(p => p._id !== productId)
            );
        } catch (err) {
            logError("Failed to approve product", err);
            setError(userMessageFromError(err) || "Failed to approve product");
        }
    };

    const handleRejectClick = (product) => {
        setSelectedProduct(product);
        setRejectingId(product._id);
        setShowRejectModal(true);
        setRejectReason("");
    };

    const submitReject = async () => {
        if (!rejectReason.trim()) {
            setError("Please provide a rejection reason");
            return;
        }

        try {
            const response = await fetch(
                apiUrl(`/addProduct/reject/${rejectingId}`),
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ reason: rejectReason })
                }
            );

            if (response.status === 401) {
                setError("Session expired. Please login again.");
                navigate("/login");
                return;
            }

            if (response.status === 403) {
                setError("You don't have permission to reject products.");
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Failed to reject product");
            }

            setSuccessMessage("Product rejected successfully!");
            setShowRejectModal(false);
            setTimeout(() => setSuccessMessage(""), 3000);

            // Remove from list
            setPendingProducts(prev =>
                prev.filter(p => p._id !== rejectingId)
            );
            setRejectingId(null);
            setSelectedProduct(null);
        } catch (err) {
            logError("Failed to reject product", err);
            setError(userMessageFromError(err) || "Failed to reject product");
        }
    };

    const cancelReject = () => {
        setShowRejectModal(false);
        setRejectingId(null);
        setSelectedProduct(null);
        setRejectReason("");
        setError("");
    };

    return (
        <>
            <Header />
            <div className="approval-panel-container">
                <div className="approval-panel-header">
                    <h1>Product Approval Panel</h1>
                    <p className="subtitle">Review and approve/reject pending products</p>
                </div>

                {error && (
                    <div className="error-banner">
                        {error}
                        <button onClick={() => setError("")}>&times;</button>
                    </div>
                )}

                {successMessage && (
                    <div className="success-banner">
                        ✓ {successMessage}
                    </div>
                )}

                {loading ? (
                    <div className="loading-container">
                        <div className="loader"></div>
                        <p>Loading pending products...</p>
                    </div>
                ) : pendingProducts.length === 0 ? (
                    <div className="empty-state">
                        <h2>No Pending Products</h2>
                        <p>All products have been reviewed!</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {pendingProducts.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="product-image">
                                    <img
                                        src={product.data?.image || product.image || "/img/placeholder.png"}
                                        alt={product.data?.title || product.title}
                                        onError={(e) => {
                                            e.target.src = "/img/placeholder.png";
                                        }}
                                    />
                                </div>

                                <div className="product-content">
                                    <h3>{product.data?.title || product.title}</h3>
                                    <p className="category">
                                        Category: <span>{product.data?.category || product.category}</span>
                                    </p>
                                    <p className="price">
                                        Price: <span>${product.data?.price || product.price}</span>
                                    </p>
                                    <p className="description">
                                        {product.data?.description || product.description}
                                    </p>
                                    {product.data?.off && (
                                        <p className="discount">
                                            Discount: <span>{product.data.off}%</span>
                                        </p>
                                    )}
                                </div>

                                <div className="product-actions">
                                    <button
                                        className="approve-btn"
                                        onClick={() => handleApprove(product._id)}
                                        title="Approve this product"
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        className="reject-btn"
                                        onClick={() => handleRejectClick(product)}
                                        title="Reject this product"
                                    >
                                        ✗ Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Reject Reason Modal */}
                {showRejectModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h2>Reject Product</h2>
                                <button
                                    className="close-btn"
                                    onClick={cancelReject}
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="modal-body">
                                <p className="product-name">
                                    <strong>Product:</strong> {selectedProduct?.data?.title || selectedProduct?.title}
                                </p>
                                <label htmlFor="reject-reason">Rejection Reason:</label>
                                <textarea
                                    id="reject-reason"
                                    value={rejectReason}
                                    onChange={(e) => {
                                        setRejectReason(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Please provide a detailed reason for rejection..."
                                    rows="6"
                                />
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="cancel-btn"
                                    onClick={cancelReject}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="confirm-reject-btn"
                                    onClick={submitReject}
                                >
                                    Reject Product
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ApprovalPanel;
