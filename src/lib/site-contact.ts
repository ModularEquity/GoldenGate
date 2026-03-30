/** Public contact email — override with NEXT_PUBLIC_CONTACT_EMAIL */
export function getContactEmail(): string {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    "hello@modularequity.com"
  );
}
