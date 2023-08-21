#Se define una imagen base: node .Se puede traer una version especifica ej: node:16.13.0
FROM node

#Carpeta donde vamos a guardar el proyecto
#WORKDIR /app

#Copia el package.json de nuestra carpeta a la carpeta dockeroperations
COPY . .
#COPY package*.json ./

#Ejecuta npm i en esa carpeta para instalar las dependencia del package.json
RUN npm install

#Despues de instalar, toma todo el codigo de la aplicacion y lo copia. El . . toma todos los archivos de raiz y mas profundos
#COPY . .

#Puerto para que escuche desde nuestra pc
EXPOSE 8080

#Ejecuta "npm start" para iniciar la aplicacion (lo toma desde el package.json)
CMD ["npm", "start"]