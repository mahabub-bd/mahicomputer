"use client";

import { useState } from "react";
import { Pencil, Plus, ShieldCheck } from "lucide-react";
import type { UserView } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import UserForm from "./UserForm";

interface UsersListProps {
  users: UserView[];
}

const UsersList = ({ users }: UsersListProps) => {
  const [modal, setModal] = useState<{ user?: UserView } | null>(null);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Accounts that can sign in to this panel
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={16} />
          Add admin
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                      {(u.name || u.email).charAt(0).toUpperCase()}
                    </span>
                    <span className="leading-tight">
                      <span className="block font-medium text-slate-900">
                        {u.name || "Admin"}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {u.email}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setModal({ user: u })}
                      title="Edit"
                      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <DeleteButton
                      url={`/api/admin/users/${u.id}`}
                      confirmText={`Delete the admin account for ${u.email}?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  No admin accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-slate-400">
        <ShieldCheck size={14} className="mt-0.5 shrink-0" aria-hidden />
        <p>
          You cannot delete your own account or the last remaining admin. Passwords
          are stored hashed.
        </p>
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.user ? "Edit admin account" : "Add admin account"}
      >
        {modal !== null && (
          <UserForm
            key={modal.user?.id ?? "new"}
            user={modal.user}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default UsersList;
