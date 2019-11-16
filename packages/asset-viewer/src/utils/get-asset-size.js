export default function getAssetSize({ gridWidth, gridHeight }) {
  return gridWidth && gridHeight
    ? `${gridWidth}x${gridHeight}`
    : 'unknown';
}
