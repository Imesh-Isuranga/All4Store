package com.store4all.ecommerce.service;

import com.store4all.ecommerce.dto.PaymentInfo;
import com.store4all.ecommerce.dto.Purchase;
import com.store4all.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
