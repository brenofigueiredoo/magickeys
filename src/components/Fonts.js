import { useFonts } from 'expo-font';

export function Fonts() {
  const [fontsLoaded] = useFonts({
          'Chalk': require('../../../assets/fonts/Chalk-Regular.ttf'),
          'MyriadPro-Regular': require('../../../assets/fonts/Myriad Pro Regular.ttf'),
          'MyriadPro-Bold': require('../../../assets/fonts/Myriad Pro Bold.ttf'),
          'Menlo-Regular': require('../../../assets/fonts/Menlo-Regular.ttf'),
          'Skia': require('../../../assets/fonts/Skia.ttf'),
          'Splinesans-bold': require('../../../assets/fonts/SplineSans-Bold.ttf'),
          'Splinesans-light': require('../../../assets/fonts/SplineSans-Light.ttf'),
          'Splinesans-medium': require('../../../assets/fonts/SplineSans-Medium.ttf'),
          'Splinesans-regular': require('../../../assets/fonts/SplineSans-Regular.ttf')
  });

  return fontsLoaded;
}