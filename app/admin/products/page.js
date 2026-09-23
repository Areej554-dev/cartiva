"use client";

import { useEffect, useState } from "react";

export default function AdminProductsPage() {
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const [editingProduct, setEditingProduct] = useState(null);

    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        image: "",
        description: "",
        stock: "",
    });

    const categories = [
        "Clothing",
        "Shoes",
        "Bags",
        "Watches",
        "Accessories",
        "Beauty",
    ];

    /* =========================================================
       IMAGE UPLOAD
    ========================================================= */

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            setUploadingImage(true);

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to upload image."
                );
            }

            setForm((current) => ({
                ...current,
                image: data.imageUrl,
            }));

            setImagePreview(data.imageUrl);
        } catch (error) {
            alert(error.message);
        } finally {
            setUploadingImage(false);
        }
    };

    /* =========================================================
       FETCH PRODUCTS
    ========================================================= */

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/admin/products", {
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load products."
                );
            }

            setProducts(data.products || []);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    /* =========================================================
       HANDLE INPUT
    ========================================================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    /* =========================================================
       ADD PRODUCT
    ========================================================= */

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (
            !form.name.trim() ||
            !form.category ||
            form.price === ""
        ) {
            alert(
                "Please enter product name, category and price."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await fetch("/api/admin/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    category: form.category,
                    price: Number(form.price),
                    image: form.image.trim(),
                    description: form.description.trim(),
                    stock:
                        form.stock === ""
                            ? 0
                            : Number(form.stock),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create product."
                );
            }

            alert("Product added successfully!");

            resetForm();
            fetchProducts();
        } catch (error) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       START EDITING
    ========================================================= */

    const startEditing = (product) => {
        setEditingProduct(product);
        setImagePreview(product.image || "");

        setForm({
            name: product.name || "",
            category: product.category || "",
            price: product.price ?? "",
            image: product.image || "",
            description: product.description || "",
            stock: product.stock ?? 0,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* =========================================================
       UPDATE PRODUCT
    ========================================================= */

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        if (!editingProduct) return;

        if (
            !form.name.trim() ||
            !form.category ||
            form.price === ""
        ) {
            alert(
                "Please enter product name, category and price."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(
                `/api/admin/products/${editingProduct._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        category: form.category,
                        price: Number(form.price),
                        image: form.image.trim(),
                        description: form.description.trim(),
                        stock:
                            form.stock === ""
                                ? 0
                                : Number(form.stock),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update product."
                );
            }

            alert("Product updated successfully!");

            setEditingProduct(null);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       DELETE PRODUCT
    ========================================================= */

    const handleDeleteProduct = async (product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeleting(product._id);

            const response = await fetch(
                `/api/admin/products/${product._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete product."
                );
            }

            alert("Product deleted successfully!");

            if (
                editingProduct &&
                editingProduct._id === product._id
            ) {
                setEditingProduct(null);
                resetForm();
            }

            fetchProducts();
        } catch (error) {
            alert(error.message);
        } finally {
            setDeleting(null);
        }
    };

    /* =========================================================
       RESET FORM
    ========================================================= */

    const resetForm = () => {
        setForm({
            name: "",
            category: "",
            price: "",
            image: "",
            description: "",
            stock: "",
        });

        setEditingProduct(null);
        setImagePreview("");
    };

    /* =========================================================
       PAGE
    ========================================================= */

    return (
        <main className="min-h-[80vh] bg-[#FFF9F5] text-[#2D2723]">

            <div className="mx-auto w-full max-w-[1500px]">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-10">

                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E98B50]">
                        Admin Dashboard
                    </p>

                    <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                Product Management
                            </h1>

                            <p className="mt-3 text-base text-[#756C65] sm:text-lg">
                                Add, edit and manage products in your Cartiva store.
                            </p>

                        </div>

                        <div className="rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-sm text-[#756C65]">
                            {products.length} product
                            {products.length !== 1 ? "s" : ""}
                        </div>

                    </div>

                </div>

                {/* =================================================
                    PRODUCT FORM
                ================================================= */}

                <section className="mb-12 rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6 md:p-8">

                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E98B50]">
                                Product
                            </p>

                            <h2 className="mt-1 text-2xl font-bold">
                                {editingProduct
                                    ? "Edit Product"
                                    : "Add New Product"}
                            </h2>

                        </div>

                        {editingProduct && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-fit rounded-xl border border-[#E9DED6] bg-white px-5 py-2.5 font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:text-[#C96C35]"
                            >
                                Cancel Edit
                            </button>
                        )}

                    </div>

                    <form
                        onSubmit={
                            editingProduct
                                ? handleUpdateProduct
                                : handleAddProduct
                        }
                        className="grid grid-cols-1 gap-6 md:grid-cols-2"
                    >

                        {/* NAME */}
                        <div>

                            <label className="mb-2 block text-sm font-semibold">
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nike Air Max"
                                className="w-full rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-[#2D2723] outline-none transition placeholder:text-[#A49A93] focus:border-[#E98B50] focus:ring-2 focus:ring-[#E98B50]/20"
                            />

                        </div>

                        {/* CATEGORY */}
                        <div>

                            <label className="mb-2 block text-sm font-semibold">
                                Category
                            </label>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-[#2D2723] outline-none transition focus:border-[#E98B50] focus:ring-2 focus:ring-[#E98B50]/20"
                            >

                                <option value="">
                                    Select category
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* PRICE */}
                        <div>

                            <label className="mb-2 block text-sm font-semibold">
                                Price
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#756C65]">
                                    $
                                </span>

                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="120"
                                    min="0"
                                    step="0.01"
                                    className="w-full rounded-xl border border-[#E9DED6] bg-white py-3 pl-9 pr-4 text-[#2D2723] outline-none transition placeholder:text-[#A49A93] focus:border-[#E98B50] focus:ring-2 focus:ring-[#E98B50]/20"
                                />

                            </div>

                        </div>

                        {/* STOCK */}
                        <div>

                            <label className="mb-2 block text-sm font-semibold">
                                Stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                placeholder="20"
                                min="0"
                                step="1"
                                className="w-full rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-[#2D2723] outline-none transition placeholder:text-[#A49A93] focus:border-[#E98B50] focus:ring-2 focus:ring-[#E98B50]/20"
                            />

                        </div>

                        {/* IMAGE */}
                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-semibold">
                                Product Image
                            </label>

                            <div className="rounded-xl border border-dashed border-[#E9DED6] bg-[#FFF9F5] p-5">

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                    className="block w-full rounded-lg border border-[#E9DED6] bg-white px-3 py-3 text-sm text-[#756C65] file:mr-4 file:rounded-lg file:border-0 file:bg-[#E98B50] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#C96C35]"
                                />

                                <p className="mt-3 text-sm text-[#756C65]">
                                    JPG, JPEG, PNG or WEBP • Maximum 5MB
                                </p>

                                {uploadingImage && (
                                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#C96C35]">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E9DED6] border-t-[#E98B50]" />
                                        Uploading image...
                                    </div>
                                )}

                                {imagePreview && (
                                    <div className="mt-5 w-fit rounded-xl border border-[#E9DED6] bg-white p-4">

                                        <p className="mb-3 text-sm font-semibold">
                                            Image Preview
                                        </p>

                                        <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl bg-[#FFF9F5]">

                                            <img
                                                src={imagePreview}
                                                alt="Product preview"
                                                className="h-full w-full object-contain"
                                            />

                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>

                        {/* DESCRIPTION */}
                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-semibold">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the product..."
                                rows="4"
                                className="w-full resize-none rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-[#2D2723] outline-none transition placeholder:text-[#A49A93] focus:border-[#E98B50] focus:ring-2 focus:ring-[#E98B50]/20"
                            />

                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">

                            <button
                                type="submit"
                                disabled={saving || uploadingImage}
                                className="inline-flex items-center justify-center rounded-xl bg-[#E98B50] px-8 py-3 font-semibold text-white transition hover:bg-[#C96C35] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? editingProduct
                                        ? "Updating..."
                                        : "Adding..."
                                    : editingProduct
                                        ? "Update Product"
                                        : "Add Product"}
                            </button>

                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-[#E9DED6] bg-white px-8 py-3 font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:text-[#C96C35]"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </section>

                {/* =================================================
                    EXISTING PRODUCTS
                ================================================= */}

                <section>

                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E98B50]">
                                Catalog
                            </p>

                            <h2 className="mt-1 text-2xl font-bold">
                                Existing Products
                            </h2>

                        </div>

                        <span className="text-sm text-[#756C65]">
                            {products.length} products
                        </span>

                    </div>

                    {loading ? (

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-[430px] animate-pulse rounded-2xl border border-[#E9DED6] bg-white"
                                />
                            ))}

                        </div>

                    ) : products.length === 0 ? (

                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-12 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#E98B50]">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.8"
                                    stroke="currentColor"
                                    className="h-8 w-8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m7.5 4.5 4.5-2 4.5 2m-9 0v5l4.5 2 4.5-2v-5M5.25 9.75 3 11v8l9 3 9-3v-8l-2.25-1.25M12 12v10"
                                    />
                                </svg>

                            </div>

                            <h3 className="mt-5 text-xl font-bold">
                                No Products Found
                            </h3>

                            <p className="mt-2 text-[#756C65]">
                                Add your first product using the form above.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                            {products.map((product) => (

                                <div
                                    key={product._id}
                                    className="overflow-hidden rounded-2xl border border-[#E9DED6] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >

                                    {/* IMAGE */}

                                    <div className="relative flex h-60 items-center justify-center bg-[#FFF9F5] border-b border-[#E9DED6]">

                                        {product.image ? (

                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-contain p-5"
                                            />

                                        ) : (

                                            <div className="flex flex-col items-center justify-center text-[#756C65]">

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.6"
                                                    stroke="currentColor"
                                                    className="h-10 w-10"
                                                >
                                                    <rect
                                                        width="18"
                                                        height="18"
                                                        x="3"
                                                        y="3"
                                                        rx="2"
                                                    />
                                                    <path
                                                        d="m3 15 4-4a2 2 0 0 1 3 0l2 2 2-2a2 2 0 0 1 3 0l4 4"
                                                    />
                                                </svg>

                                                <p className="mt-2 text-sm">
                                                    No image
                                                </p>

                                            </div>

                                        )}

                                        {/* CATEGORY BADGE */}

                                        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#C96C35] shadow-sm border border-[#E9DED6]">
                                            {product.category}
                                        </span>

                                    </div>

                                    {/* DETAILS */}

                                    <div className="p-5">

                                        <h3 className="text-lg font-bold">
                                            {product.name}
                                        </h3>

                                        <p className="mt-2 text-xl font-bold text-[#C96C35]">
                                            ${Number(product.price).toFixed(2)}
                                        </p>

                                        <div className="mt-3 flex items-center justify-between">

                                            <span className="text-sm text-[#756C65]">
                                                Stock
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                    Number(
                                                        product.stock ?? 0
                                                    ) > 0
                                                        ? "bg-[#EAF7EF] text-[#2F7D4A]"
                                                        : "bg-[#FCECEC] text-[#B42318]"
                                                }`}
                                            >
                                                {product.stock ?? 0}
                                            </span>

                                        </div>

                                        {product.description && (
                                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#756C65]">
                                                {product.description}
                                            </p>
                                        )}

                                        {/* ACTIONS */}

                                        <div className="mt-5 flex gap-3">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    startEditing(product)
                                                }
                                                className="flex-1 rounded-xl border border-[#E9DED6] bg-white px-4 py-2.5 font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:text-[#C96C35]"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteProduct(product)
                                                }
                                                disabled={
                                                    deleting === product._id
                                                }
                                                className="flex-1 rounded-xl bg-[#B42318] px-4 py-2.5 font-semibold text-white transition hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deleting === product._id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}