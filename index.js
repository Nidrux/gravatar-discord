require('dotenv').config();
const md5 = require('md5');
const path = require('path');
const request = require('request');
const fs = require('fs');
const chalk = require('chalk');
const config = require(path.join(__dirname, '/config.json'));
/* Functions */
let avatarURL = () => {
    let size = config.size || 512 //px
    let hash = md5(config.gravatarMail);
    let url = `${config.gravatarBaseURL + hash}.jpg?s=${size}`;
    return url;
}
let avatarToFile = () => {
    let dest = path.join(__dirname, '/img/avatar.jpg');
    let req = request.get(avatarURL());
    let file = fs.createWriteStream(dest);
    req.on('response', response => {
        if(response.statusCode !== 200) {
            console.log(chalk.red(`Response failed with status code [${response.statusCode}]`))
            return;
        }
        try {
            req.pipe(file);
        } catch (err) {
            console.log(chalk.red('Error:\n' + err));
        }
    });
    req.on('error', (err) => {
        fs.unlink(dest);
        console.log(chalk.red('Error:\n' + err));
    });
    file.on('error', err => {
        console.log(chalk.red('Error:\n' + err));
    })
    file.on('finish', () => {
        file.close();
        console.log(chalk.green('Succesfully fetched gravatar image'))
        generator.next();
    })
}
const { Builder, By, Key, Util, WebDriver } = require('selenium-webdriver');

async function setAvatar() {
    let driver = await new Builder().forBrowser("firefox").build();
    try {
        await driver.get('https://discord.com/login');
        await driver.findElement(By.name('email')).sendKeys(process.env.EMAIL);
        await driver.findElement(By.name('password')).sendKeys(process.env.PW);
        await driver.findElement(By.className('button-3k0cO7')).sendKeys(Key.ENTER);
        console.log(chalk.yellow('Logged in succesfully'))
        setTimeout(async () => {
            await driver.findElement(By.css("button[aria-label='User Settings']")).click();
            setTimeout(async () => {
                await driver.findElement(By.css('.userInfo-iCloHO button')).click();
                setTimeout(async () => {
                    await driver.findElement(By.className('fileInput-23-d-3')).sendKeys(path.join(__dirname, '/img/avatar.jpg'));
                    setTimeout(async () => {
                        await driver.findElement(By.css(".modalFooter-37WjOa button:nth-of-type(2)")).click();
                        console.log(chalk.green('Avatar has been updated'));
                        setTimeout(async () => {
                            await driver.findElement(By.css('.noticeRegion-1YviSH div div div:nth-of-type(2) button:nth-of-type(2)')).click();
                            setTimeout(() => {
                                 driver.quit();
                             }, 100);
                        }, 500);
                    }, 500);
                }, 500);
            }, 1000);
        }, 5000);
    } catch (err){
        console.log(chalk.red('Error: \n'+err));
    }
} 


/* Generator */
const generator = avatar();
function* avatar() {
    avatarToFile();
    yield 1;
    console.log(chalk.yellow('Changing your avatar... This may take a while.'))
    setAvatar();
}
generator.next();
