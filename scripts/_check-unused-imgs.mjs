import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const p = new PrismaClient();
const unused = ["advancedweb.jpg","Animated Shape.svg","auto-cad.png","autocad.jpg","banner-2.jpg","banner-3.png","bill payment.webp","ceo.jpg","chapter.png","clock.png","close.svg","contact us.png","courseweb.webp","Couse for web.docx","down-arrow.svg","email.svg","hardware.jpg","herobg.jpg","herobg.webp","Hexagon.svg","instagram.svg","location.svg","logo-dark.png","logo-white.png","logo_white.webp","menu.svg","Moon.svg","phone.svg","rating.png","responsiveweb.jpg","shape-2-modified.png","shape-2.svg","shape-modified.png","shape.svg","signal.png","Simple Shiny.svg","Sound Wave.svg","Sprinkle.svg","up-arrow.svg"];
const models = ["Category","Course","GalleryImage","Instructor","Partner","Review","SocialMedia","SiteSettings","Banner","Hero","Slide"];
for (const m of models) {
  try {
    const rows = await p[m].findMany();
    for (const r of rows) {
      for (const [k,v] of Object.entries(r)) {
        if (typeof v === "string") {
          for (const u of unused) if (v.includes(u)) console.log(`DB HIT: ${m}.${k} -> ${u}`);
        }
      }
    }
  } catch(e) { }
}
await p.$disconnect();
console.log("done");
