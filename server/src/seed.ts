import mongoose from 'mongoose';
import Tour from './models/Tour.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/nice-tours';


const testTours = [
    {
        title: "Monaco & Monte-Carlo Premium Tour",
        description: "Experience luxury and glamour on this premium tour to Monaco and Monte Carlo. Visit the Prince's Palace, the Monte Carlo Casino, and enjoy breathtaking views from the Rock of Monaco.",
        highlights: [
            "Prince's Palace of Monaco",
            "Monte Carlo Casino (exterior visit)",
            "Formula 1 Grand Prix circuit drive",
            "Rock of Monaco with panoramic views"
        ],
        categories: ["small-group", "private"],
        difficulty: "easy",
        basePrice: 129,
        duration: "Full Day (8 hours)",
        durationInHours: 8,
        groupSize: "Small Group (max 8)",
        maxGroupSize: 8,
        languages: ["English", "French", "Spanish"],
        meetingPoint: "Your hotel in Nice or meeting point in Nice city center",
        includes: [
            "Professional licensed guide",
            "Transport in luxury minivan",
            "Bottled water",
            "Hotel pickup and drop-off"
        ],
        excludes: ["Lunch", "Casino entry fee", "Personal expenses"],
        coverImage: "images/tours/monaco-premium.jpg",
        rating: 4.9,
        reviewCount: 156,
        isPopular: true,
        isFeatured: true,
        slug: "monaco-monte-carlo-premium-tour",
        tags: ["monaco", "casino", "luxury", "formula1"]
    },
    {
        title: "Private French Riviera Discovery",
        description: "A completely private tour tailored to your interests. Choose from Cannes, Saint-Tropez, Antibes, or create your own itinerary with our expert local guide.",
        highlights: [
            "100% private - just your group",
            "Fully customizable itinerary",
            "Luxury vehicle with chauffeur",
            "Skip-the-line access to attractions"
        ],
        categories: ["private"],
        difficulty: "easy",
        basePrice: 450,
        duration: "Full Day (10 hours)",
        durationInHours: 10,
        groupSize: "Private (1-6 people)",
        maxGroupSize: 6,
        languages: ["English", "French", "German", "Italian", "Russian"],
        meetingPoint: "Your hotel or chosen location",
        includes: [
            "Private expert guide",
            "Luxury vehicle with professional driver",
            "All parking and toll fees",
            "Customized itinerary planning"
        ],
        excludes: ["Meals", "Entrance fees", "Gratuities"],
        coverImage: "images/tours/private-riviera.jpg",
        rating: 5.0,
        reviewCount: 89,
        isPopular: true,
        slug: "private-french-riviera-discovery",
        tags: ["private", "luxury", "custom", "chauffeur"]
    },
    {
        title: "Shore Excursion: Nice & Villefranche-sur-Mer",
        description: "Perfect for cruise passengers! Explore Nice's Old Town and the picturesque fishing village of Villefranche-sur-Mer with guaranteed return to your ship.",
        highlights: [
            "Guaranteed return to cruise ship",
            "Promenade des Anglais",
            "Old Town of Nice (Vieux Nice)",
            "Villefranche-sur-Mer harbor"
        ],
        categories: ["shore-excursion"],
        difficulty: "moderate",
        basePrice: 99,
        duration: "5 hours",
        durationInHours: 5,
        groupSize: "Small Group (max 12)",
        maxGroupSize: 12,
        languages: ["English", "French"],
        meetingPoint: "Nice Cruise Port",
        includes: [
            "Port pickup and drop-off",
            "Professional guide",
            "Walking tour",
            "Guaranteed return to ship"
        ],
        excludes: ["Food and drinks", "Gratuities"],
        coverImage: "images/tours/shore-nice.jpg",
        rating: 4.8,
        reviewCount: 204,
        isPopular: true,
        slug: "shore-excursion-nice-villefranche",
        tags: ["cruise", "shore", "nice", "villefranche"]
    },
    {
        title: "Wine Tour: Provence Vineyards",
        description: "Discover the famous wines of Provence. Visit two family-run wineries, taste premium wines, and enjoy the stunning countryside.",
        highlights: [
            "Two winery visits with tastings",
            "Learn wine-making process",
            "Scenic drive through Provence countryside",
            "Lunch in a traditional village"
        ],
        categories: ["destination", "small-group"],
        difficulty: "easy",
        basePrice: 159,
        discountPrice: 139,
        duration: "Full Day (9 hours)",
        durationInHours: 9,
        groupSize: "Small Group (max 8)",
        maxGroupSize: 8,
        languages: ["English", "French"],
        meetingPoint: "Nice city center",
        includes: [
            "Transportation",
            "Winery visits",
            "Wine tastings (8+ wines)",
            "Expert wine guide"
        ],
        excludes: ["Lunch", "Additional purchases"],
        coverImage: "images/tours/provence-wine.jpg",
        rating: 4.7,
        reviewCount: 92,
        isPopular: false,
        slug: "provence-wine-tour-vineyards",
        tags: ["wine", "provence", "vineyard", "tasting"]
    },
    {
        title: "Eze & Saint-Paul-de-Vence Medieval Villages",
        description: "Step back in time visiting two of the most beautiful medieval villages on the French Riviera.",
        highlights: [
            "Eze village - perched eagle's nest",
            "Fragonard Perfume Factory",
            "Saint-Paul-de-Vence artists' village",
            "Medieval architecture and art galleries"
        ],
        categories: ["small-group", "destination"],
        difficulty: "moderate",
        basePrice: 119,
        duration: "7 hours",
        durationInHours: 7,
        groupSize: "Small Group (max 8)",
        maxGroupSize: 8,
        languages: ["English", "French", "Spanish"],
        meetingPoint: "Nice Tourist Office",
        includes: [
            "Transport",
            "Professional guide",
            "Eze entry fee",
            "Perfume factory visit"
        ],
        excludes: ["Lunch", "Personal shopping"],
        coverImage: "images/tours/eze-saint-paul.jpg",
        rating: 4.9,
        reviewCount: 178,
        isPopular: true,
        slug: "eze-saint-paul-de-vence-medieval",
        tags: ["medieval", "village", "art", "perfume"]
    },
    {
        title: "Private Cannes & Antibes Film Festival Tour",
        description: "Discover the glamour of Cannes and the charm of Antibes. Visit the Film Festival Palace, walk the Croisette, and explore Picasso Museum.",
        highlights: [
            "Cannes Film Festival Palace",
            "La Croisette Boulevard",
            "Antibes Old Town",
            "Picasso Museum (optional)"
        ],
        categories: ["private"],
        difficulty: "easy",
        basePrice: 380,
        duration: "8 hours",
        durationInHours: 8,
        groupSize: "Private (1-4 people)",
        maxGroupSize: 4,
        languages: ["English", "French"],
        meetingPoint: "Your hotel",
        includes: [
            "Private vehicle with driver/guide",
            "Hotel pickup and drop-off",
            "All parking fees",
            "Flexible schedule"
        ],
        excludes: ["Museum entry fees", "Meals"],
        coverImage: "images/tours/cannes-film-festival.jpg",
        rating: 4.8,
        reviewCount: 67,
        isPopular: false,
        slug: "private-cannes-antibes-film-festival",
        tags: ["cannes", "film", "antibes", "private"]
    },
    {
        title: "Shore Excursion: Monaco & Eze from Monte Carlo",
        description: "For cruise passengers docking in Monte Carlo. Explore Monaco and the medieval village of Eze with stress-free return to port.",
        highlights: [
            "Monaco's Prince's Palace",
            "Monte Carlo Casino district",
            "Eze medieval village",
            "Oceanographic Museum view"
        ],
        categories: ["shore-excursion"],
        difficulty: "moderate",
        basePrice: 115,
        duration: "6 hours",
        durationInHours: 6,
        groupSize: "Small Group (max 10)",
        maxGroupSize: 10,
        languages: ["English", "French", "Italian"],
        meetingPoint: "Monte Carlo Cruise Port",
        includes: [
            "Port pickup and drop-off",
            "Transportation",
            "Professional guide",
            "Eze entry"
        ],
        excludes: ["Casino entry", "Museum fees", "Lunch"],
        coverImage: "images/tours/shore-monaco-eze.jpg",
        rating: 4.7,
        reviewCount: 143,
        isPopular: true,
        slug: "shore-excursion-monaco-eze",
        tags: ["cruise", "monaco", "monte-carlo", "eze"]
    },
    {
        title: "Gourmet Food Tour of Nice",
        description: "A culinary journey through Nice. Taste local specialties, visit markets, and learn about Niçoise cuisine.",
        highlights: [
            "Cours Saleya Market",
            "Local specialties tasting",
            "Olive oil and wine tasting",
            "Traditional Niçoise cooking demo"
        ],
        categories: ["destination", "small-group"],
        difficulty: "easy",
        basePrice: 89,
        duration: "4 hours",
        durationInHours: 4,
        groupSize: "Small Group (max 6)",
        maxGroupSize: 6,
        languages: ["English", "French"],
        meetingPoint: "Nice Old Town",
        includes: [
            "All food tastings (10+ items)",
            "Wine and olive oil tasting",
            "Expert food guide",
            "Recipe cards"
        ],
        excludes: ["Additional purchases", "Gratuities"],
        coverImage: "images/tours/nice-food-tour.jpg",
        rating: 4.9,
        reviewCount: 231,
        isPopular: true,
        slug: "gourmet-food-tour-nice",
        tags: ["food", "wine", "market", "nice"]
    },
    {
        title: "Private Luxury Yacht Tour",
        description: "Experience the French Riviera from the sea. Private yacht tour along the coast with swimming stops and champagne.",
        highlights: [
            "Private yacht with captain",
            "Coastal views from the sea",
            "Swimming stops in secluded bays",
            "Champagne and snacks onboard"
        ],
        categories: ["private"],
        difficulty: "easy",
        basePrice: 1200,
        duration: "4 hours",
        durationInHours: 4,
        groupSize: "Private (up to 8 guests)",
        maxGroupSize: 8,
        languages: ["English", "French"],
        meetingPoint: "Nice Port or Antibes Port",
        includes: [
            "Private yacht rental",
            "Professional captain",
            "Champagne and snacks",
            "Fuel and port fees"
        ],
        excludes: ["Additional food/drinks", "Crew gratuity"],
        coverImage: "images/tours/private-yacht.jpg",
        rating: 5.0,
        reviewCount: 45,
        isPopular: false,
        slug: "private-luxury-yacht-tour",
        tags: ["yacht", "luxury", "sea", "private"]
    },
    {
        title: "Mercantour National Park Day Hike",
        description: "Escape to the mountains! Guided hike in Mercantour National Park with stunning alpine scenery and wildlife.",
        highlights: [
            "Guided mountain hike",
            "Alpine lakes and waterfalls",
            "Wildlife spotting",
            "Traditional mountain lunch"
        ],
        categories: ["destination"],
        difficulty: "difficult",
        basePrice: 145,
        duration: "10 hours",
        durationInHours: 10,
        groupSize: "Small Group (max 6)",
        maxGroupSize: 6,
        languages: ["English", "French"],
        meetingPoint: "Nice train station",
        includes: [
            "Transportation to/from park",
            "Professional hiking guide",
            "Park fees",
            "Hiking poles if needed"
        ],
        excludes: ["Hiking shoes", "Lunch", "Personal equipment"],
        coverImage: "images/tours/mercantour-hike.jpg",
        rating: 4.6,
        reviewCount: 78,
        isPopular: false,
        slug: "mercantour-national-park-hike",
        tags: ["hiking", "mountains", "nature", "alpine"]
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        await Tour.deleteMany({});
        console.log('🗑️  Cleared existing tours');

        await Tour.insertMany(testTours);
        console.log(`✅ Added ${testTours.length} test tours`);

        const categories = {
            'small-group': testTours.filter(t => t.categories.includes('small-group')).length,
            'private': testTours.filter(t => t.categories.includes('private')).length,
            'shore-excursion': testTours.filter(t => t.categories.includes('shore-excursion')).length,
            'destination': testTours.filter(t => t.categories.includes('destination')).length
        };

        console.log('📊 Category breakdown:');
        for (const [cat, count] of Object.entries(categories)) {
            console.log(`   ${cat}: ${count} tours`);
        }

        console.log('🎉 Database seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();