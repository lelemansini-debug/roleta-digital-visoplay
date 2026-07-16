# Roleta Digital Viso Play

Roleta digital para totem touchscreen, offline, personalizavel por cliente e empacotada para Android com Capacitor.

## Comandos

```bash
npm install
npm run dev
npm run build
```

O servidor de desenvolvimento usa `http://127.0.0.1:5174/`.

## Android

Requisitos: Android Studio, SDK Android 36 e Java 21. O Java incluido no Android Studio pode ser usado para compilar o projeto.

```bash
npm run android:sync
npm run android:open
```

O projeto nativo fica em `android/`. No Android Studio, use **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

O APK de teste gerado pelo Gradle fica em:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Uma copia nomeada pode ser colocada em `apk/`; essa pasta e local e nao entra no Git.

O aplicativo usa o identificador `com.visoplay.roletadigital`, orientacao vertical fixa, modo tela cheia e mantem a tela do totem ligada durante o uso.

## Personalizacao

Edite `src/config/clientConfig.js` para trocar cliente, cores, artes, textos, premios, pesos e tempo de giro. Depois execute `npm run android:sync` para copiar as alteracoes para o projeto Android.

Os assets da demo ficam em `src/assets/clients/demo/`.
