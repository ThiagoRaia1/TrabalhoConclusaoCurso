import { useWindowDimensions, PixelRatio } from "react-native";

export const useNormalize = () => {
  const { width } = useWindowDimensions();
  const scale = width / 320;

  type NormalizeParams = {
    base?: number;
    min?: number;
    max?: number;
  };

  const normalize = ({
    base = 20,
    min = 12,
    max = 30,
  }: NormalizeParams = {}) => {
    const newSize = base * scale;

    // Retorna o valor dentro do intervalo mínimo e máximo
    return Math.max(
      min,
      Math.min(max, Math.round(PixelRatio.roundToNearestPixel(newSize)))
    );
  };

  const normalizeHeight = ({
    base = 50,
    min = 40,
    max = 60,
  }: NormalizeParams = {}) => {
    const newHeight = base * scale;

    // Retorna o valor dentro do intervalo mínimo e máximo
    return Math.max(
      min,
      Math.min(max, Math.round(PixelRatio.roundToNearestPixel(newHeight)))
    );
  };

  const normalizeFontWeight = ({
    base = 400,
    min = 100,
    max = 900,
  }: NormalizeParams = {}):
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900" => {
    const scale = width / 320; // ou passe `scale` como parâmetro
    const scaled = Math.min(max, Math.max(min, Math.round(base * scale)));

    const allowedWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900].filter(
      (w) => w >= min && w <= max
    );

    const closest = allowedWeights.reduce((prev, curr) =>
      Math.abs(curr - scaled) < Math.abs(prev - scaled) ? curr : prev
    );

    return String(closest) as any;
  };

  const normalizeIconSize = (
    size: number,
    min = 24,
    max = 150
  ): number => {
    const newSize = size * scale;
    return Math.max(
      min,
      Math.min(max, Math.round(PixelRatio.roundToNearestPixel(newSize)))
    );
  };

  return { normalize, normalizeHeight, normalizeFontWeight, normalizeIconSize };
};
