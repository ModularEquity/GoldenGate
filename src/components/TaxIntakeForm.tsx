"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { TaxFormType, TaxProfile } from "@/lib/tax-profile";

export function TaxIntakeForm({
  initialProfile,
}: {
  initialProfile: TaxProfile | null;
}) {
  const router = useRouter();
  const [formType, setFormType] = useState<TaxFormType>(
    initialProfile?.formType ?? "W9",
  );
  const [legalName, setLegalName] = useState(initialProfile?.legalName ?? "");
  const [businessName, setBusinessName] = useState(
    initialProfile?.businessName ?? "",
  );
  const [tin, setTin] = useState(initialProfile?.tin ?? "");
  const [federalClassification, setFederalClassification] = useState(
    initialProfile?.federalClassification ?? "",
  );
  const [addressLine1, setAddressLine1] = useState(
    initialProfile?.addressLine1 ?? "",
  );
  const [addressLine2, setAddressLine2] = useState(
    initialProfile?.addressLine2 ?? "",
  );
  const [city, setCity] = useState(initialProfile?.city ?? "");
  const [stateOrProvince, setStateOrProvince] = useState(
    initialProfile?.stateOrProvince ?? "",
  );
  const [postalCode, setPostalCode] = useState(
    initialProfile?.postalCode ?? "",
  );
  const [country, setCountry] = useState(
    initialProfile?.country ?? "United States",
  );
  const [treatyCountry, setTreatyCountry] = useState(
    initialProfile?.treatyCountry ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(Boolean(initialProfile));

  useEffect(() => {
    if (initialProfile) {
      setSaved(true);
    }
  }, [initialProfile]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tax-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType,
          legalName,
          businessName: businessName || undefined,
          tin,
          federalClassification: federalClassification || undefined,
          addressLine1,
          addressLine2: addressLine2 || undefined,
          city,
          stateOrProvince,
          postalCode,
          country,
          treatyCountry: treatyCountry || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error ?? "Could not save");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-border bg-background/50 p-5">
        <div className="space-y-2">
          <label htmlFor="tax-form-type" className="text-sm font-medium">
            Form
          </label>
          <select
            id="tax-form-type"
            value={formType}
            onChange={(e) => setFormType(e.target.value as TaxFormType)}
            className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="W9">W-9 — U.S. person or entity</option>
            <option value="W8BEN">W-8BEN — Foreign individual</option>
            <option value="W8BENE">W-8BEN-E — Foreign entity</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="legal-name" className="text-sm font-medium">
              Legal name (as on tax return)
            </label>
            <input
              id="legal-name"
              required
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="biz-name" className="text-sm font-medium">
              Business / disregarded entity name (optional)
            </label>
            <input
              id="biz-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          {formType === "W9" ? (
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="fed-class" className="text-sm font-medium">
                Federal tax classification (W-9 line 3)
              </label>
              <input
                id="fed-class"
                value={federalClassification}
                onChange={(e) => setFederalClassification(e.target.value)}
                placeholder="e.g. Individual/sole proprietor, C Corporation"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          ) : null}
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="tin-full" className="text-sm font-medium">
              {formType === "W9"
                ? "Taxpayer identification number (TIN) — SSN or EIN, 9 digits"
                : "Foreign TIN (as applicable)"}
            </label>
            <input
              id="tin-full"
              required
              inputMode="numeric"
              autoComplete="off"
              value={tin}
              onChange={(e) =>
                setTin(
                  formType === "W9"
                    ? e.target.value.replace(/\D/g, "").slice(0, 9)
                    : e.target.value.replace(/\D/g, "").slice(0, 20),
                )
              }
              className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder={formType === "W9" ? "9-digit SSN or EIN" : "TIN"}
            />
            <p className="text-xs text-muted">
              Stored securely for tax reporting. PDF download masks TIN.
            </p>
          </div>
          {(formType === "W8BEN" || formType === "W8BENE") && (
            <div className="space-y-2">
              <label htmlFor="treaty" className="text-sm font-medium">
                Treaty country (optional)
              </label>
              <input
                id="treaty"
                value={treatyCountry}
                onChange={(e) => setTreatyCountry(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <p className="mb-3 text-sm font-medium">Address</p>
          <div className="grid gap-3">
            <input
              required
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Street address"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Apt, suite (optional)"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                required
                value={stateOrProvince}
                onChange={(e) => setStateOrProvince(e.target.value)}
                placeholder="State / province"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal code"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted">
          By submitting, you certify the information is accurate to the best of your
          knowledge. This intake generates a summary PDF — retain official IRS forms
          as required.
        </p>

        {err ? <p className="text-sm text-red-500">{err}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save & mark tax step complete"}
          </button>
          <a
            href="/api/tax-profile/pdf"
            className={
              saved
                ? "inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-background"
                : "pointer-events-none inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium opacity-40"
            }
          >
            Download PDF
          </a>
        </div>
      </form>
    </div>
  );
}
