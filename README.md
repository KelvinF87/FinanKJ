# FinanKJ - Proyecto React con Vite y TailwindCSS

Este proyecto es una aplicación React construida con Vite para un desarrollo rápido y TailwindCSS para un diseño flexible y personalizado. Incluye herramientas modernas para un flujo de trabajo eficiente, incluyendo un chatbot que se integra a través de webhook con n8n.

## Tecnologías Utilizadas

*   **React:** Biblioteca para la construcción de la interfaz de usuario.
*   **Vite:**  Bundler y servidor de desarrollo ultrarrápido.
*   **TailwindCSS:** Framework CSS utilitario para un diseño rápido y adaptable.
*   **ESLint:** Linter para mantener la calidad y el estilo del código.
*   **API de Chatbot (Webhook a n8n):**  Se utiliza una API externa para la funcionalidad del chatbot, conectada a través de un webhook configurado en n8n (automatización de flujo de trabajo).

## Instalación

1.  Clona el repositorio:

    ```bash
    git clone https://github.com/KelvinF87/FinanKJ.git
    ```

2.  Navega al directorio del proyecto:

    ```bash
    cd FinanKJ
    ```

3.  Instala las dependencias:

    ```bash
    npm install
    ```

## Scripts Disponibles

*   `npm run dev`: Inicia el servidor de desarrollo de Vite.
*   `npm run build`: Construye la aplicación para producción.
*   `npm run lint`: Ejecuta ESLint para verificar el código.
*   `npm run preview`:  Sirve la aplicación compilada para producción localmente.

## Dependencias Principales

*   `@headlessui/react`: Componentes de UI accesibles sin estilo.
*   `@heroicons/react`: Biblioteca de iconos.
*   `tailwindcss`: Framework CSS utilitario.
*   `axios`: Cliente HTTP para realizar solicitudes.
*   `react-router`: Manejo de rutas en la aplicación.
*   `react-toastify`:  Para mostrar notificaciones al usuario.

## Dependencias de Desarrollo

*   `vite`: Bundler y servidor de desarrollo.
*   `eslint`: Linter de JavaScript.
*   `daisyui`: Conjunto de componentes UI para TailwindCSS.

## Consideraciones Adicionales (Chatbot)

*   **Configuración de n8n:**  El chatbot se conecta a través de un webhook definido en n8n. Asegúrate de configurar correctamente el flujo de trabajo en n8n para manejar las solicitudes del chatbot.
*   **API Externa:**  Este proyecto requiere una API externa para la funcionalidad del chatbot.  Revisa la documentación de la API utilizada para entender cómo configurarla y conectarla correctamente.

## Autor

*   Kelvin Jose Familia Adames
*   Correo: [docentekj@gmail.com](mailto:docentekj@gmail.com)
*   GitHub: [https://github.com/KelvinF87](https://github.com/KelvinF87)

## Repositorio

*   [FinanKJ en GitHub](https://github.com/KelvinF87/FinanKJ)