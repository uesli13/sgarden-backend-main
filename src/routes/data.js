import express from "express";
import Sentry from "@sentry/node";

const router = express.Router({ mergeParams: true });

const generateRandomData = (min = 0, max = 10) => Math.random() * (max - min) + min;

router.get("/", async (req, res) => {
	try {
        const localFoodCropProduction = {
            March: Array.from({ length: 100 }, () => generateRandomData(0, 10)),
            April: Array.from({ length: 100 }, () => generateRandomData(0, 10)),
            May: Array.from({ length: 100 }, () => generateRandomData(0, 10)),
        };

        const comparisonOfIrrigationWaterVsNeeds = {
            March: { etc: generateRandomData(0, 100), irrigation: generateRandomData(0, 100), rainfall: generateRandomData(0, 100) },
            April: { etc: generateRandomData(0, 100), irrigation: generateRandomData(0, 100), rainfall: generateRandomData(0, 100) },
            May: { etc: generateRandomData(0, 100), irrigation: generateRandomData(0, 100), rainfall: generateRandomData(0, 100) },
            June: { etc: generateRandomData(0, 100), irrigation: generateRandomData(0, 100), rainfall: generateRandomData(0, 100) },
            July: { etc: generateRandomData(0, 100), irrigation: generateRandomData(0, 100), rainfall: generateRandomData(0, 100) },
            August: { etc: generateRandomData(0, 100), irrigation: generateRandomData(0, 100), rainfall: generateRandomData(0, 100) },
        };

        const timePlot = {
            meteo: Array.from({ length: 20 }, () => generateRandomData(0, 100)),
            inSitu: Array.from({ length: 20 }, () => generateRandomData(0, 100)),
            generated: Array.from({ length: 20 }, () => generateRandomData(0, 100)),
        };

        return res.json({
            success: true,
            localFoodCropProduction,
            comparisonOfIrrigationWaterVsNeeds,
            timePlot,
        });
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
