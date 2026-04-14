import { chmod, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");

async function fixPermissions(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    // If directory doesn't exist, just return
    return;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await fixPermissions(fullPath);
    } else if (entry.isFile()) {
      // Look for files named 'esbuild' or those inside a 'bin' directory that look like binaries
      const isEsbuildBinary = entry.name === "esbuild";
      const isInBin = dir.endsWith("bin");
      
      if (isEsbuildBinary || (isInBin && !entry.name.endsWith(".js") && !entry.name.endsWith(".map"))) {
        try {
          if (process.platform !== "win32") {
            await chmod(fullPath, 0o755);
            console.log(`Fixed permissions for: ${fullPath}`);
          }
        } catch (err) {
          console.warn(`Could not fix permissions for ${fullPath}: ${err.message}`);
        }
      }
    }
  }
}

console.log("Starting permission fix for binaries in node_modules...");
fixPermissions(join(rootDir, "node_modules"))
  .then(() => console.log("Permission fix complete."))
  .catch((err) => {
    console.error("Error fixing permissions:", err);
    process.exit(1);
  });
