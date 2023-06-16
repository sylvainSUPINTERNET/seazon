import { Browser, chromium, ChromiumBrowser, LaunchOptions, Page } from 'playwright';

( async () => {

    const today = new Date();
    const currentWeekday = today.getDay(); // Sunday: 0, Monday: 1, ..., Friday: 5
    const daysUntilNextFriday = (5 - currentWeekday + 7) % 7; // 5 represents Friday
    const daysToAdd = 7 + daysUntilNextFriday; // Add 7 days for two weeks
    const nextFriday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToAdd);

    console.log("Next Friday:", nextFriday.toDateString());

    // Define French locale options
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedDate = formatter.format(nextFriday);
    console.log(formattedDate.toString());

    const day = formattedDate.split(" ")[0];
    const monthName = formattedDate.split(" ")[1];
    const year = formattedDate.split(" ")[2];

    console.log(day)
    console.log(monthName)
    console.log(year)

    const options:LaunchOptions = {headless: false};

    const browser:Browser = await chromium.launch(options);
    const page: Page = await browser.newPage();
    await page.goto('https://stackoverflow.com/questions/68094951/how-to-get-playwright-to-use-the-value-for-headless-in-my-config-file');



    setTimeout( async () => {
        await browser.close();
    }, 5000)



})();