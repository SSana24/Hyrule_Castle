"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Save = void 0;
var character_1 = require("./character");
var fs = require('fs');
var readline = require('readline-sync');
var Save = /** @class */ (function () {
    function Save(listChar) {
        this.difficulty = 1;
        this.path = './.save.json';
        this.listChar = listChar;
    }
    Save.prototype.getDiff = function () {
        return this.difficulty;
    };
    Save.prototype.getListChar = function () {
        return this.listChar;
    };
    Save.prototype.createSave = function (tower) {
        var _this = this;
        this.listChar = tower.getListChar();
        var equipList = [];
        var itemList = [];
        var perso = '';
        var persoList = '[';
        this.listChar.forEach(function (char, i) {
            if (char instanceof character_1.Enemy) {
                perso = "{\"id\": ".concat(char.getId(), ",\"name\": \"").concat(char.getName(), "\",\"hp\":  ").concat(char.getHp(), ", \"hpMax\":  ").concat(char.getHpMax(), ",\"mp\":  ").concat(char.getMp(), ", \"mpMax\":  ").concat(char.getMpMax(), ",\"str\":  ").concat(char.getStr(), ",\"int\": ").concat(char.getInt(), ",\"def\": ").concat(char.getDef(), ",\"res\": ").concat(char.getRes(), ",\"spd\":  ").concat(char.getSpeed(), ",\"luck\":  ").concat(char.getLuck(), ",\"race\": ").concat(char.getRace(), ", \"class\": \"Enemy\", \"playedTurn\": ").concat(char.getPlayedTurn(), ", \"isProtected\": ").concat(char.getIsProtected(), "}");
            }
            else if (char instanceof character_1.Enemy && char.getHpMax() > 100) {
                perso = "{\"id\": ".concat(char.getId(), ",\"name\": \"").concat(char.getName(), "\",\"hp\":  ").concat(char.getHp(), ", \"hpMax\":  ").concat(char.getHpMax(), ",\"mp\":  ").concat(char.getMp(), ", \"mpMax\":  ").concat(char.getMpMax(), ",\"str\":  ").concat(char.getStr(), ",\"int\": ").concat(char.getInt(), ",\"def\": ").concat(char.getDef(), ",\"res\": ").concat(char.getRes(), ",\"spd\":  ").concat(char.getSpeed(), ",\"luck\":  ").concat(char.getLuck(), ",\"race\": ").concat(char.getRace(), ", \"class\": \"Boss\", \"playedTurn\": ").concat(char.getPlayedTurn(), ", \"isProtected\": ").concat(char.getIsProtected(), "}");
            }
            else if (char instanceof character_1.Hero) {
                char.getEquipement().forEach(function (equip) {
                    equipList.push("\"".concat(equip.getName(), "\""));
                });
                char.getItems().forEach(function (item) {
                    itemList.push("\"".concat(item.getName(), "\""));
                });
                perso = "{\"id\": ".concat(char.getId(), ",\"name\": \"").concat(char.getName(), "\",\"hp\":  ").concat(char.getHp(), ", \"hpMax\":  ").concat(char.getHpMax(), ",\"mp\":  ").concat(char.getMp(), ", \"mpMax\":  ").concat(char.getMpMax(), ",\"str\":  ").concat(char.getStr(), ",\"int\": ").concat(char.getInt(), ",\"def\": ").concat(char.getDef(), ",\"res\": ").concat(char.getRes(), ",\"spd\":  ").concat(char.getSpeed(), ",\"luck\":  ").concat(char.getLuck(), ",\"race\": ").concat(char.getRace(), ", \"class\": \"Hero\", \"role\": \"").concat(char.getRole().name, "\", \"playedTurn\": ").concat(char.getPlayedTurn(), ", \"isProtected\": ").concat(char.getIsProtected(), ", \"Consumable\": [").concat(itemList, "] , \"Equipement\": [").concat(equipList, "] }");
            }
            if (i < _this.listChar.length - 1) {
                perso += ',';
            }
            persoList += perso;
            equipList = [];
            itemList = [];
        });
        persoList += ']';
        fs.writeFile(this.path, "[{\"liste\": ".concat(persoList, "}, {\"difficulty\": ").concat(tower.getDifficulty(), "}]"), function (err) {
            if (err)
                throw err;
            console.log('Data saved');
        });
    };
    Save.prototype.loadData = function () {
        var _this = this;
        var stat = fs.statSync(this.path);
        if (stat.size !== 0) {
            var data = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            data[0].liste.forEach(function (char) {
                _this.listChar.push(char);
                console.log("".concat(char.name, " loaded"));
            });
            if (this.listChar.length > 0) {
                console.log('data loaded');
            }
            this.difficulty = data[1].difficulty;
            return true;
        }
        else {
            readline.question('------ no saved game ------');
            console.clear();
            return false;
        }
    };
    return Save;
}());
exports.Save = Save;
