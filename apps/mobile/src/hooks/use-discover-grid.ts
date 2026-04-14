import { useWindowDimensions } from "react-native";

import { Layout } from "@/constants/layout";

const H_PADDING = Layout.tab.content.horizontalPadding;
const COLUMN_GAP = 12;

/** Largura mínima para mostrar 2 cards por linha (telemóveis médios/maiores). */
export const DISCOVER_TWO_COLUMN_MIN_WIDTH = 380;

export function useDiscoverGrid() {
  const { width } = useWindowDimensions();
  const numColumns = width >= DISCOVER_TWO_COLUMN_MIN_WIDTH ? 2 : 1;
  const innerWidth = width - H_PADDING * 2;
  const cardWidth =
    numColumns === 2 ? (innerWidth - COLUMN_GAP) / 2 : innerWidth;

  return {
    numColumns,
    cardWidth,
    columnGap: COLUMN_GAP,
    horizontalPadding: H_PADDING,
  };
}
