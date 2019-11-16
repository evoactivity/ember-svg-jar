import { saveAs } from 'file-saver';

export default function saveAsset({ fileName, svg }) {
  const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
  saveAs(svgBlob, fileName);
}
