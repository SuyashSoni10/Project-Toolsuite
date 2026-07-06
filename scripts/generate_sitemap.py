from pathlib import Path
from urllib.parse import quote

BASE_URL = "https://project-toolsuite.vercel.app"

STATIC_PAGES = [
    "/",
    "/privacy.html",
    "/contributers.html",
]

root = Path(__file__).resolve().parent.parent
tools_dir = root / "tools"

urls = []

for page in STATIC_PAGES:
    urls.append(f"{BASE_URL}{page}")

for html_file in sorted(tools_dir.glob("*/*.html")):
    relative_path = html_file.relative_to(root).as_posix()
    urls.append(f"{BASE_URL}/{quote(relative_path)}")

xml = ['<?xml version="1.0" encoding="UTF-8"?>']
xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

for url in urls:
    xml.append("  <url>")
    xml.append(f"    <loc>{url}</loc>")
    xml.append("  </url>")

xml.append("</urlset>")

(root / "sitemap.xml").write_text("\n".join(xml), encoding="utf-8")

print(f"Generated sitemap with {len(urls)} URLs")