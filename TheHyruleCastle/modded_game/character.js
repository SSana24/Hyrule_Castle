"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = exports.Hero = exports.Character = void 0;
var move_1 = require("./move");
var readline = require('readline-sync');
var c = require('ansi-colors');
var Character = /** @class */ (function () {
    function Character(name, hp, hpMax, str, movePool, sprite, mp, mpMax, int, def, res, spd, luck, race) {
        this.id = Math.floor(Math.random() * 100);
        this.isProtected = false;
        this.playedTurn = false;
        this.effet = [];
        this.name = name;
        this.hp = hp;
        this.hpMax = hpMax;
        this.str = str;
        this.movePool = movePool;
        this.sprite = sprite;
        this.mp = mp;
        this.mpMax = mpMax;
        this.int = int;
        this.def = def;
        this.res = res;
        this.spd = spd;
        this.luck = luck;
        this.race = race;
    }
    Character.prototype.getMp = function () {
        return this.mp;
    };
    Character.prototype.getEffect = function () {
        return this.effet;
    };
    Character.prototype.getLuck = function () {
        return this.luck;
    };
    Character.prototype.getRace = function () {
        return this.race;
    };
    Character.prototype.setIsProtected = function (value) {
        this.isProtected = value;
    };
    Character.prototype.getMpMax = function () {
        return this.mpMax;
    };
    Character.prototype.getSprite = function () {
        return this.sprite;
    };
    Character.prototype.getId = function () {
        return this.id;
    };
    Character.prototype.getHpMax = function () {
        return this.hpMax;
    };
    Character.prototype.getHp = function () {
        return this.hp;
    };
    Character.prototype.getName = function () {
        return this.name;
    };
    Character.prototype.getSpeed = function () {
        return this.spd;
    };
    Character.prototype.getPlayedTurn = function () {
        return this.playedTurn;
    };
    Character.prototype.getInt = function () {
        return this.int;
    };
    Character.prototype.getStr = function () {
        return this.str;
    };
    Character.prototype.getDef = function () {
        return this.def;
    };
    Character.prototype.getRes = function () {
        return this.res;
    };
    Character.prototype.getIsProtected = function () {
        return this.isProtected;
    };
    Character.prototype.setPlayedTurn = function (value) {
        this.playedTurn = value;
    };
    Character.prototype.status = function (game) {
        console.log(':)');
    };
    Character.prototype.getHit = function (attack, striker) {
        if (this.manaCheck(attack, striker)) {
            var damage = attack.getDmg() * striker.damageModifier(this, attack);
            if (attack.getCat() === 'Damage') {
                this.hp = this.hp - Math.floor(damage - (damage * this.defense(attack, this)));
                this.setIsProtected(false);
                console.log("".concat(striker.name, " use ").concat(attack.getName(), " and do ") + c.red(Math.floor(damage - (damage * this.defense(attack, this)))) + " damage on ".concat(this.getName(), " "));
            }
            else if (attack.getCat() === 'Heal') {
                if (this.hp + Math.floor(this.hpMax / attack.getDmg()) > this.hpMax) {
                    this.hp = this.hpMax;
                }
                else {
                    this.hp += Math.floor(this.hpMax / attack.getDmg());
                }
                console.log("".concat(striker.name, " use ").concat(attack.getName(), " and do ") + c.green("".concat(Math.floor(this.hpMax / attack.getDmg()))) + " heal on ".concat(this.getName(), " "));
                this.manaCost(attack, striker);
            }
            else if (attack.getCat() === 'spell') {
                this.hp = this.hp - Math.floor(damage - (damage * this.defense(attack, this)));
                this.manaCost(attack, striker);
                console.log("".concat(striker.name, " launch ").concat(attack.getName(), " and do ") + c.red(Math.floor(damage - (damage * this.defense(attack, this)))) + " damage on ".concat(this.getName(), " "));
            }
            else if (attack.getCat() === 'debuff') {
                this.applyDebuff(attack, this);
            }
            this.giveEffect(attack);
            if (this.hp <= 0 && striker instanceof Hero) {
                striker.gainExp(Math.floor(Math.random() * 4) + 1);
                striker.lvlup();
            }
            return true;
        }
        return false;
    };
    Character.prototype.defense = function (move, striker) {
        var res = 0;
        if (move.getType() === 'physical') {
            res = this.def / 100;
        }
        else if (move.getType() === 'magic') {
            res = this.res / 100;
        }
        return res;
    };
    Character.prototype.damageModifier = function (cible, move) {
        var res = 0;
        if (move.getCat() === 'spell') {
            res = this.int;
        }
        else {
            res = this.str;
        }
        //crit
        var critOdds = Math.floor(Math.random() * 100);
        if (critOdds < this.luck) {
            res = res * 2;
            console.log("".concat(this.name, " make a ") + c.magenta("CRITICAL HIT !"));
        }
        if (cible.isProtected === true) {
            console.log(c.yellow("".concat(cible.getName(), " se prot\u00E8ge")));
            res = res / 2;
        }
        return res;
    };
    Character.prototype.applyDebuff = function (move, cible) {
        if (move.getEffect()[0] === 'str') {
            var effect = parseInt(move.getEffect()[1]);
            cible.str += effect;
        }
        else if (move.getEffect()[0] === 'spd') {
            var effect = parseInt(move.getEffect()[1]);
            cible.spd += effect;
        }
        else if (move.getEffect()[0] === 'int') {
            var effect = parseInt(move.getEffect()[1]);
            cible.int += effect;
        }
        else if (move.getEffect()[0] === 'mp') {
            var effect = parseInt(move.getEffect()[1]);
            cible.mp += effect;
        }
        else if (move.getEffect()[0] === 'luck') {
            var effect = parseInt(move.getEffect()[1]);
            cible.luck += effect;
        }
        else if (move.getEffect()[0] === 'def') {
            var effect = parseInt(move.getEffect()[1]);
            cible.def += effect;
        }
        else if (move.getEffect()[0] === 'res') {
            var effect = parseInt(move.getEffect()[1]);
            cible.res += effect;
        }
    };
    Character.prototype.dodgeCheck = function (cible, move) {
        var dodgeChance = cible.getSpeed() - this.spd;
        if (move.getCat() === 'spell') {
            dodgeChance = cible.getSpeed() - this.spd - 5;
        }
        if (Math.floor(Math.random() * 10) < dodgeChance) {
            console.log(c.yellow("".concat(this.name, " use ").concat(move.getName())));
            console.log(c.yellow("".concat(cible.name, " dodge the attack from ").concat(this.name)));
            return true;
        }
        else {
            return false;
        }
    };
    Character.prototype.manaCost = function (move, char) {
        if (char.mp - move.getMpCost() > 0) {
            char.mp -= move.getMpCost();
        }
        else {
            char.mp = 0;
        }
    };
    Character.prototype.manaCheck = function (move, char) {
        if (char.getMp() - move.getMpCost() >= 0) {
            return true;
        }
        console.log('not enougth mana choose another move');
        return false;
    };
    Character.prototype.attack = function (move, cible) {
        if (!this.dodgeCheck(cible, move)) {
            if (cible.getHit(move, this)) {
                return true;
            }
            else {
                return false;
            }
        }
        return true;
    };
    Character.prototype.cleanEffect = function () {
        var _this = this;
        this.effet.forEach(function (effect, i) {
            if (parseInt(effect[1]) <= 0) {
                if (effect[0] === 'Paralised') {
                    _this.applyEffect(['spd', '20']);
                    console.log("".concat(_this.name, " recover from ").concat(effect[0], " "));
                }
                else if (effect[0] === 'Sick') {
                    _this.applyEffect(['str', '4']);
                    _this.applyEffect(['def', '20']);
                    console.log("".concat(_this.name, " recover from ").concat(effect[0], " "));
                }
                else if (effect[0] === 'Enraged') {
                    _this.applyEffect(['str', '-20']);
                    _this.applyEffect(['luck', '-20']);
                    _this.applyEffect(['int', '40']);
                    console.log("".concat(_this.name, " recover from ").concat(effect[0], " "));
                }
                _this.effet.splice(i, 1);
            }
        });
    };
    Character.prototype.checkEffect = function (effect) {
        var _this = this;
        effect.forEach(function (element, i) {
            if (element[0] === 'Burn') {
                _this.applyEffect(['hp', '-2']);
                console.log("".concat(_this.name, " lose 2hp from ").concat(element[0], " "));
                var newDuration = parseInt(element[1]) - 1;
                effect.splice(i, 1, ["".concat(element[0]), "".concat(newDuration)]);
            }
            else if (element[0] === 'Paralised') {
                _this.applyEffect(['spd', '-10']);
                console.log("".concat(_this.name, " lose 10 spd from ").concat(element[0], " "));
                var newDuration = parseInt(element[1]) - 1;
                effect.splice(i, 1, ["".concat(element[0]), "".concat(newDuration)]);
            }
            else if (element[0] === 'Sick') {
                _this.applyEffect(['str', '-2']);
                _this.applyEffect(['def', '-10']);
                console.log("".concat(_this.name, " lose 2 str 10 def from ").concat(element[0], " "));
                var newDuration = parseInt(element[1]) - 1;
                effect.splice(i, 1, ["".concat(element[0]), "".concat(newDuration)]);
            }
            else if (element[0] === 'Enraged') {
                _this.applyEffect(['str', '10']);
                _this.applyEffect(['luck', '10']);
                _this.applyEffect(['int', '-20']);
                console.log("".concat(_this.name, " gain 10 str 10 luck and lose 20 int from ").concat(element[0], " "));
                var newDuration = parseInt(element[1]) - 1;
                effect.splice(i, 1, ["".concat(element[0]), "".concat(newDuration)]);
            }
        });
    };
    Character.prototype.giveEffect = function (move) {
        var odds = Math.floor(Math.random() * 100);
        if (odds < 40) {
            this.effet.push(move.getEffect());
            if (move.getEffect().length !== 0) {
                console.log("".concat(this.name, " got ").concat(move.getEffect()[0], " for ").concat(move.getEffect()[1], " turn"));
            }
        }
    };
    Character.prototype.applyEffect = function (effect) {
        var stat = effect[0];
        if (stat === "str") {
            this.str += parseInt(effect[1]);
        }
        if (stat === "spd") {
            this.spd += parseInt(effect[1]);
        }
        if (stat === "mpMax") {
            this.mpMax += parseInt(effect[1]);
        }
        if (stat === "def") {
            this.def += parseInt(effect[1]);
        }
        if (stat === "res") {
            this.res += parseInt(effect[1]);
        }
        if (stat === "luck") {
            this.luck += parseInt(effect[1]);
        }
        if (stat === "int") {
            this.int += parseInt(effect[1]);
        }
        if (stat === "hpMax") {
            this.hpMax += parseInt(effect[1]);
        }
        if (stat === "mp") {
            if (this.mp + parseInt(effect[1]) > this.mpMax) {
                this.mp = this.mpMax;
            }
            else {
                this.hp += parseInt(effect[1]);
            }
        }
        if (stat === "hp") {
            if (this.hp + parseInt(effect[1]) > this.hpMax) {
                this.hp = this.hpMax;
            }
            else {
                this.hp += parseInt(effect[1]);
            }
        }
    };
    Character.prototype.speedCheck = function () {
        var odds = Math.floor(Math.random() * 100);
        if (this.spd >= 15 && odds >= 50) {
            console.log(c.yellow("thanks to its speed ".concat(this.name, " gain a bonus action")));
            return true;
        }
        else if (this.spd >= 12 && odds >= 75) {
            console.log(c.yellow("thanks to its speed ".concat(this.name, " gain a bonus action")));
            return true;
        }
        else {
            return false;
        }
    };
    Character.prototype.chooseMove = function (lvl) {
        console.log("no");
        return true;
    };
    return Character;
}());
exports.Character = Character;
var Hero = /** @class */ (function (_super) {
    __extends(Hero, _super);
    function Hero(name, hp, hpMax, str, movePool, sprite, items, mp, mpMax, int, def, res, spd, luck, race, role) {
        var _this = _super.call(this, name, hp, hpMax, str, movePool, sprite, mp, mpMax, int, def, res, spd, luck, race) || this;
        _this.exp = 0;
        _this.equipement = [];
        _this.isProtected = false;
        _this.items = items;
        _this.role = role;
        return _this;
    }
    Hero.prototype.gainExp = function (value) {
        this.exp += value;
        console.log(c.yellow("".concat(this.name)) + " a gagn\u00E9 ".concat(value, " exp"));
    };
    Hero.prototype.lvlup = function () {
        if (this.exp >= 10) {
            this.exp = 0;
            var stat = ['str', 'int', 'spd', 'luck', 'hpMax', 'mpMax', 'def', 'res'];
            var augm = readline.keyInSelect(stat, c.yellow('vous avec gagnez un niveau ! quel stat augmenter ?'));
            this.applyEffect(["".concat(stat[augm]), "1"]);
            console.log("votre ".concat(stat[augm], " a augment\u00E9 de 1"));
        }
    };
    Hero.prototype.status = function (game) {
        var durationList = [];
        var moveLIst = [];
        var consList = [];
        var eqList = [];
        var effetList = [];
        this.effet.forEach(function (element) {
            effetList.push(element[0]);
        });
        this.effet.forEach(function (element) {
            durationList.push(element[1]);
        });
        this.items.forEach(function (item) {
            consList.push(item.getName());
        });
        this.equipement.forEach(function (eq) {
            eqList.push(eq.getName());
        });
        this.movePool.forEach(function (move) {
            moveLIst.push(move.getName());
        });
        console.log("_____________________________________________________________________________");
        console.log(this.sprite);
        game.displayHealth(this);
        console.log("STR : ".concat(this.str, " INT : ").concat(this.int, " DEF : ").concat(this.def, " RES : ").concat(this.res, " SPD : ").concat(this.spd, " LUCK : ").concat(this.luck, " RACE : ").concat(this.race, " CLASS : ").concat(this.role.name, "      |      moves : ").concat(moveLIst.join(' | ')));
        console.log("Inventory : ".concat(consList.join(' | '), " Equipement : ").concat(eqList.join(' | '), " DOT : ").concat(effetList, " : ").concat(durationList, " "));
        console.log("_____________________________________________________________________________");
    };
    Hero.prototype.getRole = function () {
        return this.role;
    };
    Hero.prototype.getEquipement = function () {
        return this.equipement;
    };
    Hero.prototype.addEquipment = function (eq) {
        this.equipement.push(eq);
    };
    Hero.prototype.chooseMove = function (lvl) {
        var movePoolName = [];
        var charName = [];
        for (var i = 0; i < this.movePool.length; i++) {
            movePoolName.push(this.movePool[i].getName());
        }
        for (var i = 0; i < lvl.getListChar().length; i++) {
            if (lvl.getListChar()[i] instanceof Hero) {
                charName.push(c.yellow("".concat(lvl.getListChar()[i].getName())) + c.cyan(" ".concat(lvl.getListChar()[i].getHp(), "/").concat(lvl.getListChar()[i].getHpMax())));
            }
            else {
                charName.push(c.red("".concat(lvl.getListChar()[i].getName())) + c.magenta(" ".concat(lvl.getListChar()[i].getHp(), "/").concat(lvl.getListChar()[i].getHpMax())));
            }
        }
        var movei = readline.keyInSelect(movePoolName, "---- tour de ".concat(this.name, " ----"));
        if (movei !== -1) {
            var move = this.movePool[movei];
            var ciblei = readline.keyInSelect(charName, "---- tour de ".concat(this.name, " ----"));
            var cible = lvl.getListChar()[ciblei];
            if (movei !== -1 && ciblei !== -1) {
                if (move.getCat() === 'protection') {
                    cible.setIsProtected(true);
                    return true;
                }
                else {
                    return this.attack(move, cible);
                }
            }
        }
        return false;
    };
    Hero.prototype.restoreMp = function () {
        if (this.mp + Math.floor(this.mpMax / 10) > this.mpMax) {
            this.mp = this.mpMax;
        }
        else {
            this.mp += Math.floor(this.mpMax / 10);
        }
    };
    Hero.prototype.restoreHp = function () {
        if (this.hp + Math.floor(this.hpMax / 5) > this.hpMax) {
            this.hp = this.hpMax;
        }
        else {
            this.hp += Math.floor(this.hpMax / 5);
        }
    };
    Hero.prototype.applyClass = function (val) {
        var _this = this;
        var spMove = new move_1.Move(this.role.specialMove.dmg, this.role.specialMove.name, this.role.specialMove.category, this.role.specialMove.MpCost, this.role.specialMove.Type, this.role.specialMove.effect, this.role.name);
        this.movePool.push(spMove);
        if (val) {
            this.role.bonus.forEach(function (stat) {
                if (stat === "str") {
                    _this.str += 5;
                }
                if (stat === "spd") {
                    _this.spd += 5;
                }
                if (stat === "mpMax") {
                    _this.mpMax += 5;
                }
                if (stat === "def") {
                    _this.def += 5;
                }
                if (stat === "res") {
                    _this.res += 5;
                }
                if (stat === "luck") {
                    _this.luck += 5;
                }
                if (stat === "int") {
                    _this.int += 5;
                }
                if (stat === "hpMax") {
                    _this.hpMax += 5;
                }
            });
        }
    };
    Hero.prototype.getItems = function () {
        return this.items;
    };
    Hero.prototype.addConsumable = function (item) {
        this.items.push(item);
    };
    Hero.prototype.equipItem = function (equipement) {
        var _this = this;
        var i = 0;
        if (this.equipement.length !== 0) {
            while (i < this.equipement.length && this.equipement.length === 0 || equipement.type !== this.equipement[i].type) {
                i++;
            }
            if (i === this.equipement.length) {
                console.log("".concat(equipement.name, " equiped"));
                this.equipement.push(equipement);
                equipement.effect.forEach(function (ef) {
                    _this.applyEffect(ef);
                });
            }
            else {
                if (readline.keyInYN("would you like to replace your ".concat(this.equipement[i].getName(), " by ").concat(equipement.name))) {
                    this.exchangeEquipement(equipement);
                }
                else {
                    console.log('you didn\'t replace it');
                }
            }
        }
        else {
            console.log("".concat(equipement.name, " equiped"));
            this.equipement.push(equipement);
            equipement.effect.forEach(function (ef) {
                _this.applyEffect(ef);
            });
        }
    };
    Hero.prototype.exchangeEquipement = function (equipement) {
        var _this = this;
        var i = 0;
        while (equipement.type !== this.equipement[i].type && i < this.equipement.length) {
            i++;
        }
        if (i === this.equipement.length) {
            console.log("no ".concat(equipement.type, " found"));
        }
        else {
            this.equipement[i].getEffect().forEach(function (element) {
                var inverser = parseInt(element[1]) * (-1);
                var disapply = [element[0], "".concat(inverser)];
                _this.applyEffect(disapply);
            });
            this.equipement.splice(i, 1, equipement);
            console.log("".concat(equipement.name, " equiped"));
            this.equipement.push(equipement);
            equipement.effect.forEach(function (ef) {
                _this.applyEffect(ef);
            });
        }
    };
    Hero.prototype.printInventory = function () {
        var inventoryName = [];
        this.items.forEach(function (element) {
            inventoryName.push(element.getName());
        });
        var ans = readline.keyInSelect(inventoryName, '-------- INVENTORY --------');
        return ans;
    };
    Hero.prototype.cleanInventory = function () {
        var _this = this;
        this.items.forEach(function (element, i) {
            if (element.expired) {
                _this.items.splice(i, 1);
            }
        });
    };
    Hero.prototype.useConsumable = function (item) {
        var _this = this;
        if (!item.expired) {
            item.effect.forEach(function (element) {
                _this.applyEffect(element);
            });
            item.isExpired();
            this.cleanInventory();
        }
        else {
            console.log("already used item");
        }
    };
    return Hero;
}(Character));
exports.Hero = Hero;
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(name, hp, hpMax, str, movePool, sprite, items, mp, mpMax, int, def, res, spd, luck, race) {
        var _this = _super.call(this, name, hp, hpMax, str, movePool, sprite, mp, mpMax, int, def, res, spd, luck, race) || this;
        _this.rage = false;
        _this.isProtected = false;
        _this.items = items;
        return _this;
    }
    Enemy.prototype.chooseMove = function (lvl) {
        var movei = Math.floor(Math.random() * this.movePool.length);
        var move = this.movePool[movei];
        if (lvl.getListHe().length !== 0) {
            var ciblei = Math.floor(Math.random() * lvl.getListHe().length);
            var cible = lvl.getListHe()[ciblei];
            return this.attack(move, cible);
        }
        else {
            console.log('eating your corpses');
            return false;
        }
    };
    Enemy.prototype.status = function (game) {
        var moveLIst = [];
        var effetList = [];
        this.effet.forEach(function (element) {
            effetList.push(element[0]);
        });
        this.movePool.forEach(function (move) {
            moveLIst.push(move.getName());
        });
        console.log("_____________________________________________________________________________");
        console.log(this.sprite);
        game.displayHealth(this);
        console.log("STR : ".concat(this.str, " INT : ").concat(this.int, " DEF : ").concat(this.def, " RES : ").concat(this.res, " SPD : ").concat(this.spd, " RACE : ").concat(this.race, "      |      moves : ").concat(moveLIst.join(' ')));
        console.log("DOT : ".concat(effetList));
        console.log("_____________________________________________________________________________");
    };
    return Enemy;
}(Character));
exports.Enemy = Enemy;
