import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});