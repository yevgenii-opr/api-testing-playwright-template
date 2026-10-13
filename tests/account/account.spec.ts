import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { AccountDto } from '../dto/account-dto'

test('get account info with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  // Specify auth header as X-API-KEY type
  const response = await request.get('https://shop.tl-academy.ee/api/accounts/1', {
    headers: { 'X-API-KEY': 'my-api-key' },
  })

  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status, body and headers
  console.log('response body:', responseBody)
  // Check if the response status is 200
  expect(statusCode).toBe(StatusCodes.OK)
})

test('create account with correct payload should receive code 201', async ({ request }) => {
  // Build and send a GET request to the server
  // Specify auth header as X-API-KEY type
  const response = await request.post('https://shop.tl-academy.ee/api/accounts', {
    headers: { 'X-API-KEY': 'my-api-key' },
    data: new AccountDto('Mark', 'USD'),
  })

  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status, body and headers
  console.log('response body:', responseBody)
  const accountId = responseBody.id
  console.log('account id: ', accountId)
  // Check if the response status is 201
  expect(statusCode).toBe(StatusCodes.CREATED)

  //STEP 2: deposit to account we just created
  const responseDeposit = await request.post(
    `https://shop.tl-academy.ee/api/accounts/${accountId}/deposit`,
    {
      headers: { 'X-API-KEY': 'my-api-key' },
      data: { amount: 100 },
    },
  )

  const responseBodyDeposit = await responseDeposit.json()
  const statusCodeDeposit = responseDeposit.status()

  console.log('response deposit body:', responseBodyDeposit)
  expect(statusCodeDeposit).toBe(StatusCodes.OK)
})
