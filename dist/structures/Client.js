"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const glob_1 = tslib_1.__importDefault(require("glob"));
const util_1 = require("util");
const globPromise = (0, util_1.promisify)(glob_1.default);
class ExtendedClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    constructor() {
        super({ intents: 32767 });
    }
    start() {
        this.registerModules();
        this.login(process.env.botToken);
    }
    async importFile(filePath) {
        var _a;
        return (await (_a = filePath, Promise.resolve().then(() => tslib_1.__importStar(require(_a)))))?.default;
    }
    async registerCommands({ commands, guildId }) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        }
        else {
            this.application?.commands.set(commands);
            console.log("Registering global commands");
        }
    }
    async registerModules() {
        // Commands
        const slashCommands = [];
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
        commandFiles.forEach(async (filePath) => {
            const command = await this.importFile(filePath);
            if (!command.name)
                return;
            console.log(command);
            this.commands.set(command.name, command);
            slashCommands.push(command);
        });
        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            });
        });
        // Event
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        eventFiles.forEach(async (filePath) => {
            const event = await this.importFile(filePath);
            this.on(event.event, event.run);
        });
    }
}
exports.ExtendedClient = ExtendedClient;
