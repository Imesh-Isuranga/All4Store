package com.store4all.ecommerce.dto;

import com.store4all.ecommerce.entity.Address;
import com.store4all.ecommerce.entity.Customer;
import com.store4all.ecommerce.entity.Order;
import com.store4all.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
