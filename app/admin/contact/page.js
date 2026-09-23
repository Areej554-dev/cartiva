"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// =========================================
// SVG ICONS
// =========================================

function MailIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function TrashIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function LoaderIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={`${className} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />

      <path
        d="M21 12a9 9 0 0 1-9 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// =========================================
// STATUS STYLES
// =========================================

function statusClasses(status) {
  if (status === "Replied") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "Read") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  return "bg-[#FFF1E8] text-[#C96C35] border-[#F3B183]/50";
}

// =========================================
// PAGE
// =========================================

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState("");

  // =========================================
  // FETCH
  // =========================================

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/contact", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load contact messages."
        );
      }

      setMessages(data.messages || []);
    } catch (error) {
      console.error("ADMIN CONTACT FETCH ERROR:", error);
      setError(
        error.message || "Failed to load contact messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // =========================================
  // UPDATE STATUS
  // =========================================

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const response = await fetch("/api/admin/contact", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update message."
        );
      }

      setMessages((current) =>
        current.map((message) =>
          message._id === id
            ? {
                ...message,
                status,
              }
            : message
        )
      );

      setSelectedMessage((current) =>
        current?._id === id
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (error) {
      console.error("ADMIN CONTACT UPDATE ERROR:", error);
      alert(
        error.message || "Failed to update message."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const deleteMessage = async (message) => {
    const confirmed = window.confirm(
      `Delete the message from "${message.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(message._id);

      const response = await fetch(
        `/api/admin/contact?id=${encodeURIComponent(
          message._id
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete message."
        );
      }

      setMessages((current) =>
        current.filter(
          (item) => item._id !== message._id
        )
      );

      if (selectedMessage?._id === message._id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("ADMIN CONTACT DELETE ERROR:", error);
      alert(
        error.message || "Failed to delete message."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // HELPERS
  // =========================================

  const newCount = messages.filter(
    (message) => message.status === "New"
  ).length;

  const readCount = messages.filter(
    (message) => message.status === "Read"
  ).length;

  const repliedCount = messages.filter(
    (message) => message.status === "Replied"
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString();
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="min-h-screen pt-16 bg-[#FFF9F5] px-4 py-8 text-[#2D2723] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C96C35] transition hover:text-[#E98B50]"
          >
            <ArrowLeftIcon />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E98B50]">
                Admin Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Contact Messages
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756C65] sm:text-base">
                View and manage messages submitted through the Cartiva
                contact form.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchMessages}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E9DED6] bg-white px-4 py-2.5 text-sm font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF1E8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <LoaderIcon />}
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Messages"
            value={messages.length}
            accent="orange"
          />

          <StatCard
            title="New"
            value={newCount}
            accent="orange"
          />

          <StatCard
            title="Read"
            value={readCount}
            accent="blue"
          />

          <StatCard
            title="Replied"
            value={repliedCount}
            accent="green"
          />

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* CONTENT */}
        <section className="overflow-hidden rounded-2xl border border-[#E9DED6] bg-white shadow-sm">

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#E9DED6] bg-[#FFF9F5] text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                    Subject
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#756C65]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-16 text-center text-sm text-[#756C65]"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <LoaderIcon />
                        Loading messages...
                      </div>
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-16 text-center"
                    >
                      <MailIcon className="mx-auto h-10 w-10 text-[#E98B50]" />

                      <h3 className="mt-4 font-semibold">
                        No contact messages
                      </h3>

                      <p className="mt-1 text-sm text-[#756C65]">
                        Messages submitted through the contact form will
                        appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr
                      key={message._id}
                      className="border-b border-[#E9DED6] last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {message.name}
                        </p>

                        <p className="mt-1 text-xs text-[#756C65]">
                          {message.email}
                        </p>
                      </td>

                      <td className="max-w-[260px] px-5 py-4">
                        <p className="truncate font-medium">
                          {message.subject}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-[#756C65]">
                        {formatDate(message.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={message.status || "New"}
                          onChange={(e) =>
                            updateStatus(
                              message._id,
                              e.target.value
                            )
                          }
                          disabled={updatingId === message._id}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${
                            statusClasses(
                              message.status
                            )
                          }`}
                        >
                          <option value="New">
                            New
                          </option>
                          <option value="Read">
                            Read
                          </option>
                          <option value="Replied">
                            Replied
                          </option>
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedMessage(message)
                            }
                            className="rounded-lg border border-[#E9DED6] px-3 py-2 text-xs font-semibold transition hover:border-[#E98B50] hover:bg-[#FFF1E8]"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteMessage(message)
                            }
                            disabled={
                              deletingId === message._id
                            }
                            className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                            aria-label={`Delete message from ${message.name}`}
                          >
                            {deletingId === message._id ? (
                              <LoaderIcon />
                            ) : (
                              <TrashIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="divide-y divide-[#E9DED6] md:hidden">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-[#756C65]">
                <LoaderIcon />
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <MailIcon className="mx-auto h-10 w-10 text-[#E98B50]" />

                <h3 className="mt-4 font-semibold">
                  No contact messages
                </h3>

                <p className="mt-1 text-sm text-[#756C65]">
                  No customer messages have been submitted yet.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {message.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#756C65]">
                        {message.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClasses(
                        message.status
                      )}`}
                    >
                      {message.status || "New"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold">
                      {message.subject}
                    </p>

                    <p className="mt-1 text-xs text-[#756C65]">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedMessage(message)
                      }
                      className="flex-1 rounded-xl border border-[#E9DED6] px-4 py-2.5 text-sm font-semibold transition hover:border-[#E98B50] hover:bg-[#FFF1E8]"
                    >
                      View Message
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteMessage(message)
                      }
                      disabled={
                        deletingId === message._id
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                      aria-label={`Delete message from ${message.name}`}
                    >
                      {deletingId === message._id ? (
                        <LoaderIcon />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3">
                    <select
                      value={message.status || "New"}
                      onChange={(e) =>
                        updateStatus(
                          message._id,
                          e.target.value
                        )
                      }
                      disabled={updatingId === message._id}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold outline-none ${statusClasses(
                        message.status
                      )}`}
                    >
                      <option value="New">
                        New
                      </option>

                      <option value="Read">
                        Read
                      </option>

                      <option value="Replied">
                        Replied
                      </option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* =========================================
          MESSAGE MODAL
      ========================================= */}

      {selectedMessage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E9DED6] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E9DED6] p-5 sm:p-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E98B50]">
                  Contact Message
                </p>

                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-2 text-[#756C65] transition hover:bg-[#FFF1E8] hover:text-[#C96C35]"
                aria-label="Close message"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 p-5 sm:p-6">

              {/* Customer */}
              <div className="rounded-xl bg-[#FFF9F5] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#756C65]">
                  From
                </p>

                <p className="mt-2 font-semibold">
                  {selectedMessage.name}
                </p>

                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="mt-1 block text-sm text-[#C96C35] hover:text-[#E98B50]"
                >
                  {selectedMessage.email}
                </a>
              </div>

              {/* Date */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#756C65]">
                  Submitted
                </p>

                <p className="mt-2 text-sm">
                  {formatDate(selectedMessage.createdAt)}
                </p>
              </div>

              {/* Message */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#756C65]">
                  Message
                </p>

                <div className="mt-2 whitespace-pre-wrap rounded-xl border border-[#E9DED6] bg-[#FFFDFC] p-4 text-sm leading-7 text-[#2D2723]">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#756C65]">
                  Status
                </p>

                <div className="flex flex-wrap gap-2">
                  {["New", "Read", "Replied"].map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={
                          updatingId ===
                          selectedMessage._id
                        }
                        onClick={() =>
                          updateStatus(
                            selectedMessage._id,
                            status
                          )
                        }
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                          selectedMessage.status ===
                          status
                            ? statusClasses(status)
                            : "border-[#E9DED6] text-[#756C65] hover:border-[#E98B50] hover:bg-[#FFF1E8]"
                        }`}
                      >
                        {selectedMessage.status ===
                          status && <CheckIcon />}

                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#E9DED6] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedMessage(null)
                  }
                  className="rounded-xl border border-[#E9DED6] px-5 py-3 text-sm font-semibold transition hover:bg-[#FFF9F5]"
                >
                  Close
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  onClick={() =>
                    updateStatus(
                      selectedMessage._id,
                      "Replied"
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#C96C35]"
                >
                  <MailIcon className="h-4 w-4" />
                  Reply by Email
                </a>

                <button
                  type="button"
                  onClick={() =>
                    deleteMessage(selectedMessage)
                  }
                  disabled={
                    deletingId ===
                    selectedMessage._id
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId ===
                  selectedMessage._id ? (
                    <LoaderIcon />
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}

                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// =========================================
// STAT CARD
// =========================================

function StatCard({
  title,
  value,
  accent,
}) {
  const accentClass =
    accent === "green"
      ? "bg-green-50 text-green-600"
      : accent === "blue"
      ? "bg-blue-50 text-blue-600"
      : "bg-[#FFF1E8] text-[#E98B50]";

  return (
    <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#756C65]">
          {title}
        </p>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentClass}`}
        >
          <MailIcon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}