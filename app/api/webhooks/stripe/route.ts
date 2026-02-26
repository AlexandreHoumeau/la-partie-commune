import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'


export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const agencyId = session.metadata?.agency_id

                if (agencyId && session.customer) {
                    const { error } = await supabaseAdmin
                        .from('agencies')
                        .update({
                            plan: 'PRO',
                            stripe_customer_id: session.customer as string,
                            subscription_status: 'active',
                        })
                        .eq('id', agencyId)

                    if (error) console.error('checkout.session.completed update error:', error)
                }
                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription
                const agencyId = subscription.metadata?.agency_id

                if (agencyId) {
                    const { error } = await supabaseAdmin
                        .from('agencies')
                        .update({ subscription_status: subscription.status })
                        .eq('id', agencyId)

                    if (error) console.error('customer.subscription.updated error:', error)
                }
                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                const agencyId = subscription.metadata?.agency_id

                if (agencyId) {
                    const { error } = await supabaseAdmin
                        .from('agencies')
                        .update({ plan: 'FREE', subscription_status: 'inactive' })
                        .eq('id', agencyId)

                    if (error) console.error('customer.subscription.deleted error:', error)
                }
                break
            }

            default:
                // Ignorer les autres events
                break
        }
    } catch (err: any) {
        console.error('Webhook handler error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}
