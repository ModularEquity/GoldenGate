# Deal Sourcer role

Users with `UserRole.DEAL_SOURCER` can:

- **Create** deals (web form or **CSV import** at `/dashboard/team/deals/import`)
- **Edit** any deal on the deal detail page (same form as create)
- **Refresh** listing thumbnails
- See **change history** (audit log) on each deal

**Employees** (`@modularequity.com` → `EMPLOYEE`) retain full team access; **Deal Sourcer** is the first operational role focused on pipeline intake.

## Assign the role in the database

There is no self-service UI yet. In **Neon SQL** (or `psql`):

```sql
UPDATE "User"
SET role = 'DEAL_SOURCER'
WHERE email = 'sourcer@example.com';
```

The user must **sign out and sign in again** (or wait for JWT refresh) to see new permissions.

## Audit log

Every create and field-level update writes rows to `DealAuditLog` with `actorId`, `field`, `oldValue`, `newValue`, and `createdAt`.

## CSV import

`POST /api/deals/import-csv` with `multipart/form-data` and field `file` (`.csv`). One row per deal; headers should match the deal JSON fields (see import page for example). Failed rows return per-row errors in the response.
