import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon/icon';
import { AppIcon } from '@/components/ui/icon/icon.types';
import { Screen } from '@/components/layout/screen';

export default function ProfileScreen() {
  const { t } = useTranslation('profile');

  return (
    <Screen>
      <ThemedView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150' }}
            style={styles.avatar}
          />

          <View style={styles.info}>
            <ThemedText type="title">James Marques</ThemedText>
            <ThemedText>@james</ThemedText>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.stats}>
          <Stat label={t('posts')} value="12" />
          <Stat label={t('followers')} value="340" />
          <Stat label={t('following')} value="180" />
        </View>

        {/* BIO */}
        <ThemedText style={styles.bio}>
          🚀 Construindo um app de eventos
        </ThemedText>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Icon name={AppIcon.Profile} size="md" color="#fff" />
          <ThemedText style={styles.buttonText}>
            {t('editProfile')}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="subtitle">{value}</ThemedText>
      <ThemedText>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  info: {
    gap: 4,
  },

  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  stat: {
    alignItems: 'center',
    gap: 4,
  },

  bio: {
    marginTop: 8,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#000',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});