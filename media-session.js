/**
 * media-session.js
 * * Contiene la lógica para registrar la pista actual en la Media Session API
 * del navegador, permitiendo el control de reproducción desde el sistema operativo.
 * * Requiere que las funciones globales (window.togglePlayPause, window.handlePlayback) 
 * sean accesibles desde el HTML principal.
 */

// Comprueba si la API está disponible antes de intentar usarla
if ('mediaSession' in navigator) {

    // =========================================================================
    // 1. ASIGNACIÓN DE HANDLERS (Botones del SO)
    // =========================================================================

    /**
     * Asigna las funciones a los botones de control del sistema operativo (p.ej., en Windows o auriculares).
     * Estas funciones globales deben estar definidas en el archivo index.html.
     */
    navigator.mediaSession.setActionHandler('play', () => {
        // Llama a la función global para reproducir
        if (typeof window.togglePlayPause === 'function') {
            window.togglePlayPause();
        }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
        // Llama a la función global para pausar
        if (typeof window.togglePlayPause === 'function') {
            window.togglePlayPause();
        }
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        // Llama a la función global para ir a la pista anterior
        if (typeof window.handlePlayback === 'function') {
            window.handlePlayback('prev');
        }
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
        // Llama a la función global para ir a la pista siguiente
        if (typeof window.handlePlayback === 'function') {
            window.handlePlayback('next');
        }
    });

    // Opcional: Deshabilitar funciones que no se usan, si es necesario.
    // navigator.mediaSession.setActionHandler('seekbackward', null);
    // navigator.mediaSession.setActionHandler('seekforward', null);
    // navigator.mediaSession.setActionHandler('stop', null);


    // =========================================================================
    // 2. FUNCIÓN DE ACTUALIZACIÓN
    // =========================================================================

    /**
     * Actualiza la información de la Media Session cuando se carga una nueva pista.
     * Esta función es llamada desde loadAndPlay() en index.html.
     * * @param {Object} track - El objeto de la pista actual (title, genre, cover).
     * @param {HTMLAudioElement} audioElement - La referencia al elemento <audio>.
     */
    window.updateMediaSession = function(track, audioElement) {
        
        // 1. ACTUALIZAR METADATOS (Título, Artista, Imagen)
        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: "George Singer", // Puedes cambiar esto si el artista es dinámico
            album: track.genre, // Usamos el género como nombre del álbum
            artwork: [
                // Imagen en alta resolución para el sistema operativo
                { src: track.cover, sizes: '512x512', type: 'image/png' }, 
            ]
        });

        // 2. ACTUALIZAR POSICIÓN Y ESTADO (Barra de avance y tiempo)
        
        // Solo para navegadores que soportan seekto (la mayoría)
        if ('setPositionState' in navigator.mediaSession && audioElement.duration) {
            
            // Cuando la metadata de la pista se carga, establece la duración.
            audioElement.onloadedmetadata = function() {
                navigator.mediaSession.setPositionState({
                    duration: audioElement.duration,
                    playbackRate: audioElement.playbackRate,
                    position: audioElement.currentTime,
                });
            };

            // Asegura que la posición se actualice cada vez que el audio lo haga.
            audioElement.ontimeupdate = function() {
                navigator.mediaSession.setPositionState({
                    duration: audioElement.duration,
                    playbackRate: audioElement.playbackRate,
                    position: audioElement.currentTime,
                });
            };
        }
    }

} else {
    console.warn("Media Session API no soportada en este navegador. El control de SO/auriculares estará deshabilitado.");
}