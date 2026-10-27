import type { Enrollment } from "@/lib/types";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { registerPdfFonts } from "./fonts";

/**
 * Printable documents for the admission module (server-side only — these
 * are rendered to PDF in API routes, never shipped to the browser).
 * All text uses Hind Siliguri so Bangla labels render correctly.
 */

const taka = (n: number) => `৳${n.toLocaleString("en-BD")}`;

const bdDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const s = StyleSheet.create({
  page: {
    fontFamily: "HindSiliguri",
    fontSize: 10,
    color: "#1e293b",
    padding: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#1d4ed8",
    paddingBottom: 10,
    marginBottom: 6,
  },
  brand: { fontSize: 16, fontWeight: 700, color: "#1d4ed8" },
  address: { fontSize: 8.5, color: "#64748b", marginTop: 2 },
  docTitle: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textAlign: "center",
    marginVertical: 12,
  },
  row: { flexDirection: "row", marginBottom: 6 },
  field: { flexDirection: "row", flex: 1, paddingRight: 12 },
  label: { width: 95, color: "#64748b", fontSize: 9 },
  value: { flex: 1, fontWeight: 700 },
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableCellLabel: { width: "55%", padding: 7, color: "#64748b", fontSize: 9.5 },
  tableCell: { width: "45%", padding: 7, fontWeight: 700 },
  totalRow: { backgroundColor: "#eff6ff" },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 24,
  },
  signLine: {
    borderTopWidth: 1,
    borderTopColor: "#94a3b8",
    width: 130,
    textAlign: "center",
    paddingTop: 4,
    fontSize: 8.5,
    color: "#64748b",
  },
  note: { fontSize: 8.5, color: "#94a3b8", textAlign: "center", marginTop: 8 },
  photo: {
    width: 80,
    height: 100,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 4,
    objectFit: "cover" as const,
  },
});

const DocHeader = ({ businessName, address }: { businessName: string; address: string }) => (
  <View style={s.header} fixed>
    <View>
      <Text style={s.brand}>{businessName || "Mahi Computer"}</Text>
      {address ? <Text style={s.address}>{address}</Text> : null}
    </View>
    <Text style={{ fontSize: 8.5, color: "#64748b" }}>
      {bdDate(new Date())}
    </Text>
  </View>
);

const Field = ({ label, value }: { label: string; value?: string | number | null }) =>
  value ? (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  ) : null;

/** Printable admission form with the full student profile. */
export const AdmissionFormPdf = ({
  enrollment,
  businessName,
  address,
}: {
  enrollment: Enrollment;
  businessName: string;
  address: string;
}) => {
  registerPdfFonts();
  const e = enrollment;
  return (
    <Document
      title={`Admission Form — ${e.name}`}
      author={businessName || "Mahi Computer"}
    >
      <Page size="A4" style={s.page}>
        <DocHeader businessName={businessName} address={address} />
        <Text style={s.docTitle}>ADMISSION FORM / ভর্তি ফরম</Text>

        <View style={{ flexDirection: "row", gap: 14 }}>
          <View style={{ flex: 1 }}>
            <View style={s.row}>
              <Field label="Student ID" value={e.studentId || "—"} />
              <Field
                label="Applied"
                value={bdDate(e.createdAt)}
              />
            </View>
            <View style={s.row}>
              <Field label="Name" value={e.name} />
              <Field label="Phone" value={e.phone} />
            </View>
            <View style={s.row}>
              <Field label="Email" value={e.email} />
              <Field
                label="Gender"
                value={
                  e.gender === "MALE"
                    ? "Male"
                    : e.gender === "FEMALE"
                      ? "Female"
                      : e.gender === "OTHER"
                        ? "Other"
                        : ""
                }
              />
            </View>
            <View style={s.row}>
              <Field label="Father's name" value={e.fatherName} />
              <Field label="Mother's name" value={e.motherName} />
            </View>
            <View style={s.row}>
              <Field
                label="Date of birth"
                value={e.dateOfBirth ? bdDate(e.dateOfBirth) : ""}
              />
              <Field label="Education" value={e.education} />
            </View>
            <View style={s.row}>
              <Field label="Guardian" value={e.guardianName} />
              <Field label="Guardian phone" value={e.guardianPhone} />
            </View>
            <View style={s.row}>
              <Field label="Address" value={e.address} />
            </View>
            <View style={s.row}>
              <Field label="Course" value={e.course} />
              <Field
                label="Status"
                value={
                  e.status === "APPROVED"
                    ? "Approved"
                    : e.status === "DECLINED"
                      ? "Declined"
                      : "Pending"
                }
              />
            </View>
            {e.message ? (
              <View style={s.row}>
                <Field label="Note" value={e.message} />
              </View>
            ) : null}
          </View>

          {e.photoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop
            <Image style={s.photo} src={e.photoUrl} />
          ) : (
            <View style={[s.photo, { justifyContent: "center", alignItems: "center" }]}>
              <Text style={{ fontSize: 8, color: "#94a3b8" }}>Photo</Text>
            </View>
          )}
        </View>

        <View style={s.footer}>
          <Text style={s.signLine}>Student&rsquo;s signature</Text>
          <Text style={s.signLine}>Guardian&rsquo;s signature</Text>
          <Text style={s.signLine}>For the institution</Text>
        </View>
      </Page>
    </Document>
  );
};

/** Printable payment receipt (fee / discount / paid / due + plan). */
export const ReceiptPdf = ({
  enrollment,
  businessName,
  address,
}: {
  enrollment: Enrollment;
  businessName: string;
  address: string;
}) => {
  registerPdfFonts();
  const e = enrollment;
  const planAmounts = Array.isArray(e.installmentPlan)
    ? e.installmentPlan.filter((a): a is number => typeof a === "number")
    : [];
  const due = Math.max(e.courseFee - e.discount - e.paidAmount, 0);

  return (
    <Document
      title={`Payment Receipt — ${e.name}`}
      author={businessName || "Mahi Computer"}
    >
      <Page size="A4" style={s.page}>
        <DocHeader businessName={businessName} address={address} />
        <Text style={s.docTitle}>PAYMENT RECEIPT / পেমেন্ট রশিদ</Text>

        <View style={s.row}>
          <Field
            label="Receipt no."
            value={e.studentId || e.id.slice(-8).toUpperCase()}
          />
          <Field label="Date" value={bdDate(new Date())} />
        </View>
        <View style={s.row}>
          <Field label="Student" value={`${e.name}${e.studentId ? ` (${e.studentId})` : ""}`} />
          <Field label="Phone" value={e.phone} />
        </View>
        <View style={s.row}>
          <Field label="Course" value={e.course} />
        </View>

        <View style={s.table}>
          <View style={s.tableRow}>
            <Text style={s.tableCellLabel}>Course fee / কোর্স ফি</Text>
            <Text style={s.tableCell}>{taka(e.courseFee)}</Text>
          </View>
          {e.discount > 0 && (
            <View style={s.tableRow}>
              <Text style={s.tableCellLabel}>Discount / ছাড়</Text>
              <Text style={s.tableCell}>−{taka(e.discount)}</Text>
            </View>
          )}
          {planAmounts.length > 0 && (
            <View style={s.tableRow}>
              <Text style={s.tableCellLabel}>Installments / কিস্তি</Text>
              <Text style={s.tableCell}>
                {planAmounts.map((a) => taka(a)).join(" + ")}
              </Text>
            </View>
          )}
          {e.paymentMethod ? (
            <View style={s.tableRow}>
              <Text style={s.tableCellLabel}>Payment method</Text>
              <Text style={s.tableCell}>{e.paymentMethod}</Text>
            </View>
          ) : null}
          {e.transactionId ? (
            <View style={s.tableRow}>
              <Text style={s.tableCellLabel}>Transaction ID</Text>
              <Text style={s.tableCell}>{e.transactionId}</Text>
            </View>
          ) : null}
          <View style={s.tableRow}>
            <Text style={s.tableCellLabel}>Paid / পরিশোধিত</Text>
            <Text style={s.tableCell}>{taka(e.paidAmount)}</Text>
          </View>
          <View style={[s.tableRow, s.totalRow]}>
            <Text style={[s.tableCellLabel, { fontWeight: 700, color: "#1e293b" }]}>
              Due / বাকি
            </Text>
            <Text
              style={[
                s.tableCell,
                { color: due > 0 ? "#dc2626" : "#059669" },
              ]}
            >
              {taka(due)}
            </Text>
          </View>
        </View>

        {e.adminNote ? (
          <Text style={{ marginTop: 10, fontSize: 9, color: "#64748b" }}>
            Note: {e.adminNote}
          </Text>
        ) : null}

        <View style={s.footer}>
          <Text style={s.signLine}>Received by</Text>
          <Text style={s.signLine}>Authorized signature</Text>
        </View>

        <Text style={s.note} fixed>
          This is a computer-generated receipt. / এটি কম্পিউটারে তৈরি রশিদ।
        </Text>
      </Page>
    </Document>
  );
};
