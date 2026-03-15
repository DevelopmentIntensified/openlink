import { env } from '$env/dynamic/private';

const SALABLE_API_URL = 'https://api.salable.app';

export interface CreateCheckoutOptions {
	amount: number;
	currency?: string;
	productName: string;
	bountyId: string;
	successUrl: string;
	cancelUrl: string;
}

export interface CheckoutResponse {
	checkoutId: string;
	url: string;
}

export async function createCheckout(options: CreateCheckoutOptions): Promise<CheckoutResponse> {
	const { amount, currency = 'usd', productName, bountyId, successUrl, cancelUrl } = options;
	
	if (!env.SALABLE_API_KEY) {
		throw new Error('SALABLE_API_KEY is not configured');
	}
	
	const response = await fetch(`${SALABLE_API_URL}/checkout-links`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${env.SALABLE_API_KEY}`,
			'x-salship-owner-uuid': env.SALABLE_OWNER_ID || ''
		},
		body: JSON.stringify({
			planUuid: env.SALABLE_BOUNTY_PLAN_UUID,
			paymentType: 'one-time',
			amount: amount,
			currency: currency.toUpperCase(),
			metadata: {
				bountyId,
				productName
			},
			successUrl,
			cancelUrl
		})
	});
	
	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to create checkout: ${error}`);
	}
	
	return response.json();
}

export async function getPayment(paymentId: string) {
	if (!env.SALABLE_API_KEY) {
		throw new Error('SALABLE_API_KEY is not configured');
	}
	
	const response = await fetch(`${SALABLE_API_URL}/payments/${paymentId}`, {
		headers: {
			'Authorization': `Bearer ${env.SALABLE_API_KEY}`
		}
	});
	
	if (!response.ok) {
		throw new Error('Failed to get payment');
	}
	
	return response.json();
}
