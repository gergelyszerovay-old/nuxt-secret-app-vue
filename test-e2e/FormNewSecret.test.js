
const WebDriver = require('selenium-webdriver')
require('selenium-webdriver/firefox')
if (process.env.SELENIUM_HUB_URL === 'local') {
  require('geckodriver')
}
const { defineFeature, loadFeature } = require('jest-cucumber')
const { xClass, getElementCSS, getElementId, getElementXPath } = require('./helpers')

const capabilities = {
  build: 'Jest',
  browserName: 'chrome',
  video: true,
  network: true,
  console: true,
  visual: true
}

let rootURL

if (process.env.SELENIUM_HUB_URL === 'local') {
  rootURL = 'http://localhost:3000/'
} else {
  rootURL = process.env.APP_BASE_URL
}

const feature = loadFeature(__dirname + '/features/FormNewSecret.feature')

const givenVisitUrl = (ctx, given, url) => {
  given('I visit /', async () => {
    await ctx.driver.get(url)
  })
}

defineFeature(feature, (test) => {
  const ctx = {}

  beforeAll(async () => {
    if (process.env.SELENIUM_HUB_URL === 'local') {
      ctx.driver = await new WebDriver.Builder().forBrowser('firefox').build()
    } else {
      ctx.driver = new WebDriver.Builder()
        .usingServer(process.env.SELENIUM_HUB_URL)
        .withCapabilities(capabilities)
        .build()
    }
  }, 10000)

  afterAll(async () => {
    await ctx.driver.quit()
  }, 10000)

  test('The TTL field accepts only positive integers', ({ given, when, then }) => {
    // console.log(ctx);
    givenVisitUrl(ctx, given, rootURL)

    when(/^I enter into the TTL field: (.*)$/, async (ttl) => {
      const el = await getElementXPath(ctx.driver, '//*[@data-qa="a-form-model-item.expireAfter"]//input')
      await el.clear()
      await el.sendKeys(ttl)
    })

    then(/^The TTL field's error message is: (.*)$/, async (message) => {
      const el = await getElementXPath(ctx.driver, `//*[@data-qa="a-form-model-item.expireAfter"]//div${xClass('ant-form-explain')}`)
      expect(await el.getText()).toEqual(message)
    })
  })

  test('New secret creation', ({ given, when, then }) => {
    givenVisitUrl(ctx, given, rootURL)

    when('I fill the fields', async () => {
      const el = await getElementXPath(ctx.driver, '//*[@data-qa="a-form-model-item.secret"]//textarea')
      await el.clear()
      await el.sendKeys('text 1')

      const el2 = await getElementXPath(ctx.driver, '//*[@data-qa="a-form-model-item.expireAfter"]//input')
      await el2.clear()
      await el2.sendKeys(20)

      const el3 = await getElementXPath(ctx.driver, '//*[@data-qa="a-form-model-item.expireAfterViews"]//input')
      await el3.clear()
      await el3.sendKeys(3)
    })

    when('I press the Create secret button', async () => {
      const elSubmitButton = await getElementCSS(ctx.driver, '.ant-btn-primary')
      await elSubmitButton.click()
    })

    then('The app stores the new secret and shows its link', async () => {
      const el = await getElementXPath(ctx.driver, '//*[@data-qa="a-descriptions-item-a.hash"]')
      expect(await el.getText()).toEqual('900a4469df00ccbfd0c145c6d1e4b7953dd0afafadd7534e3a4019e8d38fc663')
    })
  })
})
