import cron from "node-cron";
import { User } from "../models/users/user.model.js";


export function startCronJobs() {
    cron.schedule("0 0 * * *", async () => {
        try {
            const THIRTY_DAYS_AGO = new Date();
            THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

            const deletedUsers = await User.deleteMany({
                isDeleted: true,
                deletedAt: { $lte: THIRTY_DAYS_AGO }
            });

            console.log(`Deleted ${deletedUsers.deletedCount} users permanently.`);
        } catch (error) {
            console.error("Error deleting old users:", error);
        }
    });
}

