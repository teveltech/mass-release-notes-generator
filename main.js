"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var generator_1 = require("./src/generator");
var core = require("@actions/core");
var change = /** @class */ (function () {
    function change(module, old_version, new_version) {
        this.module = module;
        this.old_version = old_version;
        this.new_version = new_version;
    }
    return change;
}());
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var changes, token, owner, changes_arr, changes_obj, changes_str_arr, changes_str;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    changes = core.getInput('changes');
                    token = core.getInput('token');
                    owner = core.getInput('owner');
                    changes_arr = changes.replace(/"|'|`/g, '').trim().split('\n');
                    changes_obj = changes_arr.map(function (change_str) {
                        return new change(change_str.substring(0, change_str.search(': ')).trim(), change_str
                            .substring(change_str.search(': ') + 2, change_str.search(' -> '))
                            .trim(), change_str.substring(change_str.search(' -> ') + 4).trim());
                    });
                    changes_str_arr = Promise.all(changes_obj.map(function (change) {
                        return generator_1.generate(change.module + ': ' + change.old_version + ' -> ' + change.new_version, owner + '/' + change.module, change.old_version, change.new_version, token);
                    }));
                    return [4 /*yield*/, changes_str_arr];
                case 1:
                    changes_str = (_a.sent())
                        .filter(function (change) { return !change.includes('Action failed'); })
                        .map(function (change) {
                        return change
                            .replace('# [', '## [') // smaller title
                            .replace(/\) \([0-9]{4}-[0-9]{2}-[0-9]{2}\)/, ')');
                    } // remove date
                    )
                        .join('\n');
                    core.setOutput('release_notes', changes_str);
                    return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
run();
