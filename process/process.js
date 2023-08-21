process.cwd();
// process.pid;
// process.memoryUsage();
// process.version;

console.log(process.argv);

// node process 1 2 3
// node process a 2 -a
// node process
// node process --mode development

console.log(process.argv.slice(2));

//Ejemplo
function listNumber(...numbers) {
  //por el spread, numbers se guardan en un array con los parametros dados
  console.log(numbers);
  const types = numbers.map((nro) => typeof nro);
  console.log(types);
  if (types.includes("string") || types.includes("boolean")) {
    console.error(`Parámetro inválido: ${types}`);
    process.exitCode = -4;
  } else {
    console.log(numbers);
  }

  process.on("exit", (code) => {
    //code es = 0 si todo sale bien
    if (code == -4) {
      console.log("Proceso finalizado por un argumento invalido");
    }
  });
}

listNumber(1, 2, 3, 4, "cinco", true);
//listNumber(1, 2, 3, 4, 5);
