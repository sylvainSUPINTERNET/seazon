import { Browser, chromium, ChromiumBrowser, LaunchOptions, Page } from 'playwright';



( async () => {

    const deliveryCity = "92130 - ISSY LES MOULINEAUX";

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

    // _1foib6e1 _1foib6e2
    // _1towkzva flexCenter _1towkzvd
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

    // TODO : out of stock ( must ignore ) 
    // Probleme quand on rajoute ça rajoute pas ( quand on change de date ) 

    await page.waitForTimeout(10000);

    // Scroll down the page
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
        });
    
    // Wait for some time to let the page finish scrolling
    await page.waitForTimeout(2000); // Adjust the timeout value as needed
      


    let clickedFirst = false;

    const buttonAddMeal = await page.$$('._1towkzva'); // Use the $$ method to select elements

    for (const btn of buttonAddMeal) {
    //   const textContent = await btn.evaluate((b) => b.textContent);
      
        if ( !clickedFirst ) {

            await btn.click(); // will open city since it's first time

            console.log("First item fill city info...")
            // Validate the city
            
            await page.waitForSelector('input[name="zipCode"]');
            await page.type('input[name="zipCode"]', deliveryCity);

            const btnValidateCity = await page.$$('#valider');
            await btnValidateCity[0].click();

            console.log("City info filled and validate")


            await page.waitForTimeout(5000);
            
            console.log("selecting regime ...")
            const changeNbOfMealsBtn = await page.$$('.price-0-2-570');
            await changeNbOfMealsBtn[0].click();

            await page.waitForTimeout(1500);

            console.log("choosing price");
            const meals14 = await page.$$('.planSelected14');
            console.log("meals14", meals14.length);
            await meals14[0].click();
            await page.waitForTimeout(1000);
            const mealRegimValidateBtn = await page.$$('#choisir_la_formule_14_plats')
            await mealRegimValidateBtn[0].click();

            await page.waitForTimeout(4000);

            clickedFirst = true;
            // select first item

            await btn.click();

            

        }
      
        console.log("Not first btn ...")
        await page.waitForTimeout(4000);

        await btn.click();
    }


    

    
/* 


    setTimeout( async () => {
        await browser.close();
    }, 5000) */



})();