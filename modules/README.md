## Module Split

- `modules/crm`: CRM-specific UI pages and logic.
- `modules/website`: reserved for website-only modules.

Routes under `app/` should stay thin and import from these module folders.
