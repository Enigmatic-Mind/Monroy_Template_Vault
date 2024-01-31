module.exports = async (params) => {
    const {
        quickAddApi: { inputPrompt },
        app,
    } = params;

    const year = await inputPrompt("📅 Year");
    const folderName = await inputPrompt("📁 Path to Folder From Vault Root");
    const vaultPath = params.app.vault.adapter.basePath;

    const fs = require('fs');
    const path = require('path');

    var yearPath = path.join(vaultPath, folderName.toString());
    yearPath = path.join(yearPath, year.toString());
    fs.mkdirSync(yearPath, { recursive: true });

    // Function to get ISO week number
    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
        return weekNo;
    }

    for (let month = 0; month < 12; month++) {
        const monthPath = path.join(yearPath, `${year}-${String(month + 1).padStart(2, '0')}`);
        fs.mkdirSync(monthPath, { recursive: true });

        let day = new Date(year, month, 1);
        while (day.getMonth() === month) {
            const weekNumber = getWeekNumber(day);
            const weekPath = path.join(monthPath, `W${String(weekNumber).padStart(2, '0')}`);
            fs.mkdirSync(weekPath, { recursive: true });

            day.setDate(day.getDate() + 7); // Go to the next week
        }
    }
};