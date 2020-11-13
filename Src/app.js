if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js')
        .then(function() { console.log('Service Worker Registered'); })
        .catch(err=>{
            console.log('Unable to register serivce worker',err);
        });
}


