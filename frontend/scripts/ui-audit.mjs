import { chromium } from "playwright";

const baseUrl = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const maxPages = Number(process.env.AUDIT_MAX_PAGES || 30);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await chromium.launch({
  chromiumSandbox: false,
  executablePath: "/root/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--no-zygote",
    "--disable-gpu",
    "--single-process",
    "--disable-crashpad",
    "--disable-crash-reporter",
    "--disable-features=Crashpad",
  ],
});
const page = await browser.newPage();

const visited = new Set();
const queue = [baseUrl];
const results = [];

while (queue.length && visited.size < maxPages) {
  const url = queue.shift();
  if (!url || visited.has(url)) continue;
  visited.add(url);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await sleep(200);

    const data = await page.evaluate(() => {
      const getText = (el) => (el?.textContent || "").trim();
      const getByIdText = (id) => {
        if (!id) return "";
        const target = document.getElementById(id);
        return getText(target);
      };

      const getAccessibleName = (el) => {
        if (!el) return "";
        const ariaLabel = el.getAttribute("aria-label");
        if (ariaLabel) return ariaLabel.trim();

        const labelledBy = el.getAttribute("aria-labelledby");
        if (labelledBy) {
          return labelledBy
            .split(/\s+/)
            .map((id) => getByIdText(id))
            .join(" ")
            .trim();
        }

        const title = el.getAttribute("title");
        if (title) return title.trim();

        const img = el.querySelector("img[alt]");
        if (img && img.getAttribute("alt")) return img.getAttribute("alt").trim();

        return getText(el);
      };

      const getSelector = (el) => {
        if (!el) return "";
        if (el.id) return `#${el.id}`;
        const parts = [];
        let node = el;
        while (node && node.nodeType === 1 && parts.length < 4) {
          const tag = node.tagName.toLowerCase();
          const siblings = Array.from(node.parentElement?.children || []).filter(
            (child) => child.tagName === node.tagName
          );
          const index =
            siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(node) + 1})` : "";
          parts.unshift(`${tag}${index}`);
          node = node.parentElement;
        }
        return parts.join(" > ");
      };

      const issues = [];

      const title = document.title.trim();
      if (!title) {
        issues.push({
          type: "missing-title",
          message: "Document is missing a <title>.",
        });
      }

      const htmlLang = document.documentElement.getAttribute("lang");
      if (!htmlLang) {
        issues.push({
          type: "missing-lang",
          message: "<html> is missing a lang attribute.",
        });
      }

      const main = document.querySelector("main");
      if (!main) {
        issues.push({
          type: "missing-main",
          message: "Page lacks a <main> landmark.",
        });
      }

      const h1Count = document.querySelectorAll("h1").length;
      if (h1Count === 0) {
        issues.push({
          type: "missing-h1",
          message: "Page has no <h1> heading.",
        });
      }
      if (h1Count > 1) {
        issues.push({
          type: "multiple-h1",
          message: `Page has ${h1Count} <h1> elements.`,
        });
      }

      const imagesMissingAlt = Array.from(document.querySelectorAll("img"))
        .filter((img) => !img.hasAttribute("alt"))
        .slice(0, 5)
        .map((img) => getSelector(img));
      if (imagesMissingAlt.length) {
        issues.push({
          type: "img-missing-alt",
          message: "Images missing alt attributes.",
          examples: imagesMissingAlt,
        });
      }

      const linksMissingName = Array.from(document.querySelectorAll("a"))
        .filter((link) => !getAccessibleName(link))
        .slice(0, 5)
        .map((link) => getSelector(link));
      if (linksMissingName.length) {
        issues.push({
          type: "link-missing-name",
          message: "Links missing accessible names.",
          examples: linksMissingName,
        });
      }

      const buttonsMissingName = Array.from(
        document.querySelectorAll("button, [role='button']")
      )
        .filter((button) => !getAccessibleName(button))
        .slice(0, 5)
        .map((button) => getSelector(button));
      if (buttonsMissingName.length) {
        issues.push({
          type: "button-missing-name",
          message: "Buttons missing accessible names.",
          examples: buttonsMissingName,
        });
      }

      const controlsMissingLabel = Array.from(
        document.querySelectorAll("input, textarea, select")
      )
        .filter((control) => {
          const type = control.getAttribute("type");
          if (type === "hidden") return false;
          if (control.getAttribute("aria-label")) return false;
          if (control.getAttribute("aria-labelledby")) return false;
          if (control.id && document.querySelector(`label[for='${control.id}']`))
            return false;
          if (control.closest("label")) return false;
          return true;
        })
        .slice(0, 5)
        .map((control) => getSelector(control));
      if (controlsMissingLabel.length) {
        issues.push({
          type: "control-missing-label",
          message: "Form controls missing labels or aria-labels.",
          examples: controlsMissingLabel,
        });
      }

      const links = Array.from(document.querySelectorAll("a[href]"))
        .map((anchor) => anchor.getAttribute("href"))
        .filter((href) => href && href.startsWith("/") && !href.startsWith("//"));

      return {
        issues,
        links,
      };
    });

    results.push({ url, issues: data.issues });

    for (const link of data.links) {
      const normalized = new URL(link, url).toString();
      if (!visited.has(normalized)) queue.push(normalized);
    }
  } catch (error) {
    results.push({
      url,
      issues: [
        {
          type: "page-error",
          message: `Failed to load page: ${error.message}`,
        },
      ],
    });
  }
}

await browser.close();

const summary = results.map((page) => ({
  url: page.url,
  issues: page.issues,
}));

console.log(JSON.stringify(summary, null, 2));
