"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLauncher = void 0;
var character_1 = require("./character");
var character_2 = require("./character");
var move_1 = require("./move");
var class_1 = require("./class");
var save_1 = require("./save");
var equipement_1 = require("./equipement");
var c = require('ansi-colors');
var fs = require('fs');
var readline = require('readline-sync');
var GameLauncher = /** @class */ (function () {
    function GameLauncher(tower) {
        this.continue = true;
        this.movesJson = JSON.parse(fs.readFileSync('./moves.json', 'utf-8'));
        this.enemieJson = JSON.parse(fs.readFileSync('./enemies.json', 'utf-8'));
        this.playerJson = JSON.parse(fs.readFileSync('./players.json', 'utf-8'));
        this.bossJson = JSON.parse(fs.readFileSync('./bosses.json', 'utf-8'));
        this.classJson = JSON.parse(fs.readFileSync('./class.json', 'utf-8'));
        this.lootJson = JSON.parse(fs.readFileSync('./loot.json', 'utf-8'));
        this.save = new save_1.Save([]);
        this.tower = tower;
    }
    GameLauncher.prototype.gameStart = function () {
        this.generateHero();
        this.generateEnemy();
    };
    GameLauncher.prototype.difficultyChoice = function () {
        var choice = ['Normal', 'Difficult', 'Ganon\'s challenge'];
        var choiceI = readline.keyInSelect(choice, '');
        if (choiceI === 1) {
            this.tower.setDifficulty(1.5);
        }
        else if (choiceI === 2) {
            this.tower.setDifficulty(2);
        }
    };
    GameLauncher.prototype.raritySort = function (cat) {
        var rarity = Math.floor(Math.random() * 101);
        if (rarity <= 50) {
            rarity = 1;
        }
        else if (rarity < 80) {
            rarity = 2;
        }
        else if (rarity < 95) {
            rarity = 3;
        }
        else if (rarity < 99) {
            rarity = 4;
        }
        else {
            rarity = 5;
        }
        var res = [];
        if (cat === 'Boss') {
            for (var i = 0; i < this.bossJson.length; i++) {
                if (this.bossJson[i].rarity === rarity) {
                    res.push(this.bossJson[i]);
                }
            }
        }
        else if (cat === 'Enemy') {
            for (var i = 0; i < this.enemieJson.length; i++) {
                if (this.enemieJson[i].rarity === rarity) {
                    res.push(this.enemieJson[i]);
                }
            }
        }
        var char = res[Math.floor(Math.random() * res.length)];
        return char;
    };
    GameLauncher.prototype.runAway = function () {
        var _this = this;
        var odds = Math.floor(Math.random() * 100);
        var originalLength = this.tower.getListChar().length;
        if (odds <= 5) {
            this.generateBosses().forEach(function (element) {
                _this.tower.addEnemy(element);
            });
            for (var i = 0; i < this.tower.getListChar().length - (this.tower.getListChar().length - originalLength); i++) {
                if (this.tower.getListChar()[i] instanceof character_1.Enemy) {
                    this.tower.delEnemy(i);
                }
            }
            console.log('terrible odds has fell on you');
        }
        else {
            this.generateEnemy().forEach(function (element) {
                _this.tower.addEnemy(element);
            });
            for (var i = 0; i < this.tower.getListChar().length - (this.tower.getListChar().length - originalLength); i++) {
                if (this.tower.getListChar()[i] instanceof character_1.Enemy) {
                    this.tower.delEnemy(i);
                }
            }
        }
        if (this.tower.getLvl() - 5 > 0) {
            this.tower.setLvl(this.tower.getLvl() - Math.floor(Math.random() * 6));
        }
        else {
            this.tower.setLvl(0);
        }
        console.log('you will flee to lower floors after the next turn');
    };
    GameLauncher.prototype.generateEnemy = function () {
        var list = [];
        for (var i = 0; i < Math.floor(Math.random() * 6 + 1); i++) {
            var enemyMoves = [];
            var enemie = this.raritySort('Enemy');
            for (var i_1 = 0; i_1 < this.movesJson.length; i_1++) {
                if (this.movesJson[i_1].category === 'Damage' && (this.movesJson[i_1].user === 'all' || this.movesJson[i_1].user === 'Monster')) {
                    var move = new move_1.Move(this.movesJson[i_1].dmg, this.movesJson[i_1].name, this.movesJson[i_1].category, this.movesJson[i_1].MpCost, this.movesJson[i_1].Type, this.movesJson[i_1].effect, this.movesJson[i_1].user);
                    enemyMoves.push(move);
                }
            }
            var enemy = new character_1.Enemy(enemie.name, Math.floor(enemie.hp * this.tower.getDifficulty()), Math.floor(enemie.hp * this.tower.getDifficulty()), Math.floor(enemie.str * this.tower.getDifficulty()), enemyMoves, enemie.sprite, [], enemie.mp, enemie.mp, enemie.int, enemie.def, enemie.res, enemie.spd, Math.floor(enemie.luck * this.tower.getDifficulty()), enemie.race);
            list.push(enemy);
        }
        return (list);
    };
    GameLauncher.prototype.generateClass = function () {
        var classList = [];
        this.classJson.forEach(function (role) {
            var newRole = new class_1.Class(role.name, role.bonus, role.specialMove);
            classList.push(newRole);
        });
        return classList;
    };
    GameLauncher.prototype.generateHero = function () {
        var heroMoves = [];
        var heroList = [];
        var heroListname = [];
        var roleList = this.generateClass();
        var roleListname = [];
        for (var i = 0; i < roleList.length; i++) {
            roleListname.push(roleList[i].name);
        }
        var _loop_1 = function (i) {
            console.log('============= CHOOSE A CLASS =============');
            var chosenRole = readline.keyInSelect(roleListname, '---- a class will define how you fight ----', { cancel: false });
            for (var i_2 = 0; i_2 < this_1.movesJson.length; i_2++) {
                console.log(this_1.movesJson[i_2].user);
                if (this_1.movesJson[i_2].user === 'all' || this_1.movesJson[i_2].user === 'Hero') {
                    var move = new move_1.Move(this_1.movesJson[i_2].dmg, this_1.movesJson[i_2].name, this_1.movesJson[i_2].category, this_1.movesJson[i_2].MpCost, this_1.movesJson[i_2].Type, this_1.movesJson[i_2].effect, this_1.movesJson[i_2].user);
                    heroMoves.push(move);
                }
            }
            for (var i_3 = 0; i_3 < this_1.playerJson.length; i_3++) {
                if (this_1.playerJson[i_3].used === false) {
                    var hero_1 = new character_2.Hero(this_1.playerJson[i_3].name, this_1.playerJson[i_3].hp, this_1.playerJson[i_3].hp, this_1.playerJson[i_3].str, heroMoves, this_1.playerJson[i_3].sprite, [], this_1.playerJson[i_3].mp, this_1.playerJson[i_3].mp, this_1.playerJson[i_3].int, this_1.playerJson[i_3].def, this_1.playerJson[i_3].res, this_1.playerJson[i_3].spd, this_1.playerJson[i_3].luck, this_1.playerJson[i_3].race, roleList[chosenRole]);
                    heroList.push(hero_1);
                }
            }
            heroList.forEach(function (hero) {
                heroListname.push(hero.getName());
            });
            console.log('============= CHOOSE A HERO =============');
            var chosenHero = readline.keyInSelect(heroListname, '---- different hero have different statistics ----', { cancel: false });
            var hero = heroList[chosenHero];
            hero.applyClass(true);
            hero.status(this_1);
            this_1.tower.addHero(hero);
            heroMoves = [];
            heroList = [];
            heroListname = [];
            this_1.playerJson.forEach(function (element) {
                if (element.name === hero.getName()) {
                    element.used = true;
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < 2; i++) {
            _loop_1(i);
        }
    };
    GameLauncher.prototype.generateBosses = function () {
        var enemyMoves = [];
        var boss = this.raritySort('Boss');
        for (var i = 0; i < this.movesJson.length; i++) {
            if (this.movesJson[i].category === 'Damage' && (this.movesJson[i].user === 'all' || this.movesJson[i].user === 'Monster')) {
                var move = new move_1.Move(this.movesJson[i].dmg, this.movesJson[i].name, this.movesJson[i].category, this.movesJson[i].MpCost, this.movesJson[i].Type, this.movesJson[i].effect, this.movesJson[i].user);
                enemyMoves.push(move);
            }
        }
        var enemy = new character_1.Enemy(boss.name, Math.floor(boss.hp * this.tower.getDifficulty()), Math.floor(boss.hp * this.tower.getDifficulty()), Math.floor(boss.str * this.tower.getDifficulty()), enemyMoves, boss.sprite, [], boss.mp, boss.int, boss.mp, boss.def, boss.res, boss.spd, Math.floor(boss.luck * this.tower.getDifficulty()), boss.race);
        return ([enemy]);
    };
    GameLauncher.prototype.gameLoop = function () {
        while (!this.tower.gameOver() && !this.tower.getEndGame()) {
            while (!this.tower.nexLvl() && !this.tower.gameOver() && !this.tower.getEndGame()) {
                this.tower.turnOrder();
                console.log("========== floor ".concat(this.tower.getLvl(), " =========="));
                this.displayMonster();
                if (this.tower.getListChar()[0] instanceof character_2.Hero) {
                    for (var i = 0; i < this.tower.getListHe().length; i++) {
                        this.displayHealth(this.tower.getListHe()[i]);
                    }
                }
                for (var i = 0; i < this.tower.getListChar().length; i++) {
                    if (!this.tower.getEndGame() && !this.tower.gameOver() && this.tower.getListChar()[i].speedCheck()) {
                        while (this.gestionDeTour(this.tower.getListChar()[i]) === false) { }
                    }
                    if (!this.tower.getEndGame() && !this.tower.getListChar()[i].getPlayedTurn()) {
                        while (this.gestionDeTour(this.tower.getListChar()[i]) === false) { }
                        this.tower.getListChar()[i].setPlayedTurn(true);
                        this.tower.getListChar()[i].cleanEffect();
                        this.tower.getListChar()[i].checkEffect(this.tower.getListChar()[i].getEffect());
                    }
                    if (this.tower.getListChar()[i] instanceof character_1.Enemy && this.tower.getListChar()[0] instanceof character_1.Enemy) {
                        for (var i_4 = 0; i_4 < this.tower.getListHe().length; i_4++) {
                            this.displayHealth(this.tower.getListHe()[i_4]);
                        }
                    }
                }
                if (!this.tower.getEndGame()) {
                    this.betweenTurn();
                }
            }
            if (this.tower.nexLvl() && this.tower.getLvl() + 1 % 10 !== 0) {
                this.tower.createFloor(this.generateEnemy());
                this.betweenLvl();
                console.clear();
            }
            else if (this.tower.nexLvl() && this.tower.getLvl() + 1 % 10 === 0) {
                this.tower.createFloor(this.generateBosses());
            }
            else if (this.tower.nexLvl() && this.tower.getLvl() > 9 && this.tower.getDifficulty() !== 2) {
                console.log('VICTORY');
                this.tower.exit();
            }
        }
        this.tower.exit();
    };
    GameLauncher.prototype.betweenTurn = function () {
        this.tower.getListChar().forEach(function (character) {
            character.setPlayedTurn(false);
        });
        this.tower.getListHe().forEach(function (character) {
            character.setPlayedTurn(false);
        });
        this.tower.getlistEn().forEach(function (character) {
            character.setPlayedTurn(false);
        });
        var turn = readline.question('==== Next turn ====\n');
    };
    GameLauncher.prototype.generateLoot = function (hero) {
        var _this = this;
        var lootList = [];
        var randomCons1 = Math.floor(Math.random() * this.lootJson[0].Consumable.length);
        var randomCons2 = Math.floor(Math.random() * this.lootJson[0].Consumable.length);
        var randomEq = Math.floor(Math.random() * this.lootJson[0].Equipement.length);
        var cons1 = new equipement_1.Consumable(this.lootJson[0].Consumable[randomCons1].name, this.lootJson[0].Consumable[randomCons1].effect, this.lootJson[0].Consumable[randomCons1].type);
        var cons2 = new equipement_1.Consumable(this.lootJson[0].Consumable[randomCons2].name, this.lootJson[0].Consumable[randomCons2].effect, this.lootJson[0].Consumable[randomCons2].type);
        lootList.push(cons1, cons2);
        var classList = this.generateClass();
        if (this.lootJson[0].Equipement[randomEq].roleRequirement === 'all') {
            var eq = new equipement_1.Equipement(this.lootJson[0].Equipement[randomEq].name, this.lootJson[0].Equipement[randomEq].effect, hero.getRole(), this.lootJson[0].Equipement[randomEq].type);
            lootList.push(eq);
        }
        else {
            classList.forEach(function (role) {
                if (role.name === _this.lootJson[0].Equipement[randomEq].roleRequirement) {
                    var newRole = new class_1.Class(role.name, role.bonus, role.specialMove);
                    var eq = new equipement_1.Equipement(_this.lootJson[0].Equipement[randomEq].name, _this.lootJson[0].Equipement[randomEq].effect, newRole, _this.lootJson[0].Equipement[randomEq].type);
                    lootList.push(eq);
                }
            });
        }
        return (lootList);
    };
    GameLauncher.prototype.displayLoot = function (lootList) {
        var lootListName = [];
        lootList.forEach(function (element) {
            lootListName.push(element.getName());
        });
        console.log("you loot " + c.yellow("".concat(lootListName.join(' | '))));
    };
    GameLauncher.prototype.addLoot = function (lootList, hero) {
        lootList.forEach(function (item) {
            if (readline.keyInYN("would you like to take " + c.yellow("".concat(item.getName())))) {
                if (item instanceof equipement_1.Consumable) {
                    hero.addConsumable(item);
                    console.log("you add ".concat(item.name, " to your inventory"));
                }
                else if (item instanceof equipement_1.Equipement) {
                    hero.equipItem(item);
                }
            }
        });
    };
    GameLauncher.prototype.betweenLvl = function () {
        var _this = this;
        var odds = Math.floor(Math.random() * 100);
        if (odds <= 40) {
            var lootime = readline.question('==== looting time ====\n');
            this.tower.getListHe().forEach(function (hero) {
                console.log("======== ".concat(hero.getName(), " is looting ========"));
                var lootListe = _this.generateLoot(hero);
                _this.displayLoot(lootListe);
                _this.addLoot(lootListe, hero);
            });
        }
        console.log("You enter the ".concat(this.tower.getLvl(), " floor"));
        this.tower.getListHe().forEach(function (hero) {
            hero.restoreMp();
            hero.restoreHp();
            console.log("".concat(hero.getName(), " get back to ") + c.green("".concat(hero.getHp())) + "hp and " + c.cyan("".concat(hero.getMp())) + " Mana");
        });
        var nextTurn = readline.question('==== Next floor ====\n');
    };
    GameLauncher.prototype.displayHealth = function (char) {
        var barre = '';
        var magi = '';
        for (var i = 0; i < char.getHp(); i++) {
            barre += 'I';
        }
        for (var i = 0; i < char.getHpMax() - char.getHp(); i++) {
            barre += '_';
        }
        for (var i = 0; i < char.getMp(); i++) {
            magi += '=';
        }
        for (var i = 0; i < char.getMpMax() - char.getMp(); i++) {
            magi += '_';
        }
        barre += '|';
        magi += '|';
        if (char instanceof character_2.Hero) {
            console.log(c.yellow(char.getName()));
        }
        else if (char instanceof character_1.Enemy) {
            console.log(c.magenta(char.getName()));
        }
        if (char.getHp() > Math.floor(char.getHpMax() / 2)) {
            console.log("HP " + c.green("".concat(barre)) + " ".concat(char.getHp(), "/").concat(char.getHpMax()));
        }
        else if (char.getHp() <= Math.floor(char.getHpMax() / 2) && char.getHp() > Math.floor(char.getHpMax() / 4)) {
            console.log("HP " + c.yellow("".concat(barre)) + " ".concat(char.getHp(), "/").concat(char.getHpMax()));
        }
        else {
            console.log("HP " + c.red("".concat(barre)) + " ".concat(char.getHp(), "/").concat(char.getHpMax()));
        }
        if (char instanceof character_2.Hero) {
            console.log("MANA : " + c.cyan(magi) + " ".concat(char.getMp(), "/").concat(char.getMpMax()));
        }
    };
    GameLauncher.prototype.displayMonster = function () {
        var _this = this;
        var max = 0;
        var maxI = 0;
        this.tower.getlistEn().forEach(function (monster, i) {
            if (monster.getHp() > max) {
                max = monster.getHp();
                maxI = i;
            }
        });
        console.log(this.tower.getlistEn()[maxI].getSprite());
        this.tower.getlistEn().forEach(function (monster) {
            _this.displayHealth(monster);
        });
    };
    GameLauncher.prototype.launcher = function (tower, gamelauncher) {
        var _this = this;
        while (gamelauncher.continue === true) {
            console.log(c.magenta("      \r\n                                       /@\r\n                       __        __   /\\/\r\n                      /==\\      /  \\_/\\/   \r\n                    /======\\    \\/\\__ \\__\r\n                  /==/\\  /\\==\\    /\\_|__ \\\r\n               /==/    ||    \\=\\ / / / /_/\r\n             /=/    /\\ || /\\   \\=\\/ /     \r\n          /===/   /   \\||/   \\   \\===\\\r\n        /===/   /_________________ \\===\\\r\n     /====/   / |                /  \\====\\\r\n   /====/   /   |  _________    /  \\   \\===\\    THE LEGEND OF \r\n   /==/   /     | /   /  \\ / / /  __________\\_____      ______       ___\r\n  |===| /       |/   /____/ / /   \\   _____ |\\   /      \\   _ \\      \\  \\\r\n   \\==\\             /\\   / / /     | |  /= \\| | |        | | \\ \\     / _ \\\r\n   \\===\\__    \\    /  \\ / / /   /  | | /===/  | |        | |  \\ \\   / / \\ \\\r\n     \\==\\ \\    \\\\ /____/   /_\\ //  | |_____/| | |        | |   | | / /___\\ \\\r\n     \\===\\ \\   \\\\\\\\\\\\\\/   /////// /|  _____ | | |        | |   | | |  ___  |\r\n       \\==\\/     \\\\\\\\/ / //////   \\| |/==/ \\| | |        | |   | | | /   \\ |\r\n       \\==\\     _ \\\\/ / /////    _ | |==/     | |        | |  / /  | |   | |\r\n         \\==\\  / \\ / / ///      /|\\| |_____/| | |_____/| | |_/ /   | |   | |\r\n         \\==\\ /   / / /________/ |/_________|/_________|/_____/   /___\\ /___\\\r\n           \\==\\  /               | /==/\r\n           \\=\\  /________________|/=/    \r\n             \\==\\     _____     /==/ \r\n            / \\===\\   \\   /   /===/\r\n           / / /\\===\\  \\_/  /===/\r\n          / / /   \\====\\ /====/\r\n         / / /      \\===|===/\r\n         |/_/         \\===/\r\n                        =  "));
            var exit = readline.question('              press start to continue\n');
            if (exit === 'quit') {
                gamelauncher.continue = false;
            }
            else {
                var actionList = ['New game', 'Continue'];
                var action = readline.keyInSelect(actionList, '', { cancel: false });
                if (action === 0) {
                    this.difficultyChoice();
                    gamelauncher.gameStart();
                    gamelauncher.gameLoop();
                }
                else {
                    if (this.save.loadData()) {
                        this.save.getListChar().forEach(function (char) {
                            if (char.class === 'Enemy') {
                                var enemyMoves = [];
                                for (var i = 0; i < _this.movesJson.length; i++) {
                                    if (_this.movesJson[i].category === 'Damage' && (_this.movesJson[i].user === 'all' || _this.movesJson[i].user === 'Monster')) {
                                        var move = new move_1.Move(_this.movesJson[i].dmg, _this.movesJson[i].name, _this.movesJson[i].category, _this.movesJson[i].MpCost, _this.movesJson[i].Type, _this.movesJson[i].effect, _this.movesJson[i].user);
                                        enemyMoves.push(move);
                                    }
                                }
                                var sprite = '';
                                for (var i = 0; i < _this.enemieJson.length; i++) {
                                    if (_this.enemieJson[i].name === char.name) {
                                        sprite = _this.enemieJson[i].sprite;
                                    }
                                }
                                var mob = new character_1.Enemy(char.name, char.hp, char.hpMax, char.str, enemyMoves, sprite, [], char.mp, char.mpMax, char.int, char.def, char.res, char.spd, char.luck, char.race);
                                mob.setIsProtected(char.isProtected);
                                mob.setPlayedTurn(char.playedTurn);
                                _this.tower.addEnemy(mob);
                            }
                            else if (char.class === 'Boss') {
                                var enemyMoves = [];
                                for (var i = 0; i < _this.movesJson.length; i++) {
                                    if (_this.movesJson[i].category === 'Damage' && (_this.movesJson[i].user === 'all' || _this.movesJson[i].user === 'Monster')) {
                                        var move = new move_1.Move(_this.movesJson[i].dmg, _this.movesJson[i].name, _this.movesJson[i].category, _this.movesJson[i].MpCost, _this.movesJson[i].Type, _this.movesJson[i].effect, _this.movesJson[i].user);
                                        enemyMoves.push(move);
                                    }
                                }
                                var sprite = '';
                                for (var i = 0; i < _this.bossJson.length; i++) {
                                    if (_this.bossJson[i].name === char.name) {
                                        sprite = _this.bossJson[i].sprite;
                                    }
                                }
                                var boss = new character_1.Enemy(char.name, char.hp, char.hpMax, char.str, enemyMoves, sprite, [], char.mp, char.mpMax, char.int, char.def, char.res, char.spd, char.luck, char.race);
                                boss.setIsProtected(char.isProtected);
                                boss.setPlayedTurn(char.playedTurn);
                                _this.tower.addEnemy(boss);
                            }
                            else if (char.class === 'Hero') {
                                var role_1 = new class_1.Class('', [], '');
                                var heroMoves = [];
                                _this.generateClass().forEach(function (element) {
                                    if (char.role === element.name) {
                                        role_1 = element;
                                    }
                                });
                                for (var i = 0; i < _this.movesJson.length; i++) {
                                    if (_this.movesJson[i].user === 'all' || _this.movesJson[i].user === 'Hero') {
                                        var move = new move_1.Move(_this.movesJson[i].dmg, _this.movesJson[i].name, _this.movesJson[i].category, _this.movesJson[i].MpCost, _this.movesJson[i].Type, _this.movesJson[i].effect, _this.movesJson[i].user);
                                        heroMoves.push(move);
                                    }
                                }
                                var sprite = '';
                                for (var i = 0; i < _this.playerJson.length; i++) {
                                    if (_this.playerJson[i].name === char.name) {
                                        sprite = _this.playerJson[i].sprite;
                                    }
                                }
                                var hero_2 = new character_2.Hero(char.name, char.hp, char.hpMax, char.str, heroMoves, sprite, [], char.mp, char.mpMax, char.int, char.def, char.res, char.spd, char.luck, char.race, role_1);
                                char.Consumable.forEach(function (item) {
                                    _this.lootJson[0].Consumable.forEach(function (itemJson) {
                                        if (item === itemJson.name) {
                                            var cons = new equipement_1.Consumable(itemJson.name, itemJson.effect, itemJson.type);
                                            hero_2.addConsumable(cons);
                                        }
                                    });
                                });
                                char.Equipement.forEach(function (item) {
                                    _this.lootJson[0].Equipement.forEach(function (itemJson) {
                                        if (item === itemJson.name) {
                                            var cons = new equipement_1.Equipement(itemJson.name, itemJson.effect, itemJson.roleRequirement, itemJson.type);
                                            hero_2.addEquipment(cons);
                                        }
                                    });
                                });
                                hero_2.setIsProtected(char.isProtected);
                                hero_2.setPlayedTurn(char.playedTurn);
                                hero_2.applyClass(false);
                                _this.tower.addHero(hero_2);
                            }
                        });
                        this.tower.setDifficulty(this.save.getDiff());
                        this.gameLoop();
                    }
                }
                if (tower.gameOver()) {
                    console.log('Try again the kingdom needs you');
                }
            }
        }
    };
    GameLauncher.prototype.gestionDeTour = function (char) {
        var actionList = ['ATTACK', 'STATUS', 'ITEMS', 'RUN', 'SAVE AND EXIT'];
        if (char instanceof character_2.Hero) {
            var action = readline.keyInSelect(actionList, '---- choose an action ----', { cancel: false });
            var _loop_2 = function () {
                var charListName = [];
                this_2.tower.getListChar().forEach(function (charname) {
                    charListName.push(charname.getName());
                });
                var charToWatch = readline.keyInSelect(charListName, '---- Analyse ----', { cancel: false });
                this_2.tower.getListChar()[charToWatch].status(this_2);
                action = readline.keyInSelect(actionList, '---- choose an action ----', { cancel: false });
            };
            var this_2 = this;
            while (action === 1) {
                _loop_2();
            }
            if (action === 0) {
                if (!char.chooseMove(this.tower)) {
                    return false;
                }
            }
            else if (action === 3) {
                this.runAway();
                this.betweenLvl();
                return true;
            }
            else if (action === 4) {
                this.save.createSave(this.tower);
                this.tower.setEndGame(true);
                this.continue = false;
                return true;
            }
            else if (action === 2) {
                if (char.getItems().length > 0) {
                    var ans = char.printInventory();
                    if (ans !== -1) {
                        char.useConsumable(char.getItems()[ans]);
                        return true;
                    }
                    return false;
                }
                else {
                    console.log('you have no item');
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            char.chooseMove(this.tower);
        }
        this.tower.deleteChar();
    };
    return GameLauncher;
}());
exports.GameLauncher = GameLauncher;
