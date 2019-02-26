// imports
importScripts('js/sw-utils.js');

// caches
const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

// Archivos importantes para la aplicación
const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

// Archivos importantes para la aplicación pero que nosotros no mantenemos
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

// Instalación del SW
self.addEventListener('install', e => {

    // Creamos el cache estático y agregamos el APP_SHELL
    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    // Creamos el cache inmutable y agregamos el APP_SHELL_INMUTABLE
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));

    // Ejecutamos los promesas de los caches
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

// Se activa el SW
self.addEventListener('activate', e => {

    // Limpiamos el cache
    const res = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil(res);

});

// Hacemos las peticiones
self.addEventListener('fetch', e => {

    // Traemos los archivos del cache
    const resp = caches.match(e.request).then(res => {

        // Si lo consigue lo regresa
        if (res) {
            return res;
        } else {
            // Si no lo busca en la red y lo agrega al cache dinámico

            return fetch(e.request).then(newResp => {
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResp);
            });

        }

    });

    e.respondWith(resp);

});