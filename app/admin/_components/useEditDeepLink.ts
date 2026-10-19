"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Deep link behind the detail pages' Edit button:
 * `/admin/<section>?edit=<id>` opens that record's edit modal on the
 * list page. The param is cleared when the modal closes, so refreshing
 * or going back does not reopen it, and a later navigation with the
 * same id opens again.
 */
export default function useEditDeepLink<T extends { id: string }>(
  editId: string | undefined,
  records: readonly T[],
  open: (record: T) => void,
  close: () => void,
) {
  const router = useRouter();
  const pathname = usePathname();
  const consumedId = useRef<string | null>(null);

  useEffect(() => {
    if (!editId) {
      consumedId.current = null;
      return;
    }
    if (consumedId.current === editId) return;
    const record = records.find((item) => item.id === editId);
    if (!record) return;
    consumedId.current = editId;
    open(record);
    // open/records change identity every render; the ref runs this once per id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, records]);

  return () => {
    close();
    if (editId) router.replace(pathname, { scroll: false });
  };
}
