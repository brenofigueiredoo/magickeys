# Tutorial de Uso das Fontes

Para utilizar as fontes personalizadas no seu projeto, siga estas instruções:

1. Instale a biblioteca "expo-font" no seu projeto:
```bash
npm install expo-font
```

2. Importe o arquivo "Fonts.js" da pasta "src/app/components" na tela onde deseja usar as fontes:
```javascript
import {Fonts} from '../src/app/components/Fonts';
```

3. Inicie uma constante com o valor da classe "Fonts":
```javascript
const fontsLoaded = Fonts();
```

4. Aplique a fonte desejada no style do elemento Text. As fontes disponíveis são:
- Chalk
- SplineSans Bold
- Myriad Pro Bold

Exemplo de uso:
```javascript
style={{ fontFamily: 'MyriadPro-Bold', fontSize: 24 }}
```