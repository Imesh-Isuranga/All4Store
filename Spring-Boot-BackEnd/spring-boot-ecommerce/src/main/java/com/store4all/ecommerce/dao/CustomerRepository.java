package com.store4all.ecommerce.dao;

import com.store4all.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer,Long> {

    Customer findByEmail(String theEmail);//SELECT * FROM Customer c WHERE c.email = theEmail
}
