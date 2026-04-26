package com.ws101.carpiocebuano.ecommerceapi.repository;

import com.ws101.carpiocebuano.ecommerceapi.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for Order entity.
 *
 * @author Carpio, Lyndel J. & Cebuano, Irene A.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Method naming - find by customer email
    List<Order> findByCustomerEmail(String email);

    // Method naming - find by status
    List<Order> findByStatus(String status);

    // Custom query - find orders within date range
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findOrdersByDateRange(@Param("startDate") String startDate,
                                      @Param("endDate") String endDate);
}