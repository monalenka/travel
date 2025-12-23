import { Request, Response } from 'express';
import Tour, { ITour, TourCategory, TourDifficulty } from '../models/Tour';

interface FilterOptions {
    category?: TourCategory;
    difficulty?: TourDifficulty;
    minPrice?: number;
    maxPrice?: number;
    durationMin?: number;
    durationMax?: number;
    languages?: string[];
    tags?: string[];
    isPopular?: boolean;
    isFeatured?: boolean;
    search?: string;
}

const checkAdminAccess = (req: Request): boolean => {
    const token = req.headers['x-admin-token'] || (req as any).cookies?.adminToken;
    return token === process.env.ADMIN_PASSWORD;
};

export const getTours = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            page = '1',
            limit = '12',
            category,
            difficulty,
            minPrice,
            maxPrice,
            durationMin,
            durationMax,
            languages,
            tags,
            isPopular,
            isFeatured,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const filter: any = { isActive: true };

        if (category) {
            filter.categories = { $in: [category] };
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (minPrice || maxPrice) {
            filter.basePrice = {};
            if (minPrice) filter.basePrice.$gte = Number(minPrice);
            if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
        }

        if (durationMin || durationMax) {
            filter.durationInHours = {};
            if (durationMin) filter.durationInHours.$gte = Number(durationMin);
            if (durationMax) filter.durationInHours.$lte = Number(durationMax);
        }

        if (languages) {
            filter.languages = { $in: Array.isArray(languages) ? languages : [languages] };
        }

        if (tags) {
            filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
        }

        if (isPopular === 'true') filter.isPopular = true;
        if (isFeatured === 'true') filter.isFeatured = true;

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        const sortOptions: any = {};
        sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const isAdmin = checkAdminAccess(req);
        if (isAdmin) {
            delete filter.isActive;
        }

        const tours = await Tour.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .select('-__v')
            .lean();

        const total = await Tour.countDocuments(filter);

        res.json({
            success: true,
            data: tours,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            },
            filters: req.query
        });

    } catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tours',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Tour.distinct('categories');

        const categoryDetails = categories.map(cat => ({
            id: cat,
            name: cat.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            count: 0
        }));

        res.json({
            success: true,
            data: categoryDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
};

export const getTourBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        const tour = await Tour.findOne({ slug })
            .select('-__v')
            .lean();

        if (!tour) {
            res.status(404).json({
                success: false,
                error: 'Tour not found'
            });
            return;
        }

        const isAdmin = checkAdminAccess(req);
        if (!isAdmin && !tour.isActive) {
            res.status(404).json({
                success: false,
                error: 'Tour not found'
            });
            return;
        }

        const relatedTours = await Tour.find({
            _id: { $ne: tour._id },
            categories: { $in: tour.categories },
            isActive: true
        })
            .limit(4)
            .select('title slug coverImage basePrice duration rating')
            .lean();

        res.json({
            success: true,
            data: {
                ...tour,
                relatedTours
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tour',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = checkAdminAccess(req);
        if (!isAdmin) {
            res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
            return;
        }

        const tourData = req.body;

        if (!tourData.slug && tourData.title) {
            tourData.slug = tourData.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
        }

        const tour = new Tour({
            ...tourData,
            createdBy: 'admin'
        });

        await tour.save();

        res.status(201).json({
            success: true,
            data: tour,
            message: 'Tour created successfully'
        });

    } catch (error: any) {
        if (error.message.includes('duplicate key')) {
            res.status(400).json({
                success: false,
                error: 'Tour with this slug already exists'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to create tour',
            message: error.message
        });
    }
};

export const updateTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = checkAdminAccess(req);
        if (!isAdmin) {
            res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
            return;
        }

        const { id } = req.params;
        const updateData = req.body;

        updateData.lastModifiedBy = 'admin';
        updateData.lastModifiedAt = new Date();

        const tour = await Tour.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!tour) {
            res.status(404).json({
                success: false,
                error: 'Tour not found'
            });
            return;
        }

        res.json({
            success: true,
            data: tour,
            message: 'Tour updated successfully'
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: 'Failed to update tour',
            message: error.message
        });
    }
};

export const deleteTour = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = checkAdminAccess(req);
        if (!isAdmin) {
            res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
            return;
        }

        const { id } = req.params;

        const tour = await Tour.findByIdAndUpdate(
            id,
            {
                isActive: false,
                lastModifiedBy: 'admin',
                lastModifiedAt: new Date()
            },
            { new: true }
        );

        if (!tour) {
            res.status(404).json({
                success: false,
                error: 'Tour not found'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Tour deactivated successfully'
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete tour',
            message: error.message
        });
    }
};

export const getTourStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = checkAdminAccess(req);
        if (!isAdmin) {
            res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
            return;
        }

        const stats = await Tour.aggregate([
            {
                $group: {
                    _id: null,
                    totalTours: { $sum: 1 },
                    activeTours: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    },
                    popularTours: {
                        $sum: { $cond: [{ $eq: ['$isPopular', true] }, 1, 0] }
                    },
                    avgPrice: { $avg: '$basePrice' },
                    avgRating: { $avg: '$rating' },
                    totalBookings: { $sum: '$bookingCount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalTours: 1,
                    activeTours: 1,
                    popularTours: 1,
                    avgPrice: { $round: ['$avgPrice', 2] },
                    avgRating: { $round: ['$avgRating', 2] },
                    totalBookings: 1
                }
            }
        ]);

        const categoryStats = await Tour.aggregate([
            { $unwind: '$categories' },
            {
                $group: {
                    _id: '$categories',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                ...(stats[0] || {}),
                categories: categoryStats
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stats',
            message: error.message
        });
    }
};