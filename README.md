# YouTube Video Wall

Un dashboard de monitoreo de video profesional basado en web (HTML5/JS) diseñado para visualizar múltiples transmisiones de YouTube Live simultáneamente. Optimizado para pantallas Full HD (1920x1080) con una arquitectura de grilla responsive y controles avanzados de operador.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Características Principales

* **Matriz 1+12:** Un video principal de gran tamaño y 12 videos secundarios de monitoreo.
* **Gestión de Audio Exclusivo:** Solo una fuente de audio activa a la vez para evitar caos sonoro.
* **Modo Patrulla (Auto-Scan):** Rotación automática de foco y audio cada 10 segundos para vigilancia manos libres.
* **Hot-Swap (Intercambio Rápido):** `Shift + Click` trae cualquier video secundario al cuadrante principal instantáneamente.
* **Botón de Pánico:** Recarga individual de streams congelados sin refrescar toda la página.
* **Bypass de Políticas de Autoplay:** Sistema de inicio manual para cumplir con las normas de audio de los navegadores modernos.

## Controles y Atajos

| Acción | Comando | Descripción |
| :--- | :--- | :--- |
| **Escuchar Video** | `Ctrl + Click` | Activa el audio de ese video y silencia el resto. |
| **Pantalla Completa** | `Doble Click` | Maximiza el video seleccionado. |
| **Traer al Frente** | `Shift + Click` | Intercambia el video seleccionado con el principal (Swap). |
| **Recargar Stream** | `Click en ↻` | Botón en la esquina superior derecha de cada video (hover). |
| **Modo Patrulla** | `Botón en UI` | Activa/Desactiva la rotación automática. |

## Instalación y Uso

Este proyecto no requiere servidor backend ni dependencias de Node.js.

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/cirotron/youtube-video-wall.git](https://github.com/cirotron/youtube-video-wall.git)
    ```
2.  Abre el archivo `index.html` en tu navegador web favorito.
3.  Haz click en **"ACTIVAR SISTEMA"**.

## ⚙️ Configuración

Para cambiar los canales o videos de YouTube:

1.  Abre el archivo `script.js`.
2.  Busca el array `videoIds` al inicio del archivo.
3.  Reemplaza los IDs (la parte alfanumérica después de `v=` en la URL de YouTube).

```javascript
const videoIds = [
    "ID_PRINCIPAL", // Cuadrante 1
    "ID_VIDEO_2",
    "ID_VIDEO_3",
    // ... hasta 13 videos
];