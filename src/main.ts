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

    const dayNb = formattedDate.split(" ")[0];
    const monthName = formattedDate.split(" ")[1];
    const year = formattedDate.split(" ")[2];

    const orderTargetDate = `${dayNb}${monthName}`;
    // 30 juin 2023
    // Vendredi 23 Juin

    const options:LaunchOptions = {headless: false};

    const browser:Browser = await chromium.launch(options);
    const page: Page = await browser.newPage();
    await page.goto('https://seazon.fr/menu');

    await page.waitForSelector('.selectContainer-0-2-148');
    await page.click('.selectContainer-0-2-148');


    const datesMenu = await page.$$('.root-0-2-156');

    for ( const element of datesMenu ) {
        let textEl = await element.innerText(); 
        if ( textEl != undefined ) {
            textEl = textEl.toLowerCase();
            const parsed = textEl.split(" ").filter( (el, i ) => i !=0).join("");
            if ( orderTargetDate ==  parsed) {
                await element.click();
            }
        }

    }

    
/* 


    setTimeout( async () => {
        await browser.close();
    }, 5000) */



})();