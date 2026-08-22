"use client";

import React, { useEffect, useState } from "react";
import {
  FolderTree,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Hash,
  Loader2,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Notifications / Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Confirm delete dialog state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to create category");
        return;
      }

      setSuccessMessage(`Category "${data.category.name}" created successfully!`);
      setNewCategoryName("");
      await fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingId(categoryToDelete._id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/categories/${categoryToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Plainly display backend error (e.g. courses still reference it)
        setErrorMessage(data.message || "Failed to delete category");
        setCategoryToDelete(null);
        return;
      }

      setSuccessMessage(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider mb-1">
          <FolderTree className="w-3.5 h-3.5" />
          Category Management
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Course Categories
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Organize courses into structured topics and disciplines.
        </p>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-tint border border-red/30 text-red flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-green-tint border border-green/30 text-green flex items-start gap-3 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Create Form & Categories Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="card-surface p-6">
          <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Add New Category
          </h2>
          <p className="text-xs text-muted mb-4">
            Category slug will be generated automatically on submission.
          </p>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label
                htmlFor="categoryName"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Category Name <span className="text-red">*</span>
              </label>
              <input
                id="categoryName"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Cloud Computing"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !newCategoryName.trim()}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-gold" />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Categories Table Column */}
        <div className="lg:col-span-2 card-surface overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Existing Categories
              </h2>
              <p className="text-xs text-muted">
                {categories.length} total active categories
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Loading categories...</span>
                      </div>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      No categories found. Create your first category using the form.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-primary-tint/20 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {cat.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted bg-surface px-2 py-0.5 rounded border border-border">
                          <Hash className="w-2.5 h-2.5" />
                          {cat.slug}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted">
                        {new Date(cat.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          disabled={deletingId === cat._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-red hover:bg-red-tint transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Delete Category?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Are you sure you want to delete category{" "}
              <strong className="text-foreground">
                &quot;{categoryToDelete.name}&quot;
              </strong>
              ? If any courses are assigned to this category, deletion will be
              prevented by the server.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                disabled={Boolean(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red hover:bg-red/90 rounded-xl shadow-md shadow-red/20 transition-all flex items-center gap-1.5"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
