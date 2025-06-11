# Tutorial de Uso dos Ícones

Para utilizar os ícones no seu projeto, siga estas instruções:

1. Importe o componente `getIcones` da pasta de componentes:
```javascript
import { getIcones } from '../src/app/components/GetIcones';
```

2. Crie uma constante para acessar os ícones:
```javascript
const icones = getIcones();
```

3. Para acessar todos os ícones disponíveis, você pode converter o objeto de ícones em um array:
```javascript
const iconesArray = Object.entries(icones);
```

4. Para exibir os ícones em seu componente, você pode usar o método map:
```javascript
{iconesArray.map(([name, source]) => (
  <View key={name}>
    <Image source={source} style={styles.image} />
    <Text>{name}</Text>
  </View>
))}
```

5. Para usar um ícone individualmente:
```javascript
<Image source={icones.nomeDoIcone} style={styles.image} />
```