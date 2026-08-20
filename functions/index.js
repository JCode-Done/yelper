const { onRequest } = require('firebase-functions/v2/https');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

admin.initializeApp();
const firestore = admin.firestore();

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');
const revenuecatWebhookAuth = defineSecret('REVENUECAT_WEBHOOK_AUTH');
const stripePriceId = defineSecret('STRIPE_PRICE_ID');

function getStripe(secretKey) {
  return require('stripe')(secretKey);
}

async function setSubscriptionStatus(uid, active, provider, extra = {}) {
  await firestore.doc(`users/${uid}/subscription/status`).set(
    {
      active,
      provider,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...extra,
    },
    { merge: true },
  );
}

// ---------- RevenueCat Webhook ----------

exports.revenuecatWebhook = onRequest(
  { secrets: [revenuecatWebhookAuth] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed');
      return;
    }

    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${revenuecatWebhookAuth.value()}`) {
      res.status(401).send('Unauthorized');
      return;
    }

    const event = req.body?.event ?? req.body;
    const uid = event.app_user_id;

    if (!uid) {
      res.status(400).send('Missing app_user_id');
      return;
    }

    const activeEvents = [
      'INITIAL_PURCHASE',
      'RENEWAL',
      'UNCANCELLATION',
      'NON_RENEWING_PURCHASE',
      'PRODUCT_CHANGE',
    ];
    const inactiveEvents = [
      'CANCELLATION',
      'EXPIRATION',
      'BILLING_ISSUE',
    ];

    const eventType = event.type;
    let active;

    if (activeEvents.includes(eventType)) {
      active = true;
    } else if (inactiveEvents.includes(eventType)) {
      active = false;
    } else {
      res.status(200).send('Event type ignored');
      return;
    }

    await setSubscriptionStatus(uid, active, 'revenuecat', {
      lastEvent: eventType,
      productId: event.product_id || null,
    });

    res.status(200).send('ok');
  },
);

// ---------- Stripe Webhook ----------

exports.stripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeWebhookSecret] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed');
      return;
    }

    const stripe = getStripe(stripeSecretKey.value());
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        stripeWebhookSecret.value(),
      );
    } catch (err) {
      console.error('Stripe signature verification failed:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const relevantEvents = [
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ];

    if (!relevantEvents.includes(event.type)) {
      res.status(200).send('Event type ignored');
      return;
    }

    const subscription = event.data.object;
    const uid = subscription.metadata?.firebase_uid;

    if (!uid) {
      console.warn('Stripe subscription missing firebase_uid metadata');
      res.status(200).send('No firebase_uid, skipped');
      return;
    }

    const active = subscription.status === 'active' || subscription.status === 'trialing';

    await setSubscriptionStatus(uid, active, 'stripe', {
      stripeSubscriptionId: subscription.id,
      stripeStatus: subscription.status,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    });

    res.status(200).send('ok');
  },
);

// ---------- Stripe Checkout Session Creator ----------

exports.createCheckoutSession = onCall(
  { secrets: [stripeSecretKey, stripePriceId] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }

    const stripe = getStripe(stripeSecretKey.value());
    const uid = request.auth.uid;

    const successUrl = request.data?.successUrl || 'https://gametap.app/subscription/success';
    const cancelUrl = request.data?.cancelUrl || 'https://gametap.app/subscription/cancel';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: stripePriceId.value(), quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: uid,
      subscription_data: {
        metadata: { firebase_uid: uid },
      },
    });

    return { url: session.url };
  },
);
