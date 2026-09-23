"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updatingUser, setUpdatingUser] = useState(null);

    // -----------------------------------------
    // FETCH USERS
    // -----------------------------------------

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/admin/users", {
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load users."
                );
            }

            setUsers(data.users || []);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // -----------------------------------------
    // SEARCH USERS
    // -----------------------------------------

    const filteredUsers = users.filter((user) => {
        const searchText = search.toLowerCase().trim();

        if (!searchText) return true;

        return (
            user.name
                ?.toLowerCase()
                .includes(searchText) ||
            user.email
                ?.toLowerCase()
                .includes(searchText)
        );
    });

    // -----------------------------------------
    // TOGGLE ACCOUNT STATUS
    // -----------------------------------------

    const toggleAccountStatus = async (user) => {
        const currentStatus = user.isActive !== false;
        const newStatus = !currentStatus;

        const action = newStatus
            ? "activate"
            : "deactivate";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} "${user.name}"'s account?`
        );

        if (!confirmed) return;

        try {
            setUpdatingUser(user._id);

            const response = await fetch(
                `/api/admin/users/${user._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        isActive: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to update account status."
                );
            }

            setUsers((currentUsers) =>
                currentUsers.map((currentUser) =>
                    currentUser._id === user._id
                        ? {
                              ...currentUser,
                              isActive: newStatus,
                          }
                        : currentUser
                )
            );

            alert(
                newStatus
                    ? "Account activated successfully!"
                    : "Account deactivated successfully!"
            );
        } catch (error) {
            alert(error.message);
        } finally {
            setUpdatingUser(null);
        }
    };

    // -----------------------------------------
    // STATISTICS
    // -----------------------------------------

    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) => user.isActive !== false
    ).length;

    const deactivatedUsers = users.filter(
        (user) => user.isActive === false
    ).length;

    const adminUsers = users.filter(
        (user) => user.isAdmin
    ).length;

    // -----------------------------------------
    // PAGE
    // -----------------------------------------

    return (
        <main className="min-h-[80vh] bg-[#FFF9F5] text-[#2D2723]">

            <div className="mx-auto w-full max-w-[1500px]">

                {/* =========================================
                    HEADER
                ========================================== */}

                <div className="mb-10">

                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E98B50]">
                        Admin Dashboard
                    </p>

                    <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                Customer Management
                            </h1>

                            <p className="mt-3 text-base text-[#756C65] sm:text-lg">
                                View and manage registered Cartiva users.
                            </p>

                        </div>

                        <Link
                            href="/admin"
                            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E9DED6] bg-white px-5 py-3 font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:text-[#C96C35]"
                        >

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.8"
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 6.75 4.5 12l6 5.25M19.5 12h-15"
                                />
                            </svg>

                            Dashboard

                        </Link>

                    </div>

                </div>

                {/* =========================================
                    STAT CARDS
                ========================================== */}

                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {/* Total */}
                    <div className="rounded-2xl border border-[#E9DED6] bg-white p-6 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-[#756C65]">
                                    Total Customers
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {totalUsers}
                                </p>

                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#E98B50]">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.8"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 8.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                                    />
                                </svg>

                            </div>

                        </div>

                    </div>

                    {/* Active */}
                    <div className="rounded-2xl border border-[#E9DED6] bg-white p-6 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-[#756C65]">
                                    Active
                                </p>

                                <p className="mt-2 text-3xl font-bold text-[#2F7D4A]">
                                    {activeUsers}
                                </p>

                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF7EF] text-[#2F7D4A]">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.8"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m5.25 12 4.5 4.5L18.75 7.5"
                                    />
                                </svg>

                            </div>

                        </div>

                    </div>

                    {/* Deactivated */}
                    <div className="rounded-2xl border border-[#E9DED6] bg-white p-6 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-[#756C65]">
                                    Deactivated
                                </p>

                                <p className="mt-2 text-3xl font-bold text-[#B42318]">
                                    {deactivatedUsers}
                                </p>

                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FCECEC] text-[#B42318]">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.8"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9.75v4.5m0 3h.008M10.29 3.86 2.82 17.2a1.5 1.5 0 0 0 1.31 2.25h15.74a1.5 1.5 0 0 0 1.31-2.25L13.71 3.86a1.5 1.5 0 0 0-2.62 0Z"
                                    />
                                </svg>

                            </div>

                        </div>

                    </div>

                    {/* Admins */}
                    <div className="rounded-2xl border border-[#E9DED6] bg-white p-6 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-[#756C65]">
                                    Admin Accounts
                                </p>

                                <p className="mt-2 text-3xl font-bold text-[#C96C35]">
                                    {adminUsers}
                                </p>

                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#C96C35]">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.8"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3 5.25 6v5.25c0 4.2 2.75 7.65 6.75 9.75 4-2.1 6.75-5.55 6.75-9.75V6L12 3Zm0 5.25v6m3-3h-6"
                                    />
                                </svg>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =========================================
                    SEARCH
                ========================================== */}

                <section className="mb-8 rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-3">

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E98B50]">
                            Customers
                        </p>

                        <h2 className="mt-1 text-xl font-bold">
                            Search Customers
                        </h2>

                    </div>

                    <div className="relative">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.8"
                            stroke="currentColor"
                            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#756C65]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-4.5-4.5m2.25-5.25a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                            />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by name or email..."
                            className="w-full rounded-xl border border-[#E9DED6] bg-white py-3.5 pl-12 pr-4 text-[#2D2723] outline-none transition placeholder:text-[#A49A93] focus:border-[#E98B50] focus:ring-2 focus:ring-[#E98B50]/20"
                        />

                    </div>

                </section>

                {/* =========================================
                    SUMMARY
                ========================================== */}

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-[#756C65]">

                        Showing{" "}

                        <span className="font-bold text-[#2D2723]">
                            {filteredUsers.length}
                        </span>

                        {" "}of{" "}

                        <span className="font-bold text-[#2D2723]">
                            {users.length}
                        </span>

                        {" "}users

                    </p>

                    {search.trim() && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="w-fit text-sm font-semibold text-[#C96C35] hover:text-[#E98B50]"
                        >
                            Clear search
                        </button>
                    )}

                </div>

                {/* =========================================
                    LOADING
                ========================================== */}

                {loading ? (

                    <div className="grid grid-cols-1 gap-5">

                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-24 animate-pulse rounded-2xl border border-[#E9DED6] bg-white"
                            />
                        ))}

                    </div>

                ) : filteredUsers.length === 0 ? (

                    /* =====================================
                       NO RESULTS
                    ====================================== */

                    <div className="rounded-2xl border border-[#E9DED6] bg-white p-12 text-center shadow-sm">

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
                                    d="m21 21-4.5-4.5m2.25-5.25a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                                />
                            </svg>

                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            No Customers Found
                        </h2>

                        <p className="mt-2 text-[#756C65]">
                            Try a different name or email address.
                        </p>

                    </div>

                ) : (

                    /* =====================================
                       USERS
                    ====================================== */

                    <div className="overflow-hidden rounded-2xl border border-[#E9DED6] bg-white shadow-sm">

                        {/* =================================
                            DESKTOP TABLE
                        ================================== */}

                        <div className="hidden overflow-x-auto lg:block">

                            <table className="w-full">

                                <thead>

                                    <tr className="border-b border-[#E9DED6] bg-[#FFF9F5] text-left">

                                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                                            Customer
                                        </th>

                                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                                            Contact
                                        </th>

                                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                                            Location
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#756C65]">
                                            Orders
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#756C65]">
                                            Role
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#756C65]">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                                            Joined
                                        </th>

                                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredUsers.map((user) => {

                                        const isActive =
                                            user.isActive !== false;

                                        const isCurrentAdmin =
                                            user.isAdmin;

                                        return (
                                            <tr
                                                key={user._id}
                                                className="border-b border-[#E9DED6] last:border-b-0 hover:bg-[#FFF9F5] transition"
                                            >

                                                {/* CUSTOMER */}

                                                <td className="px-5 py-5">

                                                    <p className="font-bold text-[#2D2723]">
                                                        {user.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-[#756C65]">
                                                        ID:{" "}
                                                        {String(
                                                            user._id
                                                        ).slice(-8)}
                                                    </p>

                                                </td>

                                                {/* CONTACT */}

                                                <td className="px-5 py-5">

                                                    <p className="break-all text-sm font-medium">
                                                        {user.email}
                                                    </p>

                                                    {user.phone ? (

                                                        <p className="mt-1 text-sm text-[#756C65]">
                                                            {user.phone}
                                                        </p>

                                                    ) : (

                                                        <p className="mt-1 text-sm text-[#A49A93]">
                                                            No phone
                                                        </p>

                                                    )}

                                                </td>

                                                {/* LOCATION */}

                                                <td className="px-5 py-5">

                                                    {user.city ? (

                                                        <div>

                                                            <p className="font-medium">
                                                                {user.city}
                                                            </p>

                                                            {user.postalCode && (
                                                                <p className="mt-1 text-sm text-[#756C65]">
                                                                    {user.postalCode}
                                                                </p>
                                                            )}

                                                        </div>

                                                    ) : (

                                                        <span className="text-sm text-[#A49A93]">
                                                            Not provided
                                                        </span>

                                                    )}

                                                </td>

                                                {/* ORDERS */}

                                                <td className="px-5 py-5 text-center">

                                                    <span className="inline-flex min-w-10 items-center justify-center rounded-full border border-[#E9DED6] bg-[#FFF9F5] px-3 py-1 font-semibold">
                                                        {user.orderCount || 0}
                                                    </span>

                                                </td>

                                                {/* ROLE */}

                                                <td className="px-5 py-5 text-center">

                                                    <span
                                                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                                                            user.isAdmin
                                                                ? "bg-[#FFF0E7] text-[#C96C35]"
                                                                : "bg-[#F3EFEC] text-[#756C65]"
                                                        }`}
                                                    >
                                                        {user.isAdmin
                                                            ? "Admin"
                                                            : "Customer"}
                                                    </span>

                                                </td>

                                                {/* STATUS */}

                                                <td className="px-5 py-5 text-center">

                                                    <span
                                                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                                                            isActive
                                                                ? "bg-[#EAF7EF] text-[#2F7D4A]"
                                                                : "bg-[#FCECEC] text-[#B42318]"
                                                        }`}
                                                    >
                                                        {isActive
                                                            ? "Active"
                                                            : "Deactivated"}
                                                    </span>

                                                </td>

                                                {/* JOINED */}

                                                <td className="px-5 py-5 text-sm text-[#756C65]">

                                                    {user.createdAt
                                                        ? new Date(
                                                              user.createdAt
                                                          ).toLocaleDateString()
                                                        : "—"}

                                                </td>

                                                {/* ACTIONS */}

                                                <td className="px-5 py-5">

                                                    <div className="flex flex-wrap gap-2">

                                                        <Link
                                                            href={`/admin/users/${user._id}`}
                                                            className="rounded-xl border border-[#E9DED6] bg-white px-4 py-2 text-sm font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:text-[#C96C35]"
                                                        >
                                                            View
                                                        </Link>

                                                        {!isCurrentAdmin && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleAccountStatus(
                                                                        user
                                                                    )
                                                                }
                                                                disabled={
                                                                    updatingUser ===
                                                                    user._id
                                                                }
                                                                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                                    isActive
                                                                        ? "bg-[#B42318] hover:bg-[#991B1B]"
                                                                        : "bg-[#2F7D4A] hover:bg-[#25663C]"
                                                                }`}
                                                            >
                                                                {updatingUser ===
                                                                user._id
                                                                    ? "Updating..."
                                                                    : isActive
                                                                    ? "Deactivate"
                                                                    : "Activate"}
                                                            </button>
                                                        )}

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>

                        {/* =================================
                            MOBILE CARDS
                        ================================== */}

                        <div className="divide-y divide-[#E9DED6] lg:hidden">

                            {filteredUsers.map((user) => {

                                const isActive =
                                    user.isActive !== false;

                                const isCurrentAdmin =
                                    user.isAdmin;

                                return (

                                    <div
                                        key={user._id}
                                        className="p-5 sm:p-6"
                                    >

                                        {/* HEADER */}

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="min-w-0">

                                                <h3 className="truncate text-lg font-bold">
                                                    {user.name}
                                                </h3>

                                                <p className="mt-1 break-all text-sm text-[#756C65]">
                                                    {user.email}
                                                </p>

                                            </div>

                                            <div className="flex shrink-0 flex-col items-end gap-2">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                        user.isAdmin
                                                            ? "bg-[#FFF0E7] text-[#C96C35]"
                                                            : "bg-[#F3EFEC] text-[#756C65]"
                                                    }`}
                                                >
                                                    {user.isAdmin
                                                        ? "Admin"
                                                        : "Customer"}
                                                </span>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                        isActive
                                                            ? "bg-[#EAF7EF] text-[#2F7D4A]"
                                                            : "bg-[#FCECEC] text-[#B42318]"
                                                    }`}
                                                >
                                                    {isActive
                                                        ? "Active"
                                                        : "Deactivated"}
                                                </span>

                                            </div>

                                        </div>

                                        {/* DETAILS */}

                                        <div className="mt-6 grid grid-cols-2 gap-4">

                                            <div>

                                                <p className="text-xs font-semibold uppercase tracking-wide text-[#756C65]">
                                                    Phone
                                                </p>

                                                <p className="mt-1 text-sm font-medium">
                                                    {user.phone ||
                                                        "Not provided"}
                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-xs font-semibold uppercase tracking-wide text-[#756C65]">
                                                    Orders
                                                </p>

                                                <p className="mt-1 text-sm font-medium">
                                                    {user.orderCount || 0}
                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-xs font-semibold uppercase tracking-wide text-[#756C65]">
                                                    City
                                                </p>

                                                <p className="mt-1 text-sm font-medium">
                                                    {user.city ||
                                                        "Not provided"}
                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-xs font-semibold uppercase tracking-wide text-[#756C65]">
                                                    Joined
                                                </p>

                                                <p className="mt-1 text-sm font-medium">
                                                    {user.createdAt
                                                        ? new Date(
                                                              user.createdAt
                                                          ).toLocaleDateString()
                                                        : "—"}
                                                </p>

                                            </div>

                                        </div>

                                        {/* ACTIONS */}

                                        <div className="mt-6 flex flex-wrap gap-3">

                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="rounded-xl border border-[#E9DED6] bg-white px-4 py-2.5 text-sm font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:text-[#C96C35]"
                                            >
                                                View Customer
                                            </Link>

                                            {!isCurrentAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleAccountStatus(
                                                            user
                                                        )
                                                    }
                                                    disabled={
                                                        updatingUser ===
                                                        user._id
                                                    }
                                                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                        isActive
                                                            ? "bg-[#B42318] hover:bg-[#991B1B]"
                                                            : "bg-[#2F7D4A] hover:bg-[#25663C]"
                                                    }`}
                                                >
                                                    {updatingUser ===
                                                    user._id
                                                        ? "Updating..."
                                                        : isActive
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>
                                            )}

                                        </div>

                                    </div>

                                );
                            })}

                        </div>

                    </div>

                )}

            </div>

        </main>
    );
}