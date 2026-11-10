const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {

    const { category, search } = req.query;

    let filter = {};

    // Category filtering
    if (category) {
        filter.categories = category;
    }

    // Search filtering
    if (search && search.trim() !== "") {

        const searchRegex = new RegExp(
            search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i"
        );

        filter.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { description: searchRegex }
        ];
    }

    const allListings = await Listing.find(filter);

    res.render("./listings/index.ejs", {
        allListings,
        selectedCategory: category || "All",
        search: search || ""
    });

};

module.exports.renderNewForm = (req, res) => {

    res.render("./listings/new.ejs")
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        });

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing)
    res.render("./listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let { location, country } = req.body.listing;

    let response = await geocodingClient.forwardGeocode({
        query: `${location}, ${country}`,
        limit: 1
    }).send();

    // Check whether Mapbox found the location
    if (response.body.features.length === 0) {
        req.flash("error", "Location not found. Please enter a valid location!");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    newListing.image = { url, filename }

    newListing.geometry = response.body.features[0].geometry

    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "New Listing Created!")
    res.redirect("/listings")


}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("./listings/edit.ejs", { listing, originalImageUrl })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save();
    }

    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}