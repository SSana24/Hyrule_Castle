"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
var Move = /** @class */ (function () {
    function Move(dmg, name, cat, mpCost, type, effect, user) {
        this.dmg = dmg;
        this.name = name;
        this.cat = cat;
        this.mpCost = mpCost;
        this.type = type;
        this.effect = effect;
        this.user = user;
    }
    Move.prototype.getUser = function () {
        return this.user;
    };
    Move.prototype.getDmg = function () {
        return this.dmg;
    };
    Move.prototype.getMpCost = function () {
        return this.mpCost;
    };
    Move.prototype.getName = function () {
        return this.name;
    };
    Move.prototype.getCat = function () {
        return this.cat;
    };
    Move.prototype.getType = function () {
        return this.type;
    };
    Move.prototype.getEffect = function () {
        return this.effect;
    };
    return Move;
}());
exports.Move = Move;
