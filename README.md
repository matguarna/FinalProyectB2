node src/app.js --mode production

npm run dev : entorno development
npm start : mode production

------Artillery-------

//quick sirve para testear peticiones a un endpoint. 40 es la cantidad de usuarios y 50 la cantidad de peticiones por usuario y genera el archivo simple.json
artillery quick --count 40 --num 50 "http://localhost:8080/pruebas/simple" -o simple.json

artillery quick --count 40 --num 50 "http://localhost:8080/pruebas/compleja" -o compleja2.json

Generar y configurar el archivo config.yaml

//Genera un archivo con los resultados del test
artillery run config.yaml --output testPerformance.json

//Crea un reporte con el archivo generado anteriormente
artillery report testPerformance.json -o testResult.html

``
||

Docker
-servidor
-crear dockerfile
-crear imagen : docker build -t dockeroperations .
-verificar que funciona el sv: docker run -p 8080:8080 dockeroperations

Mocha & chai
en scripts package json: "mocha test/Users.test.js"
consola: npm run test

NEST
nest g resource Productos
npm run start:dev