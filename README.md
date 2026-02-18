# PDF結合ツール

ブラウザ上でPDFファイルを結合できるウェブアプリケーションです。

**すべての処理はブラウザ内で完結し、ファイルがサーバーに送信されることはありません。**

## 機能

- ドラッグ&ドロップでPDFファイルをアップロード
- ファイルの並び替え（ドラッグ&ドロップ）
- 各PDFのサムネイルプレビュー
- 出力ファイル名の変更
- 結合してダウンロード

## 技術スタック

- React + TypeScript + Vite
- Tailwind CSS v4
- pdf-lib（PDF結合）
- pdfjs-dist（サムネイル生成）
- @dnd-kit（ドラッグ&ドロップ）

## 開発

```bash
npm install
npm run dev
```

## テスト

```bash
npm test
```

## ビルド

```bash
npm run build
```

## ライセンス

MIT
