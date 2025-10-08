import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

interface LogoProps {
  width?: number;
  testID?: string;
}

const LOGO_URI = 'https://r2-pub.rork.com/generated-images/0d97a31b-57bb-4e36-80f4-6e9fec334ce2.png';

function LogoBase({ width = 140, testID = 'logo' }: LogoProps) {
  const aspectRatio = 4.5 as const;

  return (
    <View style={styles.container} accessibilityLabel="EduDash logo" testID={testID}>
      <Image
        source={{ uri: LOGO_URI }}
        style={{ width, height: width / aspectRatio }}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
    </View>
  );
}

export const Logo = memo(LogoBase);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
});
