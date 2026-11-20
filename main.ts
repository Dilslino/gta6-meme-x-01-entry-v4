// gta6-meme-x-01-entry-v4 — ships the X post record for this meme entry.
//
// The meme itself lives in meme.jpg. Once the post is live on X, its details
// (post URL, author, timestamp) are recorded in POST.json in this repo, and
// this script copies that record into the grader's output directory so the
// entry can be verified against the live post.
//
// Node 22, standard library only — no dependencies.

import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(repoRoot, "POST.json");
const target = join(outputDir, "POST.json");

try {
  await mkdir(outputDir, { recursive: true });
  await copyFile(source, target);
  console.log(`POST.json copied to ${target}`);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === "ENOENT") {
    // The X post has not been published yet, so there is no record to ship.
    // This is expected before the author posts; the entry is still valid,
    // the image and README are the deliverable until then.
    console.log("POST.json not present yet — nothing to copy (post pending).");
  } else {
    throw error;
  }
}
