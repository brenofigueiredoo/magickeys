# Tutorial de Uso das Imagens Animadas

Para utilizar imagens com animações no seu projeto, siga estas instruções:

1. Importe os componentes necessários:
```javascript
import { Animated, Dimensions } from 'react-native';
import { getImages } from '../src/app/components/GetImages';
```

2. Configure as dimensões da tela:
```javascript
const windowHeight = Dimensions.get('window').height;
```

3. Crie uma referência para a animação usando o Animated.Value:
```javascript
const translateY = useRef(new Animated.Value(windowHeight)).current;
```

4. Implemente a função de animação:
```javascript
const moveUp = () => {
  Animated.timing(translateY, {
    toValue: -windowHeight,
    duration: 5000,
    useNativeDriver: true,
  }).start();
};
```

5. Use o useEffect para iniciar a animação quando o componente for montado:
```javascript
useEffect(() => {
  moveUp();  
}, []); 
```

6. Utilize a imagem com animação em seu componente:
```javascript
const images = getImages();

<Animated.Image 
  source={images.baloes} 
  style={{ transform: [{ translateY }] }}
/>
```

Este exemplo mostra como criar uma animação de movimento vertical para uma imagem, fazendo-a mover-se de baixo para cima na tela.