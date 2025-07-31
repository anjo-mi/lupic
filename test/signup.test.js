const {test, expect} = require('@playwright/test');

test('user can sign up successfully', async( { page } ) => {
	await page.goto('http://localhost:2121');

	await page.click('text=Sign Up');

	await page.fill('input[name="userName"]', 'nwright');
	await page.fill('input[name="email"]', 'nwright@pw.com');
	await page.fill('input[name="password"]', 'nwright1');
	await page.fill('input[name="confirmPassword"]', 'nwright1');

	await page.click('input[type="submit"]');
	const content = await page.textContent('body');
	console.log({content})
	await expect(page).toHaveURL('http://localhost:2121/groups');
})