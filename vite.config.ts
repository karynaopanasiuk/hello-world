import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Used by Storybook. The static card page (index.html) is not built by Vite.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
