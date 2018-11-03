"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("typegoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const common_1 = require("../controllers/common");
const constants_1 = require("./constants");
let UserSchema = class UserSchema extends typegoose_1.Typegoose {
};
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "userId", void 0);
__decorate([
    typegoose_1.prop({ required: true, unique: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "username", void 0);
UserSchema = __decorate([
    typegoose_1.plugin(mongoose_unique_validator_1.default, { message: common_1.ValidationErrors.USERNAME_DUPLICATED })
], UserSchema);
exports.User = new UserSchema().getModelForClass(UserSchema, constants_1.enableTimestamps);
exports.default = exports.User;
//# sourceMappingURL=User.js.map