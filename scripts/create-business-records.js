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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function createBusinessRecords() {
    return __awaiter(this, void 0, void 0, function () {
        var businessOwners, _i, businessOwners_1, user, business, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 9]);
                    console.log('Finding business owners without business records...');
                    return [4 /*yield*/, prisma.user.findMany({
                            where: {
                                role: client_1.Role.BUSINESS_OWNER,
                                business: null, // Users who don't have a business
                                managedBusiness: null // Users who don't manage a business
                            }
                        })];
                case 1:
                    businessOwners = _a.sent();
                    console.log("Found ".concat(businessOwners.length, " business owners without business records."));
                    _i = 0, businessOwners_1 = businessOwners;
                    _a.label = 2;
                case 2:
                    if (!(_i < businessOwners_1.length)) return [3 /*break*/, 5];
                    user = businessOwners_1[_i];
                    console.log("Creating business record for user: ".concat(user.name, " (").concat(user.email, ")"));
                    return [4 /*yield*/, prisma.business.create({
                            data: {
                                name: "".concat(user.name, "'s Business"),
                                description: 'Auto-generated business record',
                                address: 'Please update your business address',
                                phone: 'Please update your business phone',
                                email: user.email,
                                website: '',
                                logo: '',
                                owner: {
                                    connect: { id: user.id }
                                },
                                settings: {
                                    create: {
                                        currency: 'USD',
                                        timeZone: 'UTC',
                                        workingHours: JSON.stringify({
                                            monday: { start: '09:00', end: '17:00', isOpen: true },
                                            tuesday: { start: '09:00', end: '17:00', isOpen: true },
                                            wednesday: { start: '09:00', end: '17:00', isOpen: true },
                                            thursday: { start: '09:00', end: '17:00', isOpen: true },
                                            friday: { start: '09:00', end: '17:00', isOpen: true },
                                            saturday: { start: '10:00', end: '15:00', isOpen: false },
                                            sunday: { start: '10:00', end: '15:00', isOpen: false }
                                        }),
                                        bookingNotice: 60, // 1 hour notice
                                        slotDuration: 30, // 30 minute slots
                                        maxBookingsPerDay: 20
                                    }
                                }
                            }
                        })];
                case 3:
                    business = _a.sent();
                    console.log("Created business: ".concat(business.name, " (ID: ").concat(business.id, ")"));
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log('Business records creation completed successfully.');
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error creating business records:', error_1);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, prisma.$disconnect()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
createBusinessRecords()
    .then(function () { return console.log('Script execution completed.'); })
    .catch(function (error) { return console.error('Script execution failed:', error); });
