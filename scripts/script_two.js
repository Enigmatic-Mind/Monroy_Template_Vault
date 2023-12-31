module.exports = async (params) => {
    const {
        quickAddApi: { inputPrompt },
        quickAddApi: { yesNoPrompt },
        app,
    } = params;

    const fs = require('fs');
    const path = require('path');

    const yearWeek = await inputPrompt("📅 YYYY-WW (e.g. 2023-52)");
    const [year, weekNumber] = yearWeek.split('-').map(part => parseInt(part));

    if (isNaN(year) || isNaN(weekNumber)) {
        console.error("Invalid input. Please enter in YYYY-WW format.");
        return;
    }

    const folderName = await inputPrompt("📁 Path to Folder From Vault Root");
    const vaultPath = params.app.vault.adapter.basePath;
    const yearPath = path.join(vaultPath, folderName.toString(), year.toString());

    const startDateOfWeek = getStartDateOfWeek(parseInt(year), parseInt(weekNumber));
    let weekFolderPath; // Declare weekFolderPath outside the loop

    for (let i = 0; i < 7; i++) {
        let currentDate = new Date(startDateOfWeek);
        currentDate.setDate(currentDate.getDate() + i);
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        const monthFolderPath = path.join(yearPath, `${dateString.substring(0, 7)}`);
        weekFolderPath = path.join(monthFolderPath, `W${String(weekNumber).padStart(2, '0')}`);
        if (!fs.existsSync(weekFolderPath)) {
            fs.mkdirSync(weekFolderPath, { recursive: true });
        }

        const dailyFilePath = path.join(weekFolderPath, `${dateString}.md`);
        const templateContent = await getTemplateContent(dateString, params.app);

        if (templateContent) {
            if(i == 0 && fs.existsSync(dailyFilePath)) {
                const continue_exec = await yesNoPrompt("File already exists. Overwrite?");
                if (!continue_exec) {
                    console.error(`Cancelled. File ${dailyFilePath} not overwritten.`);
                    return;
                }
            }
            fs.writeFileSync(dailyFilePath, templateContent);
        } else {
            console.error(`Failed to get template content for ${dateString}`);
        }
    }

    // Create the weekly summary file
    const weeklyFilePath = path.join(weekFolderPath, `W${String(weekNumber).padStart(2, '0')}.md`);
    if (weekFolderPath) {
        const weeklyTemplateContent = await getWeeklyTemplateContent(params.app);
        if (weeklyTemplateContent) {
            fs.writeFileSync(weeklyFilePath, weeklyTemplateContent);
        } else {
            console.error("Failed to get weekly template content");
        }
    } else {
        console.error("Failed to create weekly summary file due to missing weekFolderPath");
    }
};

async function getWeeklyTemplateContent(app) {
    const weeklyTemplatePath = 'templates/template week.md'; // Relative path from the root of the vault
    let weeklyTemplateContent;

    try {
        const weeklyTemplateFile = app.vault.getAbstractFileByPath(weeklyTemplatePath);

        if (weeklyTemplateFile && weeklyTemplateFile.extension === 'md') {
            weeklyTemplateContent = await app.vault.read(weeklyTemplateFile);
        } else {
            console.error("Weekly template file not found or is not a markdown file at path:", weeklyTemplatePath);
            return null;
        }
    } catch (error) {
        console.error("Error reading weekly template file:", error);
        return null;
    }

    return weeklyTemplateContent;
}

// Function to calculate the start date of a given week number
function getStartDateOfWeek(year, weekNumber) {
    // January 1st of the given year
    const firstDayOfYear = new Date(year, 0, 1);
    // Finding the first Monday of the year
    const firstMonday = new Date(firstDayOfYear);
    firstMonday.setDate(firstMonday.getDate() + (1 - firstMonday.getDay() + 7) % 7);

    // Calculate the start date of the given week
    const startDateOfWeek = new Date(firstMonday);
    startDateOfWeek.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

    return startDateOfWeek;
}

async function getTemplateContent(dateString, app) {
    const templateRelativePath = 'templates/template day.md'; // Relative path from the root of the vault
    let templateContent;

    try {
        const templateFile = app.vault.getAbstractFileByPath(templateRelativePath);

        if (templateFile && templateFile.extension === 'md') { // Check if file is a markdown file
            templateContent = await app.vault.read(templateFile);
        } else {
            console.error("Template file not found or is not a markdown file at path:", templateRelativePath);
            return null;
        }
    } catch (error) {
        console.error("Error reading template file:", error);
        return null;
    }

    const modifiedTemplateContent = templateContent
        .replace(/<% tp\.date\.now\("YYYY-MM-DD"\) %>/g, dateString)
        .replace(/(start = )this\.date/g, `$1date(${dateString})`);

    return modifiedTemplateContent;
}




// async function getTemplateContent(templatePath, dateString, app) {
//     let templateContent;

//     try {
//         // Retrieve the file based on the path
//         const templateFile = app.vault.getAbstractFileByPath(templatePath);

//         // Check if the file is a markdown file and exists
//         if (templateFile && templateFile instanceof app.vault.TFile) {
//             // Reading the template file content
//             templateContent = await app.vault.read(templateFile);
//         } else {
//             console.error("Template file not found or is not a markdown file at path:", templatePath);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error reading template file:", error);
//         return null;
//     }

//     // Replacing the placeholders
//     const modifiedTemplateContent = templateContent
//         .replace(/<% tp\.date\.now\("YYYY-MM-DD"\) %>/g, dateString)
//         .replace(/(start = )this\.date/g, `$1${dateString}`);

//     return modifiedTemplateContent;
// }




// Within each month/week, create files for the given (input) week.




// fs.mkdirSync(yearPath, { recursive: true });

// // Function to get ISO week number
// function getWeekNumber(d) {
//     d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
//     d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
//     var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
//     var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
//     return weekNo;
// }

// for (let month = 0; month < 12; month++) {
//     const monthPath = path.join(yearPath, `${year}-${String(month + 1).padStart(2, '0')}`);
//     fs.mkdirSync(monthPath, { recursive: true });

//     let day = new Date(year, month, 1);
//     while (day.getMonth() === month) {
//         const weekNumber = getWeekNumber(day);
//         const weekPath = path.join(monthPath, `${String(weekNumber).padStart(2, '0')}`);
//         fs.mkdirSync(weekPath, { recursive: true });

//         day.setDate(day.getDate() + 7); // Go to the next week
//     }
// }
// };