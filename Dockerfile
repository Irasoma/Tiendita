FROM nginx:alpine

# Limpiamos el contenido por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Directorio de trabajo donde nginx sirve archivos estáticos
WORKDIR /usr/share/nginx/html

# Copiamos los HTML principales
COPY ASSETS/index.html ./index.html
COPY ASSETS/producto.html ./producto.html

# Copiamos los assets, normalizando nombres de carpetas a minúsculas
# para que coincidan con las rutas usadas en los HTML (css, js, img).
COPY ASSETS/CSS ./css
COPY ASSETS/JS ./js
COPY ASSETS/IMG ./img

# Nginx ya expone el puerto 80 por defecto, no es necesario cambiar nada más


