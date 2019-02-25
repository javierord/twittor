//Guardar en el cache dinámico
function actualizaCacheDinamico(dynamicChache, req, res) {

    if (res.ok) {

        return caches.open(dynamicChache).then(cache => {
            cache.put(req, res.clone());
            return res.clone();
        });

    } else {
        return res;
    }

}