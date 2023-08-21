const { Command } = require("commander");
const commander = new Command();

//Por defecto es mode development
commander.option("--mode <mode>", "Modo de trabajo", "development").parse();

module.exports = { commander };
//Se importa en objectConfig