import { Request, Response } from 'express';

// временные моковые данные
const mockTours = [
    {
        _id: '1',
        title: 'Обзорная экскурсия по Москве',
        description: 'Знакомство с главными достопримечательностями столицы',
        price: 2500,
        duration: 4,
        images: ['https://picsum.photos/seed/tour1/400/300'],
        isActive: true
    },
    {
        _id: '2',
        title: 'Ночная экскурсия по Санкт-Петербургу',
        description: 'Волшебство белых ночей и разводных мостов',
        price: 3200,
        duration: 3,
        images: ['https://picsum.photos/seed/tour2/400/300'],
        isActive: true
    },
    {
        _id: '3',
        title: 'Золотое кольцо России',
        description: 'Путешествие по древним русским городам',
        price: 15000,
        duration: 24,
        images: ['https://picsum.photos/seed/tour3/400/300'],
        isActive: true
    }
];

export const getTours = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.json(mockTours);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch tours',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getTourById = async (req: Request, res: Response): Promise<void> => {
    try {
        const tourId = req.params.id;
        const tour = mockTours.find(t => t._id === tourId);

        if (!tour) {
            res.status(404).json({ error: 'Tour not found' });
            return;
        }

        res.json(tour);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch tour',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};