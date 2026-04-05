import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppIcon } from '@/components/ui/icon/icon.types';
import { Icon } from '@/components/ui/icon/icon';
import { useTranslation } from 'react-i18next';
import { OnboardingSetupProvider } from '@/contexts/onboarding-setup-context';

export default function TabLayout() {
  const { t } = useTranslation('tabs');
  const colorScheme = useColorScheme();

  return (
    <OnboardingSetupProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={AppIcon.Home}
              size="lg"
              color={color}
              filled={focused}
            />
          ),
          tabBarAccessibilityLabel: t('home'),
        }}
      />

      <Tabs.Screen
        name="test"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={AppIcon.Like}
              size="lg"
              color={color}
              filled={focused}
            />
          ),
          tabBarAccessibilityLabel: 'Explore',
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={AppIcon.Explore}
              size="lg"
              color={color}
              filled={focused}
            />
          ),
          tabBarAccessibilityLabel: t('mapTab'),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={AppIcon.Create}
              size="lg"
              color={color}
              filled={focused}
            />
          ),
          tabBarAccessibilityLabel: 'Create',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={AppIcon.Profile}
              size="lg"
              color={color}
              filled={focused}
            />
          ),
          tabBarAccessibilityLabel: 'Profile',
        }}
      />
    </Tabs>
    </OnboardingSetupProvider>
  );
}
