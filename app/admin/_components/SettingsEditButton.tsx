"use client";

import { btn } from "@/components/form/buttonStyles";
import type { SiteSettingsView } from "@/lib/types";
import { Pencil } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";
import SettingsForm from "./SettingsForm";

interface SettingsEditButtonProps {
  settings: SiteSettingsView;
}

/**
 * Header action for the homepage settings page. Owns the edit modal so the
 * trigger can sit in the `PageHeader` actions slot while the view stays
 * read-only (and server rendered).
 */
const SettingsEditButton = ({ settings }: SettingsEditButtonProps) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <button onClick={() => setEditOpen(true)} className={btn("primary")}>
        <Pencil size={15} />
        Edit settings
      </button>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit homepage settings"
        wide
      >
        {editOpen && (
          <SettingsForm settings={settings} onSuccess={() => setEditOpen(false)} />
        )}
      </Modal>
    </>
  );
};

export default SettingsEditButton;
