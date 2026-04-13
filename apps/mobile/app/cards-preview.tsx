import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/layout/screen";
import { EventListingCard } from "@/components/shared/listing/event-listing-card";
import { VenueListingCard } from "@/components/shared/listing/venue-listing-card";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDiscoverGrid } from "@/hooks/use-discover-grid";
import { EventService } from "@/services/event/event.service";
import type { PublishedEventListItem } from "@/services/discover/discover-list.types";
import type { PaginatedResponse } from "@/services/types/pagination.types";
import type { MarketplaceVenueCardDto } from "@/services/types/venue.types";
import { VenueService } from "@/services/venue/venue.service";

type VenueCardItem = MarketplaceVenueCardDto & { galleryUrls?: string[]; categoryLabel?: string };

export default function CardsPreviewScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { cardWidth, columnGap, horizontalPadding, numColumns } = useDiscoverGrid();

  const [events, setEvents] = useState<PublishedEventListItem[]>([]);
  const [venues, setVenues] = useState<VenueCardItem[]>([]);

  useEffect(() => {
    let alive = true;
    const evSvc = new EventService();
    const venueSvc = new VenueService();

    Promise.all([
      evSvc.listPublished({ page: 1, limit: 6 }) as Promise<PaginatedResponse<PublishedEventListItem>>,
      venueSvc.getById("venue_mock_1"),
      venueSvc.getById("venue_mock_2"),
    ])
      .then(([ev, v1, v2]) => {
        if (!alive) return;

        setEvents(ev.items);

        const placeholderGallery = [
          "https://images.unsplash.com/photo-1520697222869-f2d3c8d7d2a9?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=1200&q=60",
        ];

        setVenues([
          {
            venue: { ...v1, isVerifiedL2: true },
            primaryMediaUrl:
              "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=60",
            galleryUrls: placeholderGallery,
            categoryLabel: "Espaço",
          },
          {
            venue: { ...v2, isVerifiedL2: false, name: "Mock Venue 2", slug: "mock-venue-2" },
            primaryMediaUrl:
              "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=60",
            galleryUrls: placeholderGallery.slice(0, 1),
            categoryLabel: "Bar",
          },
        ]);
      })
      .catch(() => {
        if (!alive) return;
        setEvents([]);
        setVenues([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  const gridWrap = useMemo(
    () => ({
      flexDirection: numColumns > 1 ? ("row" as const) : ("column" as const),
      flexWrap: numColumns > 1 ? ("wrap" as const) : ("nowrap" as const),
      gap: columnGap,
    }),
    [columnGap, numColumns],
  );

  const gridMode = numColumns > 1;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: horizontalPadding, paddingBottom: 24 },
        ]}
      >
        <Text style={[styles.h1, { color: c.text }]}>Cards preview</Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>
          Use com EXPO_PUBLIC_USE_API_MOCKS=true para ver os mocks.
        </Text>

        <Text style={[styles.h2, { color: c.text, marginTop: 18 }]}>Eventos</Text>
        <View style={[gridWrap, { marginTop: 10 }]}>
          {events.map((it) => (
            <View key={it.event.id} style={gridMode ? { width: cardWidth } : undefined}>
              <EventListingCard
                event={it.event}
                primaryMediaUrl={
                  it.primaryMediaUrl ??
                  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=60"
                }
                galleryUrls={it.galleryUrls}
                categoryLabel={it.categoryLabel ?? "Evento"}
                textColor={c.text}
                subtitleColor={c.textSecondary}
                imagePlaceholderColor={c.border}
                onlineLabel="Online"
                onPress={() => router.push(`/event/${it.event.id}`)}
                cardInnerWidth={cardWidth}
                gridMode={gridMode}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.h2, { color: c.text, marginTop: 10 }]}>Venues</Text>
        <View style={[gridWrap, { marginTop: 10 }]}>
          {venues.map((it) => (
            <View key={it.venue.id} style={gridMode ? { width: cardWidth } : undefined}>
              <VenueListingCard
                card={it}
                categoryLabel={it.categoryLabel}
                trustBadgeLabel="Semi confiável"
                textColor={c.text}
                subtitleColor={c.textSecondary}
                imagePlaceholderColor={c.border}
                onPress={() => router.push(`/venue/${it.venue.id}`)}
                cardInnerWidth={cardWidth}
                gridMode={gridMode}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  h1: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  sub: {
    marginTop: 4,
    fontSize: 14,
  },
  h2: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
});

