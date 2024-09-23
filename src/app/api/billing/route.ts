import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const billingDetails = await request.json();
    const transactionData = billingDetails.transactionData;
    console.log("billingDetails:", billingDetails);
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const formattedBillingDetails = {
      user_id: userId,
      transaction_id: transactionData.transaction_id,
      status: transactionData.status,
      currency_code: transactionData.currency_code,
      customer_email: transactionData.customer.email,
      customer_country: transactionData.customer.address.country_code,
      customer_postal_code: transactionData.customer.address.postal_code,
      plan_type: billingDetails.planType,
      price_id: transactionData.items[0].price_id,
      price_name: transactionData.items[0].price_name,
      product_id: transactionData.items[0].product.id,
      product_name: transactionData.items[0].product.name,
      billing_interval: transactionData.items[0].billing_cycle.interval,
      billing_frequency: transactionData.items[0].billing_cycle.frequency,
      quantity: transactionData.items[0].quantity,
      subtotal: transactionData.recurring_totals.subtotal,
      tax: transactionData.recurring_totals.tax,
      total: transactionData.recurring_totals.total,
      discount: transactionData.recurring_totals.discount,
      payment_method: transactionData.payment.method_details.type,
      card_type: transactionData.payment.method_details.card.type,
      card_last4: transactionData.payment.method_details.card.last4,
      card_expiry_month:
        transactionData.payment.method_details.card.expiry_month,
      card_expiry_year: transactionData.payment.method_details.card.expiry_year,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("billing_transactions")
      .insert(formattedBillingDetails)
      .select();

    console.log("error:", error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Billing details inserted successfully", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in billing API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
