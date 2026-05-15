package com.autonoma.erp.repository;

import com.autonoma.erp.model.InductionMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InductionMasterRepository extends JpaRepository<InductionMaster, Long> {
    @Query("SELECT MAX(i.id) FROM InductionMaster i")
    Long findMaxId();
}
