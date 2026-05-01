# Bug Report

## Issue 1: Missing vitest-browser-svelte package (RESOLVED)

~~**File**: `src/lib/vitest-examples/Welcome.svelte.spec.ts`~~

~~**Error**:~~

```
Failed to load url vitest-browser-svelte (resolved id: vitest-browser-svelte). Does the file exist?
```

~~**Description**: The Welcome.svelte test imports `vitest-browser-svelte` which is not installed as a dependency in package.json.~~

~~**Status**: Needs to install the missing package.~~

---

## Issue 2: Playwright browsers not installed (RESOLVED)

~~**File**: E2E tests~~

~~**Error**:~~

```
Error: browserType.launch: Executable doesn't exist at C:\Users\MIRP\AppData\Local\ms-playwright\chromium_headless_shell-1208\chrome-headless-shell-win64\chrome-headless-shell.exe
```

~~**Description**: Playwright browsers are not installed. Need to run `npx playwright install` to download browsers.~~

~~**Status**: Needs to install Playwright browsers.~~

---

## Summary

- Unit tests: 1 passed, 1 failed (Welcome.svelte.spec.ts missing vitest-browser-svelte)
- E2E tests: 1 passed
