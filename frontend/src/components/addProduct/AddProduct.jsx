import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS, apiUrl } from "../../config/api";
import { logError, userMessageFromError } from "../../utils/errorHandler";
import Header from "../Header";
import "./AddProduct.css";

function AddProduct() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        category: "",
        title: "",
        description: "",
        price: "",
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const categories = ['Electronics', 'Fashion', 'Fitness & Sports', 'Home & Kitchen', 'Toys & Accessories', 'Others'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const validateForm = () => {
        if (!formData.category.trim()) {
            setError("Please select a category");
            return false;
        }
        if (!formData.title.trim()) {
            setError("Please enter a product title");
            return false;
        }
        if (formData.title.trim().length < 3) {
            setError("Title must be at least 3 characters");
            return false;
        }
        if (!formData.description.trim()) {
            setError("Please enter a product description");
            return false;
        }
        if (formData.description.trim().length < 10) {
            setError("Description must be at least 10 characters");
            return false;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError("Please enter a valid price");
            return false;
        }
        if (!formData.image) {
            setError("Please upload a product image");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const form = new FormData();
            form.append("data", JSON.stringify({
                category: formData.category,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price)
            }));
            form.append("image", formData.image);

            const response = await fetch(apiUrl("/addProduct"), {
                method: "POST",
                credentials: "include",
                body: form
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Failed to add product");
            }

            setSuccess(true);
            setSuccessMessage(data.msg || "Product added successfully! Your product is pending approval.");

            // Reset form
            setFormData({
                category: "",
                title: "",
                description: "",
                price: "",
                image: null
            });
            setImagePreview(null);

            // Redirect to home after 2 seconds
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err) {
            logError(err, { source: "AddProduct:handleSubmit" });
            setError(userMessageFromError(err) || "Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <>
            <Header />
            <div className="add-product-container">
                <div className="add-product-wrapper">
                    <h1>Add New Product</h1>
                    <p className="subtitle">Fill in the details below to submit your product for approval</p>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{successMessage}</div>}

                    <form onSubmit={handleSubmit} className="add-product-form">
                        {/* Category */}
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="form-input select"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Title */}
                        <div className="form-group">
                            <label htmlFor="title">Product Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter product title"
                                className="form-input"
                                maxLength="100"
                            />
                            <small className="char-count">{formData.title.length}/100</small>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description">Product Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter a detailed product description"
                                className="form-input textarea"
                                rows="5"
                                maxLength="1000"
                            />
                            <small className="char-count">{formData.description.length}/1000</small>
                        </div>

                        {/* Price */}
                        <div className="form-group">
                            <label htmlFor="price">Price (₹) *</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Enter product price"
                                className="form-input"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="form-group">
                            <label>Product Image *</label>
                            <div
                                className="image-upload-area"
                                onClick={handleImageClick}
                            >
                                {imagePreview ? (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                        <p className="change-text">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        <p>Click to upload image</p>
                                        <small>Supported formats: JPG, PNG, WebP (Max 5MB)</small>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Product"}
                            </button>
                        </div>
                    </form>

                    <div className="info-box">
                        <h3>Important Information</h3>
                        <ul>
                            <li>Your product will be reviewed by our admin team</li>
                            <li>Once approved, it will be visible to all customers</li>
                            <li>You will receive an email notification upon approval or rejection</li>
                            <li>Make sure to provide accurate product details</li>
                            <li>Use clear, high-quality images for better visibility</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddProduct;
