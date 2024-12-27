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
exports.Equipement = exports.Consumable = exports.Item = void 0;
var Item = /** @class */ (function () {
    function Item(name, effect) {
        this.name = name;
        this.effect = effect;
    }
    Item.prototype.getEffect = function () {
        return this.effect;
    };
    Item.prototype.getName = function () {
        return this.name;
    };
    return Item;
}());
exports.Item = Item;
var Consumable = /** @class */ (function (_super) {
    __extends(Consumable, _super);
    function Consumable(name, effect, type) {
        var _this = _super.call(this, name, effect) || this;
        _this.expired = false;
        _this.type = type;
        return _this;
    }
    Consumable.prototype.isExpired = function () {
        this.expired = true;
    };
    return Consumable;
}(Item));
exports.Consumable = Consumable;
var Equipement = /** @class */ (function (_super) {
    __extends(Equipement, _super);
    function Equipement(name, effect, rolerequirement, type) {
        var _this = _super.call(this, name, effect) || this;
        _this.equiped = false;
        _this.roleRequirement = rolerequirement;
        _this.type = type;
        return _this;
    }
    Equipement.prototype.equipe = function () {
        this.equiped = true;
    };
    return Equipement;
}(Item));
exports.Equipement = Equipement;
