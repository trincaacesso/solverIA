/**
 * Gera todos os ícones do app a partir de uma imagem só.
 *
 *   node scripts/gerar-icones.mjs
 *
 * A fonte é assets/icon-base.svg (ou assets/icon.png, se existir — tem
 * prioridade). Para trocar a logo, substitua o arquivo e rode de novo.
 *
 * O que sai:
 *   public/icons/*        ícones do PWA e do iPhone
 *   public/logo-ctvh.png  a logo usada na tela de login e no cabeçalho
 *   android/.../res/      ícone do app Android
 *
 * O ícone do iPhone precisa ser PNG opaco: se tiver transparência, o
 * iOS pinta o fundo de preto e o resultado fica sujo. Por isso todos
 * são achatados sobre a cor de fundo.
 */

import sharp from "sharp";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FUNDO = "#050308";

const origemPng = join(ROOT, "assets", "icon.png");
const origemSvg = join(ROOT, "assets", "icon-base.svg");
const origem = existsSync(origemPng) ? origemPng : origemSvg;

if (!existsSync(origem)) {
  console.error("❌ Não achei assets/icon.png nem assets/icon-base.svg");
  process.exit(1);
}
console.log(`Fonte: ${origem.replace(ROOT, ".")}\n`);

const entrada = readFileSync(origem);

async function png(destino, tamanho, { margem = 0 } = {}) {
  mkdirSync(dirname(destino), { recursive: true });
  const util = tamanho - margem * 2;

  const base = await sharp(entrada, { density: 400 })
    .resize(util, util, { fit: "contain", background: FUNDO })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: tamanho,
      height: tamanho,
      channels: 4,
      background: FUNDO,
    },
  })
    .composite([{ input: base, top: margem, left: margem }])
    .flatten({ background: FUNDO }) // sem transparência, por causa do iOS
    .png()
    .toFile(destino);

  console.log(`  ${destino.replace(ROOT, ".")}  ${tamanho}px`);
}

// ── PWA ──────────────────────────────────────────────────────────────
console.log("PWA:");
const icones = join(ROOT, "public", "icons");
await png(join(icones, "icon-192.png"), 192);
await png(join(icones, "icon-512.png"), 512);
// "maskable": o Android recorta o ícone em círculo, folha ou quadrado
// conforme o aparelho. A margem garante que nada importante seja cortado.
await png(join(icones, "icon-maskable-512.png"), 512, { margem: 64 });
// o iPhone usa este, e sempre em 180px
await png(join(icones, "apple-touch-icon.png"), 180);

// ── logo usada dentro do app ─────────────────────────────────────────
console.log("\nLogo do sistema:");
await png(join(ROOT, "public", "logo-ctvh.png"), 512);

// ── Android nativo ───────────────────────────────────────────────────
console.log("\nAndroid:");
const RES = join(ROOT, "android", "app", "src", "main", "res");
if (existsSync(RES)) {
  const densidades = [
    ["mdpi", 48], ["hdpi", 72], ["xhdpi", 96],
    ["xxhdpi", 144], ["xxxhdpi", 192],
  ];
  for (const [dpi, tamanho] of densidades) {
    await png(join(RES, `mipmap-${dpi}`, "ic_launcher.png"), tamanho);
    await png(join(RES, `mipmap-${dpi}`, "ic_launcher_round.png"), tamanho);
    await png(join(RES, `mipmap-${dpi}`, "ic_launcher_foreground.png"), tamanho, {
      margem: Math.round(tamanho * 0.18),
    });
  }
  // O projeto vem com um ic_launcher_foreground.xml que tem prioridade
  // sobre o PNG. Sem apagar, o ícone continuaria sendo o do Capacitor.
  const xmlAntigo = join(RES, "drawable-v24", "ic_launcher_foreground.xml");
  if (existsSync(xmlAntigo)) {
    writeFileSync(
      xmlAntigo,
      `<?xml version="1.0" encoding="utf-8"?>
<!-- Substituído pelo PNG gerado em mipmap-*/ic_launcher_foreground.png -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp" android:height="108dp"
    android:viewportWidth="108" android:viewportHeight="108">
    <path android:fillColor="#050308" android:pathData="M0,0h108v108h-108z"/>
</vector>
`,
    );
    console.log("  drawable-v24/ic_launcher_foreground.xml neutralizado");
  }
} else {
  console.log("  (pasta android/ não encontrada — pulei)");
}

console.log("\n✅ Ícones gerados.");
console.log("Para trocar a logo: ponha o PNG 1024x1024 em assets/icon.png e rode de novo.");
