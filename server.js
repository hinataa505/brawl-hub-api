const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const BRAWL_API_KEY = process.env.BRAWL_API_KEY;

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "🔥 Brawl Hub API çalışıyor!"
    });
});

app.get("/api/player/:tag", async (req, res) => {
    try {
        if (!BRAWL_API_KEY) {
            return res.status(500).json({
                error: "BRAWL_API_KEY Render'da ayarlanmamış."
            });
        }

        let tag = decodeURIComponent(req.params.tag)
            .trim()
            .toUpperCase();

        if (!tag.startsWith("#")) {
            tag = "#" + tag;
        }

        const encodedTag = encodeURIComponent(tag);

        const response = await fetch(
            `https://api.brawlstars.com/v1/players/${encodedTag}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${BRAWL_API_KEY}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.reason || "Brawl Stars API hatası",
                details: data
            });
        }

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Sunucu hatası"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Brawl Hub API ${PORT} portunda çalışıyor.`);
});
