"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourDifficulty = exports.TourCategory = void 0;
const mongoose_1 = require("mongoose");
var TourCategory;
(function (TourCategory) {
    TourCategory["SMALL_GROUP"] = "small-group";
    TourCategory["PRIVATE"] = "private";
    TourCategory["SHORE_EXCURSION"] = "shore-excursion";
    TourCategory["DESTINATION"] = "destination";
})(TourCategory || (exports.TourCategory = TourCategory = {}));
var TourDifficulty;
(function (TourDifficulty) {
    TourDifficulty["EASY"] = "easy";
    TourDifficulty["MODERATE"] = "moderate";
    TourDifficulty["DIFFICULT"] = "difficult";
})(TourDifficulty || (exports.TourDifficulty = TourDifficulty = {}));
const TourSchema = new mongoose_1.Schema({
    title: { type: String, required: true, index: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    itinerary: [{
        time: { type: String, required: true },
        activity: { type: String, required: true },
        description: { type: String, required: true }
    }],
    categories: [{
        type: String,
        enum: Object.values(TourCategory),
        required: true
    }],
    tags: [{ type: String, index: true }],
    difficulty: {
        type: String,
        enum: Object.values(TourDifficulty),
        default: TourDifficulty.EASY
    },
    basePrice: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'EUR' },
    stripePriceId: { type: String },
    stripeProductId: { type: String },
    includeTaxes: { type: Boolean, default: true },
    duration: { type: String, required: true },
    durationInHours: { type: Number, required: true, min: 1 },
    groupSize: { type: String, required: true },
    maxGroupSize: { type: Number, required: true, min: 1 },
    languages: [{ type: String }],
    meetingPoint: { type: String, required: true },
    includes: [{ type: String }],
    excludes: [{ type: String }],
    whatToBring: [{ type: String }],
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    videoUrl: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isPopular: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    bookingCount: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true, index: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    seoKeywords: [{ type: String }],
    createdBy: { type: String },
    lastModifiedBy: { type: String },
    lastModifiedAt: { type: Date }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

TourSchema.virtual('discountPercentage').get(function () {
    if (!this.discountPrice || this.discountPrice >= this.basePrice)
        return 0;
    return Math.round((1 - this.discountPrice / this.basePrice) * 100);
});

TourSchema.index({ categories: 1, isActive: 1 });
TourSchema.index({ isPopular: 1, isActive: 1 });
TourSchema.index({ rating: -1, isActive: 1 });
TourSchema.index({ basePrice: 1, isActive: 1 });
exports.default = mongoose_1.default.model('Tour', TourSchema);
