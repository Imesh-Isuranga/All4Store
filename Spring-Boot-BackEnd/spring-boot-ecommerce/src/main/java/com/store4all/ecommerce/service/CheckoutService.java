package com.store4all.ecommerce.service;

import com.store4all.ecommerce.dto.Purchase;
import com.store4all.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
