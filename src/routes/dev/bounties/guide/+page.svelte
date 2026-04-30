<script lang="ts">
	import type { UserWithRoles } from '$lib/server/rbac';
	export let data: { user: UserWithRoles };
</script>

<div class="guide-container">
	<h1>Bounty Workflow Guide</h1>
	<p class="subtitle">Learn how to find, claim, and complete bounties on BountyForge.</p>

	<div class="guide-section">
		<h2>1. Find a Bounty</h2>
		<p>Browse available bounties on the <a href="/dev/bounties">Bounties page</a>. Filter by skills, project, or priority.</p>
		<div class="tip">
			<strong>Tip:</strong> Set your skills in your <a href="/dev/profile">profile</a> to see matching bounties first.
		</div>
	</div>

	<div class="guide-section">
		<h2>2. Claim a Bounty</h2>
		<p>Found a bounty you want to work on? Click "Claim" to assign it to yourself.</p>
		<ul>
			<li>Only developers can claim bounties</li>
			<li>Once claimed, the status changes to "In Progress"</li>
			<li>Make sure you have the required skills before claiming</li>
		</ul>
	</div>

	<div class="guide-section">
		<h2>3. Submit Your Work</h2>
		<p>After completing the work, submit your solution with:</p>
		<ul>
			<li>Link to your Pull Request (PR)</li>
			<li>Notes describing your changes</li>
			<li>Any relevant documentation or tests</li>
		</ul>
		<div class="tip">
			<strong>Note:</strong> Sponsors review submissions and may request changes before approving.
		</div>
	</div>

	<div class="guide-section">
		<h2>4. Get Paid</h2>
		<p>Once the sponsor approves your submission:</p>
		<ul>
			<li>The bounty status changes to "Completed"</li>
			<li>Payment is released from escrow to your account</li>
			<li>You'll receive a notification when payment is processed</li>
		</ul>
	</div>

	<div class="guide-section">
		<h2>5. Dispute Resolution</h2>
		<p>If there's a disagreement about the submission:</p>
		<ul>
			<li>Sponsor can request changes with specific feedback</li>
			<li>Either party can escalate to dispute</li>
			<li>Partial payouts may be issued for incomplete work</li>
		</ul>
	</div>

	<div class="cta-section">
		<h2>Ready to Start?</h2>
		<p>Set up your profile and find your first bounty!</p>
		<a href="/dev/profile" class="btn">Complete Your Profile</a>
		<a href="/dev/bounties" class="btn secondary">Browse Bounties</a>
	</div>
</div>

<style>
	.guide-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
	}
	.subtitle {
		color: #666;
		margin-bottom: 2rem;
	}
	.guide-section {
		margin: 2rem 0;
		padding: 1.5rem;
		border-left: 4px solid #0070f3;
		background: #f9f9f9;
	}
	.guide-section h2 {
		margin-top: 0;
	}
	.tip {
		background: #e3f2fd;
		padding: 1rem;
		border-radius: 4px;
		margin-top: 1rem;
	}
	ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}
	.cta-section {
		text-align: center;
		margin: 3rem 0;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 8px;
	}
	.cta-section h2 {
		margin-top: 0;
	}
	.btn {
		display: inline-block;
		margin: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: white;
		color: #667eea;
		text-decoration: none;
		border-radius: 4px;
		font-weight: bold;
	}
	.btn.secondary {
		background: transparent;
		border: 2px solid white;
		color: white;
	}
	a {
		color: #0070f3;
	}
</style>
