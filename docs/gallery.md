# Tutorial de Uso da Galeria de Imagens

Para utilizar a galeria de imagens no seu projeto, siga estas instruções:

1. Importe o componente `getImages` da pasta de componentes:
```javascript
import { getImages } from '../src/app/components/GetImages';
```

2. Crie uma constante para acessar as imagens:
```javascript
const images = getImages();
```

3. Utilize as imagens em seus componentes. Por exemplo:
```javascript
<Image source={images.baloes} style={styles.image} />
```

4. Para acessar todas as imagens disponíveis, você pode converter o objeto de imagens em um array:
```javascript
const imagesArray = Object.entries(images);
```

5. Para exibir todas as imagens em uma lista, você pode usar o método map:
```javascript
{imagesArray.map(([name, source]) => (
  <View key={name}>
    <Image source={source} style={styles.image} />
    <Text>{name}</Text>
  </View>
))}
```