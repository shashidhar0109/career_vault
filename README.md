# Job Application Tracker & Resume Builder

A modern, privacy-first career cockpit and modular resume builder built with React, TypeScript, Vite, and Tailwind CSS.

<!-- SCREENSHOT_PREVIEW_START -->
<!-- Add your app preview screenshots / banners below -->
<!-- Example: ![App Preview](./screenshots/preview.png) -->
<!-- SCREENSHOT_PREVIEW_END -->

---

## ⚡ Running Without `git clone`: The `npx` Method & Control Commands

The `npx` (Node Package eXecute) command allows running the application immediately without cloning Git repositories or leaving permanent clutter on disk.

### Option A: 1-Step `npx` Run (Zero Git Clone, Zero Disk Clutter)

If published as an npm package (e.g. `npx career-vault`), any user can launch it with a single terminal command:

```bash
npx career-vault
```

- `npx` automatically fetches the app into a temporary cache.
- Starts the local server and opens `http://localhost:3000`.
- When they press `Ctrl+C`, it closes. No code or cloned folders remain on their machine.

---

### Option B: Self-Contained Control Script (`./career.sh`)

An executable control script (`career.sh`) is included in the project root with simple start, stop, and delete commands:

- **Start:** Runs the application in the background:
  ```bash
  ./career.sh start
  ```

- **Stop:** Terminates the background server cleanly:
  ```bash
  ./career.sh stop
  ```

- **Delete:** Prompts for confirmation and completely removes the application and all files from their machine:
  ```bash
  ./career.sh delete
  ```

---

## 🔒 Privacy & Security Architecture

### Is this safe from external vulnerabilities?
- **Zero Server Attack Surface:** Because this application runs purely on the client side without an external backend or database, **there are no database ports to exploit, no remote API credentials to leak, and zero possibility of SQL injection.**
- **Local Isolation:** When hosted on GitHub Pages or run locally, each user's data lives exclusively in their own browser's `localStorage`. User A cannot see User B's resumes or applications.
- **Offline Capable:** You can disconnect your internet and the entire application continues to work, export `.docx` / `.pdf` files, and track your jobs.

### Data Storage & Limits
- Resumes, contacts, and tracked jobs are preserved across browser sessions via `localStorage`.
- Uploaded resumes are validated under 3.5 MB to avoid browser quota limits.
- **Data Backup:** You can export your full tracker as a `.csv` file anytime from the top bar before clearing browser site data.

---

## 🗄️ Optional: Connecting a Cloud Database (Supabase / Firebase)

If cross-device synchronization is desired (e.g. syncing data between mobile and laptop):

1. Create a project at [Supabase](https://supabase.com).
2. Install the client:
   ```bash
   npm install @supabase/supabase-js
   ```
3. Add your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://xyzcompany.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
4. Replace the `localStorage` state hook in `src/App.tsx` with Supabase queries.

---

## 🛠️ Tech Stack
- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **html2canvas-pro** & **jsPDF** (High-Resolution A4 Export)
- **docx** & **canvas-confetti**
- **Lucide Icons**
