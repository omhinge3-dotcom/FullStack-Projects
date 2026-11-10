
require("dotenv").config();

const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing");

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN
});

async function migrateListings() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("Connected to MongoDB");

        // Find listings that don't have geometry
        const listings = await Listing.find({
            $or: [
                { geometry: { $exists: false } },
                { geometry: null }
            ]
        });

        console.log(`Found ${listings.length} listings to migrate`);

        let updated = 0;
        let skipped = 0;

        for (let listing of listings) {

            if (!listing.location || !listing.country) {
                console.log(`Skipped: ${listing.title} - Missing location`);
                skipped++;
                continue;
            }

            try {
                const response = await geocodingClient.forwardGeocode({
                    query: `${listing.location}, ${listing.country}`,
                    limit: 1
                }).send();

                const feature = response.body.features[0];

                if (!feature) {
                    console.log(`Location not found: ${listing.location}`);
                    skipped++;
                    continue;
                }

                await Listing.updateOne(
                    { _id: listing._id },
                    {
                        $set: {
                            geometry: feature.geometry
                        }
                    }
                );

                console.log(`Updated: ${listing.title} - ${listing.location}`);

                updated++;

            } catch (error) {
                console.log(`Failed: ${listing.title}`, error.message);
                skipped++;
            }
        }

        console.log("\nMigration completed!");
        console.log(`Successfully updated: ${updated}`);
        console.log(`Skipped: ${skipped}`);

    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    }
}

migrateListings();
