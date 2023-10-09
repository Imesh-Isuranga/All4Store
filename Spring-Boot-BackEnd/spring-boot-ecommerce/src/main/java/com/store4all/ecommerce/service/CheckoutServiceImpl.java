package com.store4all.ecommerce.service;

import com.store4all.ecommerce.dao.CustomerRepository;
import com.store4all.ecommerce.dto.Purchase;
import com.store4all.ecommerce.dto.PurchaseResponse;
import com.store4all.ecommerce.entity.Customer;
import com.store4all.ecommerce.entity.Order;
import com.store4all.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItem
        Set<OrderItem> orderItems = purchase.getOrderItems();
        for (OrderItem item : orderItems) {
            order.add(item);
        }

        //populate order with billingAdress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        //save to the database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        //generate a rrandom UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }
}
