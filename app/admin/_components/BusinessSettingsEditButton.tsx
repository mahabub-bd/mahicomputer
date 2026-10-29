"use client";

import { btn } from "@/components/form/buttonStyles";
import type { BusinessSettingsView } from "@/lib/types";
import { Pencil } from "lucide-react";
import { useState } from "react";
import BusinessSettingsForm from "./BusinessSettingsForm";
import Modal from "./Modal";

interface BusinessSettingsEditButtonProps {
  settings: BusinessSettingsView;
}

/**
 * Header action for the business settings page. Owns the edit modal so the
 * trigger can sit in the `PageHeader` actions slot while the view stays
 * read-only (and server rendered).
 */
const BusinessSettingsEditButton = ({ settings }: BusinessSettingsEditButtonProps) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <button onClick={() => setEditOpen(true)} className={btn("primary")}>
        <Pencil size={15} />
        Edit business settings
      </button>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit business settings"
        wide
      >
        {editOpen && (
          <BusinessSettingsForm
            settings={settings}
            onSuccess={() => setEditOpen(false)}
          />
        )}
      </Modal>
    </>
  );
};

export default BusinessSettingsEditButton;
