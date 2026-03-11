import { initSalable, Version } from '@salable/node-sdk';

const salable = initSalable(process.env.SALABLE_API_KEY || '', Version.V3);

export interface CheckoutOptions {
	bountyId: string;
	amount: number;
	bountyTitle: string;
	successUrl: string;
	cancelUrl: string;
}

export async function createBountyCheckout(options: CheckoutOptions) {
	const planUuid = process.env.SALABLE_BOUNTY_PLAN_UUID;
	const ownerId = process.env.SALABLE_OWNER_ID;

	if (!planUuid) {
		throw new Error('SALABLE_BOUNTY_PLAN_UUID not configured');
	}

	if (!ownerId) {
		throw new Error('SALABLE_OWNER_ID not configured');
	}

	try {
		const checkoutData = await salable.plans.getCheckoutLink(planUuid, {
			successUrl: options.successUrl,
			cancelUrl: options.cancelUrl,
			granteeId: options.bountyId,
			owner: ownerId,
			customerEmail: '',
			currency: 'usd'
		});

		return checkoutData;
	} catch (error) {
		console.error('Salable checkout error:', error);
		throw error;
	}
}

export async function checkPaymentStatus(subscriptionId: string) {
	try {
		const subscription = await salable.subscriptions.getOne(subscriptionId);
		return subscription;
	} catch (error) {
		console.error('Salable payment check error:', error);
		return null;
	}
}
